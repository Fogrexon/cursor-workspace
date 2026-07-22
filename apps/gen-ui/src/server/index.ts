import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { WebSocketServer, type WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import {
  CATALOG_PROMPT,
  DUMMY_DATASETS,
  RENDER_UI_INPUT_SCHEMA,
  SALES_ANALYSIS_FIXTURE,
  USER_LOG_ANALYSIS_FIXTURE,
  TASK_EMPTY_FIXTURE,
  TASK_FORM_FIXTURE,
  TASK_LIST_FIXTURE,
  validateUiTree,
  type UiAction,
  type UiTree,
} from "@playground/gen-ui";
import { createAgentSession, type AgentSession } from "./agent.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../..");
const mockMode = process.env.GEN_UI_MOCK === "1" || !process.env.CURSOR_API_KEY;
const port = Number(process.env.PORT ?? 5177);

type ClientMsg =
  | { type: "chat"; text: string }
  | { type: "action"; action: UiAction };

type OutMsg =
  | { type: "hello"; mode: "mock" | "live" }
  | { type: "ui"; tree: UiTree }
  | { type: "log"; role: "user" | "agent" | "system" | "error"; text: string }
  | { type: "status"; busy: boolean };

function broadcast(clients: Set<WebSocket>, msg: OutMsg) {
  const raw = JSON.stringify(msg);
  for (const c of clients) {
    if (c.readyState === c.OPEN) c.send(raw);
  }
}

async function main() {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: "/ws" });
  const clients = new Set<WebSocket>();

  let currentTree: UiTree = USER_LOG_ANALYSIS_FIXTURE;
  let session: AgentSession | null = null;
  let busy = false;

  const pushUi = (tree: UiTree) => {
    currentTree = tree;
    broadcast(clients, { type: "ui", tree });
  };

  const pushLog = (role: "user" | "agent" | "system" | "error", text: string) => {
    broadcast(clients, { type: "log", role, text });
  };

  const setBusy = (next: boolean) => {
    busy = next;
    broadcast(clients, { type: "status", busy });
  };

  const applyTree = (
    input: unknown,
  ): { ok: true; nodeCount: number } | { ok: false; errors: string[] } => {
    const result = validateUiTree(input, DUMMY_DATASETS);
    if (!result.ok) return result;
    pushUi(result.tree);
    return { ok: true, nodeCount: result.nodeCount };
  };

  if (!mockMode) {
    session = await createAgentSession({
      catalogPrompt: CATALOG_PROMPT,
      renderUiSchema: RENDER_UI_INPUT_SCHEMA as unknown as Record<
        string,
        import("@cursor/sdk").SDKJsonValue
      >,
      onRenderUi: (tree) => {
        const result = applyTree(tree);
        if (!result.ok) {
          return {
            ok: false,
            message: `Validation failed:\n${result.errors.join("\n")}`,
          };
        }
        return {
          ok: true,
          message: `UI rendered (${result.nodeCount} nodes). title="${currentTree.title}". Filters/charts update locally.`,
        };
      },
    });
    pushLog("system", `Live agent ready (${session.agentId})`);
  } else {
    pushLog(
      "system",
      "Mock mode — try: logs / sales / list / form. dataView filters run locally.",
    );
  }

  const handleMockChat = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes("form") || t.includes("追加") || t.includes("new")) {
      applyTree(TASK_FORM_FIXTURE);
      pushLog("agent", "Mock: showing create-task form");
      return;
    }
    if (t.includes("empty") || t.includes("空")) {
      applyTree(TASK_EMPTY_FIXTURE);
      pushLog("agent", "Mock: empty state");
      return;
    }
    if (t.includes("list") || t.includes("task")) {
      applyTree(TASK_LIST_FIXTURE);
      pushLog("agent", "Mock: task list fixture");
      return;
    }
    applyTree(USER_LOG_ANALYSIS_FIXTURE);
    pushLog("agent", "Mock: user_logs analysis dataView (filters are local)");
  };

  const handleMockAction = (action: UiAction) => {
    pushLog("system", `Action ${action.actionId} ${JSON.stringify(action)}`);
    if (action.actionId === "add_task" || action.actionId === "create_first") {
      applyTree(TASK_FORM_FIXTURE);
      return;
    }
    if (action.actionId === "create_task") {
      applyTree(TASK_LIST_FIXTURE);
      pushLog("agent", `Mock: created task ${JSON.stringify(action.values ?? {})}`);
      return;
    }
    if (action.actionId === "cancel_create" || action.actionId === "clear_done") {
      applyTree(TASK_LIST_FIXTURE);
      return;
    }
    if (action.actionId === "open_task") {
      pushLog("agent", `Mock: opened task #${action.payload ?? "?"}`);
    }
  };

  const runLive = async (prompt: string) => {
    if (!session) return;
    setBusy(true);
    const timeoutMs = Number(process.env.GEN_UI_AGENT_TIMEOUT_MS ?? 180_000);
    try {
      let buffer = "";
      await Promise.race([
        session.send(prompt, (chunk) => {
          buffer += chunk;
          if (buffer.length > 400) {
            pushLog("agent", buffer);
            buffer = "";
          }
        }),
        new Promise<never>((_, reject) => {
          setTimeout(
            () => reject(new Error(`Agent timed out after ${timeoutMs}ms`)),
            timeoutMs,
          );
        }),
      ]);
      if (buffer) pushLog("agent", buffer);
    } catch (err) {
      pushLog("error", err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  wss.on("connection", (ws) => {
    clients.add(ws);
    ws.send(
      JSON.stringify({
        type: "hello",
        mode: mockMode ? "mock" : "live",
      } satisfies OutMsg),
    );
    ws.send(JSON.stringify({ type: "ui", tree: currentTree } satisfies OutMsg));
    // New sockets start interactive even if a previous run left busy=true.
    ws.send(JSON.stringify({ type: "status", busy: false } satisfies OutMsg));

    ws.on("message", async (data) => {
      let msg: ClientMsg;
      try {
        msg = JSON.parse(String(data)) as ClientMsg;
      } catch {
        return;
      }

      if (msg.type === "chat") {
        if (busy) {
          pushLog("system", "Agent is still running — wait for it to finish or reconnect.");
          return;
        }
        pushLog("user", msg.text);
        if (mockMode) handleMockChat(msg.text);
        else {
          await runLive(
            `${CATALOG_PROMPT}\n\nUser request:\n${msg.text}\n\nCall render_ui with a complete screen tree. Prefer dataView for analysis.`,
          );
        }
      } else if (msg.type === "action") {
        if (busy) {
          pushLog("system", "Ignoring structural action while agent is running.");
          return;
        }
        // Structural actions only. dataView filters never reach here.
        pushLog("user", `action:${msg.action.actionId}`);
        if (mockMode) handleMockAction(msg.action);
        else {
          await runLive(
            `Structural UI action (not a data filter). Update via render_ui only if the screen layout must change:\n${JSON.stringify(msg.action, null, 2)}`,
          );
        }
      }
    });

    ws.on("close", () => clients.delete(ws));
  });

  const vite = await createViteServer({
    root: path.join(rootDir, "src/client"),
    configFile: path.join(rootDir, "vite.host.config.ts"),
    server: { middlewareMode: true },
    appType: "custom",
    resolve: {
      alias: {
        "@playground/gen-ui": path.resolve(rootDir, "../../lib/gen-ui/src/index.ts"),
        "@playground/theme": path.resolve(rootDir, "../../lib/theme"),
      },
    },
  });

  app.use(vite.middlewares);
  app.use(async (req, res, next) => {
    if (req.method !== "GET") return next();
    try {
      const htmlPath = path.join(rootDir, "src/client/index.html");
      const html = await fs.readFile(htmlPath, "utf-8");
      const transformed = await vite.transformIndexHtml(req.originalUrl, html);
      res.status(200).set({ "Content-Type": "text/html" }).end(transformed);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  server.listen(port, () => {
    console.log(
      `gen-ui host http://localhost:${port}  mode=${mockMode ? "mock" : "live"}`,
    );
  });

  const shutdown = async () => {
    await session?.dispose();
    await vite.close();
    server.close();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
