import { Agent, CursorAgentError, type SDKAgent, type SDKJsonValue } from "@cursor/sdk";

export type AgentSession = {
  agentId: string;
  send: (prompt: string, onText?: (chunk: string) => void) => Promise<void>;
  dispose: () => Promise<void>;
};

type RenderResult = { ok: true; message: string } | { ok: false; message: string };

export async function createAgentSession(opts: {
  catalogPrompt: string;
  renderUiSchema: Record<string, SDKJsonValue>;
  onRenderUi: (tree: unknown) => RenderResult;
}): Promise<AgentSession> {
  const apiKey = process.env.CURSOR_API_KEY;
  if (!apiKey) throw new Error("CURSOR_API_KEY is required for live mode");

  const agent: SDKAgent = await Agent.create({
    apiKey,
    model: { id: process.env.CURSOR_MODEL ?? "composer-2.5" },
    local: {
      cwd: process.cwd(),
      settingSources: [],
      customTools: {
        render_ui: {
          description:
            "Render a constrained generative UI screen in the host. Pass a complete screen tree. Never pass HTML.",
          inputSchema: opts.renderUiSchema,
          async execute(args) {
            const tree = (args as { tree?: unknown }).tree ?? args;
            const result = opts.onRenderUi(tree);
            if (!result.ok) {
              return { content: [{ type: "text", text: result.message }], isError: true };
            }
            return result.message;
          },
        },
      },
    },
  });

  return {
    agentId: agent.agentId,
    async send(prompt, onText) {
      try {
        const run = await agent.send(prompt);
        console.log(`run.id=${run.id} agent=${agent.agentId}`);
        for await (const event of run.stream()) {
          if (event.type === "assistant") {
            for (const block of event.message.content) {
              if (block.type === "text" && block.text) onText?.(block.text);
            }
          }
        }
        const result = await run.wait();
        if (result.status === "error") {
          throw new Error(`Agent run failed: ${result.id}`);
        }
      } catch (err) {
        if (err instanceof CursorAgentError) {
          throw new Error(
            `Agent startup/runtime error: ${err.message} (retryable=${err.isRetryable})`,
          );
        }
        throw err;
      }
    },
    async dispose() {
      await agent[Symbol.asyncDispose]();
    },
  };
}
