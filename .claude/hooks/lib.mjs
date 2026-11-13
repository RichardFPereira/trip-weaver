// Shared helpers for Claude Code hooks.
// Contract: hooks receive a JSON payload on stdin. Exit code 2 blocks the action
// and sends stderr back to the agent; exit code 0 allows it.
import { execSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

export const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

export async function readPayload() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  return raw ? JSON.parse(raw) : {};
}

export function block(reason) {
  process.stderr.write(`[guardrail] ${reason}\n`);
  process.exit(2);
}

export function run(command, options = {}) {
  return execSync(command, { cwd: projectDir, stdio: ["ignore", "pipe", "pipe"], encoding: "utf8", ...options });
}

export function tryRun(command) {
  try {
    return { ok: true, output: run(command) };
  } catch (error) {
    return { ok: false, output: `${error.stdout ?? ""}${error.stderr ?? ""}` };
  }
}

export function currentBranch() {
  const result = tryRun("git symbolic-ref --short HEAD");
  return result.ok ? result.output.trim() : null;
}

export function hasCommits() {
  return tryRun("git rev-parse --verify HEAD").ok;
}

export function findSolution() {
  if (!existsSync(projectDir)) return null;
  const file = readdirSync(projectDir).find((name) => name.endsWith(".slnx") || name.endsWith(".sln"));
  return file ? join(projectDir, file) : null;
}

export const SECRET_PATTERNS = [
  /(^|[\\/\s"'])\.env(\.(?!example\b)[\w.-]+)?($|[\s"'])/i,
  /appsettings\.[\w-]+\.local\.json/i,
  /\.(pfx|pem|key)($|[\s"'])/i,
  /secrets?\.json/i,
];

export function mentionsSecret(text) {
  return SECRET_PATTERNS.some((pattern) => pattern.test(text));
}
