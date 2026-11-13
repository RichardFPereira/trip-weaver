// PreToolUse (Bash|PowerShell): blocks shell commands that bypass the human-approval flow.
import { readPayload, block, currentBranch, hasCommits, mentionsSecret } from "./lib.mjs";

const payload = await readPayload();
const command = String(payload?.tool_input?.command ?? "");
if (!command) process.exit(0);

const normalized = command.replace(/\s+/g, " ");

// 1. Merging is exclusive to the Tech Lead.
if (/\bgh\s+pr\s+merge\b/i.test(normalized)) {
  block("Merging PRs is reserved for the human Tech Lead. Report that the PR is ready instead.");
}

// 2. No history rewriting on the remote.
if (/\bgit\s+push\b[^|;&]*(\s--force(-with-lease)?\b|\s-f\b)/i.test(normalized)) {
  block("Force push is not allowed. Create a new commit instead of rewriting history.");
}

// 3. No direct pushes to main.
if (/\bgit\s+push\b[^|;&]*\bmain\b/i.test(normalized)) {
  block("Pushing to main is not allowed. Push the feature branch and open a PR.");
}

// 4. No commits or bare pushes while on main (bootstrap commit allowed when the repo has no commits yet).
const branch = currentBranch();
if (branch === "main" && hasCommits()) {
  if (/\bgit\s+commit\b/i.test(normalized)) {
    block("You are on main. Create a branch first: git switch -c feature/<issue>-<slug>.");
  }
  if (/\bgit\s+push\s*($|[|;&])/i.test(normalized)) {
    block("You are on main. Push a feature branch instead.");
  }
}

// 5. Skipping git hooks defeats the guardrails.
if (/\bgit\b[^|;&]*\s--no-verify\b/i.test(normalized)) {
  block("--no-verify is not allowed. Fix the failing check instead.");
}

// 6. Secret files must not be read or printed via the shell.
if (mentionsSecret(normalized)) {
  block("This command references a secret file (.env, *.local.json, certificates). Ask the Tech Lead instead.");
}

process.exit(0);
