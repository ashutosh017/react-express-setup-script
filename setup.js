#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");

const projectName = process.argv[2] || "react-express-app";
const frontend = projectName + "/frontend";
const backend = projectName + "/backend";

fs.mkdirSync(frontend, { recursive: true });
fs.mkdirSync(backend, { recursive: true });

execSync(`cd ${frontend} && npm create vite@latest . -- --template react-ts`, {
  stdio: "inherit",
});
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
fs.writeFileSync(`${frontend}/src/App.css`, ``);

console.log("[1/2] Setting up tailwind...");

execSync(
  `cd ${frontend} && npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p`,
  // { stdio: "inherit" }
);

const tailwindConfigPath = `${frontend}/tailwind.config.js`;
const tailwindConfig = `
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
`;
fs.writeFileSync(tailwindConfigPath, tailwindConfig);

const cssFilePath = `${frontend}/src/index.css`;
const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;
fs.writeFileSync(cssFilePath, cssContent);

console.log("\n[2/2] Setting typescript in backend...\n")

execSync(
  `cd ${backend} && npm init -y && npm i -g typescript && npx tsc --init`,
  {
    stdio: "inherit",
  }
);
execSync(`cd ${backend} && npm i express @types/express`)
fs.mkdirSync(`${backend}/src`, { recursive: true });
fs.writeFileSync(`${backend}/src/index.ts`, 
`import express from 'express'
const app = express();
const port = 3000;

app.get("/",(req,res)=>{
  res.send("Hello world");
})

app.listen(port,()=>{
  console.log(\`app is listening on port \${port}\`);
})
  `
);
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
