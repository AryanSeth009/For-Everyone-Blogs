import { execSync } from "child_process";

try {
  // Install dependencies
  console.log("Installing dependencies...");
  execSync("npm install @vitejs/plugin-react --save-dev", { stdio: "inherit" });
  console.log("@vitejs/plugin-react installed");

  // Run the build
  console.log("Running build...");
  execSync("vite build", { stdio: "inherit" });
  console.log("Build complete");
} catch (error) {
  console.error("Build failed:", error);
  process.exit(1);
}
