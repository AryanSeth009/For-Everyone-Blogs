const { execSync } = require("child_process");

try {
  // First ensure all dependencies are installed
  console.log("Installing all dependencies...");
  execSync("npm install", { stdio: "inherit" });
  console.log("All dependencies installed");

  // Specifically ensure vite and @vitejs/plugin-react are installed
  console.log("Ensuring Vite dependencies...");
  execSync("npm install vite @vitejs/plugin-react --save-dev", {
    stdio: "inherit",
  });
  console.log("Vite dependencies confirmed");

  // Run the build
  console.log("Running build...");
  execSync("npx vite build", { stdio: "inherit" });
  console.log("Build complete");
} catch (error) {
  console.error("Build failed:", error);
  process.exit(1);
}
