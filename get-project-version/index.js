const core = require("@actions/core");
const fs = require("fs");
const path = require("path");

try {
  core.warning("This action is DEPRECATED and will be removed in a future release. Please use 'Get Project Information'");
  let version = null;
  const pkgPath = core.getInput("project-version-file-full-path");

  if (pkgPath && fs.existsSync(pkgPath)) {
    if (pkgPath.endsWith(".json")) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
      version = pkg.version;
      core.info(`Found version in ${pkgPath}: ${version}`);
    } else if (pkgPath.endsWith(".csproj")) {
      const csprojContent = fs.readFileSync(pkgPath, "utf8");
      const match = csprojContent.match(/<Version>(.*?)<\/Version>/);
      if (match && match[1]) {
        version = match[1];
        core.info(`Found version in ${pkgPath}: ${version}`);
      }
    }
  } else {
    // Look for a .csproj file in the current directory
    const files = fs.readdirSync(process.cwd());
    const csprojFile = files.find((f) => f.endsWith(".csproj"));

    if (csprojFile) {
      const csprojPath = path.join(process.cwd(), csprojFile);
      const csprojContent = fs.readFileSync(csprojPath, "utf8");
      const match = csprojContent.match(/<Version>(.*?)<\/Version>/);

      if (match && match[1]) {
        version = match[1];
        core.info(`Found version in ${csprojFile}: ${version}`);
      }
    }
  }

  if (!version) {
    throw new Error("Could not find version in package.json or .csproj");
  }

  core.setOutput("version", version);
} catch (error) {
  core.setFailed(error.message);
}
