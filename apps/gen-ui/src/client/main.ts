import {
  DUMMY_DATASETS,
  renderUiTree,
  type UiAction,
  type UiTree,
} from "@playground/gen-ui";
import "@playground/theme/theme.css";

type ServerMessage =
  | { type: "hello"; mode: "mock" | "live" }
  | { type: "ui"; tree: UiTree }
  | { type: "log"; role: "user" | "agent" | "system" | "error"; text: string }
  | { type: "status"; busy: boolean };

const uiRoot = document.querySelector<HTMLElement>("#ui-root")!;
const logEl = document.querySelector<HTMLElement>("#log")!;
const form = document.querySelector<HTMLFormElement>("#chat-form")!;
const input = document.querySelector<HTMLInputElement>("#chat-input")!;
const modeBadge = document.querySelector<HTMLElement>("#mode-badge")!;
const sendBtn = form.querySelector<HTMLButtonElement>("button[type='submit']")!;

let busy = false;

function setBusyUi(next: boolean) {
  busy = next;
  // Keep the text field editable so a hung agent cannot lock typing.
  input.disabled = false;
  input.readOnly = false;
  sendBtn.disabled = next;
  sendBtn.textContent = next ? "Running…" : "Send";
}

function appendLog(role: "user" | "agent" | "system" | "error", text: string) {
  const item = document.createElement("div");
  item.className = `log__item log__item--${role}`;
  item.textContent = text;
  logEl.append(item);
  logEl.scrollTop = logEl.scrollHeight;
}

function paint(tree: UiTree) {
  renderUiTree(tree, uiRoot, {
    datasets: DUMMY_DATASETS,
    onAction: (action) => {
      if (busy) return;
      send({ type: "action", action });
    },
  });
}

function send(msg: { type: "chat"; text: string } | { type: "action"; action: UiAction }) {
  if (ws.readyState !== WebSocket.OPEN) {
    appendLog("error", "Not connected to host");
    return;
  }
  ws.send(JSON.stringify(msg));
}

const proto = location.protocol === "https:" ? "wss" : "ws";
const ws = new WebSocket(`${proto}://${location.host}/ws`);

ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(String(ev.data)) as ServerMessage;
  switch (msg.type) {
    case "hello":
      modeBadge.textContent = msg.mode === "mock" ? "mock mode" : "live · Cursor SDK";
      break;
    case "ui":
      paint(msg.tree);
      break;
    case "log":
      appendLog(msg.role, msg.text);
      break;
    case "status":
      setBusyUi(msg.busy);
      break;
  }
});

ws.addEventListener("open", () => {
  appendLog("system", "Connected to host");
  setBusyUi(false);
});

ws.addEventListener("close", () => {
  appendLog("error", "Disconnected");
  setBusyUi(false);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text || busy) return;
  input.value = "";
  send({ type: "chat", text });
});
