// PreToolUse (Read|Edit|Write|...): blocks file tools on secret files.
import { readPayload, block, mentionsSecret } from "./lib.mjs";

const payload = await readPayload();
const input = payload?.tool_input ?? {};
const path = String(input.file_path ?? input.notebook_path ?? input.path ?? "");

if (path && mentionsSecret(` ${path} `)) {
  block(`Access to secret file '${path}' is blocked. Secrets are managed by the Tech Lead (user-secrets / Key Vault).`);
}

process.exit(0);
