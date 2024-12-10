#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");

const projectName = process.argv[2] || "react-express-app";
const frontend = projectName + "/frontend";
const backend = projectName + "/backend";

fs.mkdirSync(frontend, { recursive: true });
fs.mkdirSync(backend, { recursive: true });

console.log(`[01/10] Creating React frontend using Vite with TypeScript...`);
execSync(`cd ${frontend} && npm create vite@latest . -- --template react-ts`);

console.log(`[02/10] Formatting App.tsx in frontend...`);
fs.writeFileSync(
  `${frontend}/src/App.tsx`,
  `function App(){
    return <div>
      What's goin on vatos locos?
    </div>
}
export default App;
`
);

console.log(`[03/10] Cleaning App.css in frontend...`);
fs.writeFileSync(`${frontend}/src/App.css`, ``);

console.log(`[04/10] Installing Tailwind CSS and initializing configuration...`);
execSync(
  `cd ${frontend} && npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`
);

console.log(`[05/10] Configuring Tailwind CSS...`);
const tailwindConfigPath = `${frontend}/tailwind.config.js`;
fs.writeFileSync(
  tailwindConfigPath,
  `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`
);

console.log(`[06/10] Adding Tailwind base, components, and utilities to index.css...`);
const cssFilePath = `${frontend}/src/index.css`;
fs.writeFileSync(cssFilePath, `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`);

console.log(`[07/10] Setting up TypeScript in backend...`);
execSync(`cd ${backend} && npm init -y && npm i -g typescript && npx tsc --init`);

console.log(`[08/10] Installing Express and its type definitions...`);
execSync(`cd ${backend} && npm i express @types/express`);

console.log(`[09/10] Creating basic Express server in backend...`);
fs.mkdirSync(`${backend}/src`, { recursive: true });
fs.writeFileSync(
  `${backend}/src/index.ts`,
  `import express from 'express'
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(\`App is listening on port \${port}\`);
});
`
);

console.log(`[10/10] Updating tsconfig.json and package.json in backend...`);
const tsConfigPath = `${backend}/tsconfig.json`;
let tsConfigContent = fs.readFileSync(tsConfigPath, "utf-8");
tsConfigContent = tsConfigContent.replace(
  /\/\/ "rootDir":\s*".*?"/,
  `"rootDir": "./src"`
);
tsConfigContent = tsConfigContent.replace(
  /\/\/ "outDir":\s*".*?"/,
  `"outDir": "./dist"`
);
fs.writeFileSync(tsConfigPath, tsConfigContent);

const packageJsonPath = `${backend}/package.json`;
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
packageJson.scripts = {
  build: "tsc -b",
  start: "node dist/index.js",
  dev: "npm run build && npm run start",
};
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log(`\nSetup complete! 🚀\n`);
console.log(`Frontend: ${frontend}`);
console.log(`Backend: ${backend}`);
