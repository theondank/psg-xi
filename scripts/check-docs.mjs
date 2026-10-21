#!/usr/bin/env node
/**
 * Vérifie la cohérence de la documentation. Aucune dépendance.
 *
 * 1. les liens relatifs entre fichiers Markdown pointent vers un fichier existant ;
 * 2. les « npm run <script> » cités existent dans package.json ;
 * 3. les chemins de fichiers cités entre backticks existent réellement.
 *
 * Usage : npm run docs:check
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const IGNORED_DIRS = new Set(['node_modules', 'dist', '.git', '.vite', 'coverage', '.claude/worktrees']);
const OPTIONAL_TARGETS = [/settings\.local\.json$/, /CLAUDE\.local\.md$/];
const GENERATED = [/^dist\//, /^node_modules\//, /\.tsbuildinfo$/];
const PATH_PREFIX = /^(src|docs|scripts|\.claude|\.github)\//;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.claude' && entry.name !== '.github') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name) || IGNORED_DIRS.has(relative(ROOT, full))) continue;
      out.push(...walk(full));
    } else {
      out.push(full);
    }
  }
  return out;
}

const files = walk(ROOT);
const markdownFiles = files.filter((file) => file.endsWith('.md'));
const packageJson = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const scripts = Object.keys(packageJson.scripts ?? {});

const errors = [];
let linksChecked = 0;
let scriptsChecked = 0;
let pathsChecked = 0;

for (const file of markdownFiles) {
  const text = readFileSync(file, 'utf8');
  const relativeFile = relative(ROOT, file);

  // 1. liens markdown relatifs
  for (const match of text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const target = match[1];
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const clean = target.split('#')[0];
    if (!clean) continue;
    linksChecked += 1;
    const resolved = resolve(dirname(file), decodeURIComponent(clean));
    try {
      statSync(resolved);
    } catch {
      errors.push(`${relativeFile}: lien mort -> ${target}`);
    }
  }

  // 2. scripts npm cités
  for (const match of text.matchAll(/npm run ([a-z0-9:_-]+)/g)) {
    const script = match[1];
    scriptsChecked += 1;
    if (!scripts.includes(script)) {
      errors.push(`${relativeFile}: script inconnu -> npm run ${script}`);
    }
  }

  // 3. chemins de fichiers entre backticks
  for (const match of text.matchAll(/`([^`\n]+)`/g)) {
    const candidate = match[1].trim();
    if (/\s/.test(candidate)) continue;
    if (/[*<>?{}]/.test(candidate)) continue;
    const isProjectPath = PATH_PREFIX.test(candidate) || candidate === 'package.json';
    if (!isProjectPath) continue;
    // Un chemin de fichier a une extension connue, ou désigne un dossier (`.../`).
    // Cela évite de confondre un nom de branche (`docs/harness`) avec un fichier.
    const looksLikePath =
      candidate.endsWith('/') || /\.(md|ts|tsx|css|json|mjs|js|yml|yaml|html)$/.test(candidate);
    if (!looksLikePath) continue;
    if (GENERATED.some((pattern) => pattern.test(candidate))) continue;
    if (OPTIONAL_TARGETS.some((pattern) => pattern.test(candidate))) continue;
    pathsChecked += 1;
    try {
      statSync(join(ROOT, candidate));
    } catch {
      errors.push(`${relativeFile}: chemin inexistant -> ${candidate}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`docs:check — ${String(errors.length)} problème(s)\n`);
  for (const error of errors) console.error(`  ✗ ${error}`);
  process.exit(1);
}

console.log(
  `docs:check — OK (${String(markdownFiles.length)} fichiers, ${String(linksChecked)} liens, ` +
    `${String(scriptsChecked)} scripts, ${String(pathsChecked)} chemins)`,
);
