#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

// Build with Vite
execSync('vite build --config vite.config.electron.ts', { stdio: 'inherit' });

// Prepare staging directory
rmSync('dist-electron-app', { recursive: true, force: true });
mkdirSync('dist-electron-app', { recursive: true });
cpSync('dist-electron', 'dist-electron-app/dist-electron', { recursive: true });
cpSync('dist-electron-renderer', 'dist-electron-app/dist-electron-renderer', { recursive: true });

// Generate minimal package.json for electron-builder
const electronPkg = {
	name: pkg.name,
	version: pkg.version,
	main: 'dist-electron/main.js',
	author: pkg.author || '',
	license: pkg.license || 'ISC',
};

writeFileSync('dist-electron-app/package.json', JSON.stringify(electronPkg, null, '\t'));
