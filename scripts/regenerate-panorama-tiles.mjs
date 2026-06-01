import { existsSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");
const outputDir = path.join(publicDir, "360photo");
const inputFile = path.join(publicDir, "360photo.jpg");
const generator = path.join(projectRoot, "python", "generate.py");
const defaultNona = "C:\\Program Files\\Hugin\\bin\\nona.exe";
const nona = process.env.NONA_BIN || defaultNona;

const assertInside = (target, parent) => {
  const relative = path.relative(parent, target);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Ruta fuera de ${parent}: ${target}`);
  }
};

if (!existsSync(inputFile)) {
  throw new Error(`No existe la imagen fuente: ${inputFile}`);
}

if (!existsSync(generator)) {
  throw new Error(`No existe el generador de Pannellum: ${generator}`);
}

if (!existsSync(nona)) {
  throw new Error(
    `No encuentro nona.exe en "${nona}". Instala Hugin o define NONA_BIN con la ruta correcta.`,
  );
}

assertInside(outputDir, publicDir);

if (existsSync(outputDir)) {
  rmSync(outputDir, { recursive: true, force: true });
}

const args = [
  generator,
  "-n",
  nona,
  "--hfov",
  "80",
  "--voffset",
  "0",
  "--haov",
  "200",
  "--vaov",
  "110",
  "--output",
  outputDir,
  inputFile,
];

const result = spawnSync("python", args, {
  cwd: projectRoot,
  stdio: "inherit",
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
