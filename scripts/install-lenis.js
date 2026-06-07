const { execSync } = require("child_process")
execSync("pnpm add lenis@^1.3.4", {
  cwd: "/vercel/share/v0-project",
  stdio: "inherit",
})
console.log("lenis installed successfully")
