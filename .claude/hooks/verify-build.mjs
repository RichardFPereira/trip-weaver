// Stop: an agent cannot declare a task finished while the build or the fast test suite fails.
// Runs only when C#/project files changed, to keep conversations without code changes fast.
import { readPayload, block, tryRun, findSolution } from "./lib.mjs";

const payload = await readPayload();
if (payload?.stop_hook_active) process.exit(0); // avoid infinite loops

const solution = findSolution();
if (!solution) process.exit(0);

const status = tryRun("git status --porcelain");
const changedCode = status.ok && /\.(cs|csproj|slnx?|props|targets)\s*$/m.test(status.output);
if (!changedCode) process.exit(0);

const build = tryRun(`dotnet build "${solution}" -nologo --verbosity quiet`);
if (!build.ok) {
  block(`Build failed. Fix it before finishing:\n${build.output.slice(-3000)}`);
}

const tests = tryRun(`dotnet test "${solution}" --no-build -nologo --verbosity quiet --filter "Category!=Integration"`);
if (!tests.ok) {
  block(`Unit/architecture tests failed. Fix them before finishing:\n${tests.output.slice(-3000)}`);
}

process.exit(0);
