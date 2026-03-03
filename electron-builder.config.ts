import type { Configuration } from 'electron-builder';
import { rm } from 'fs/promises';
import { join } from 'path';

const steamDirsToRemove: Readonly<Record<'linux' | 'win32' | 'darwin', readonly string[]>> = {
	linux: ['osx', 'win64'],
	win32: ['linux64', 'osx'],
	darwin: ['linux64', 'win64'],
} as const;

const config: Configuration = {
	appId: 'app.allornothing.game',
	productName: 'All or Nothing',
	directories: {
		output: 'dist/desktop',
	},
	files: [
		'dist/web/**/*',
		'dist-electron/**/*',
		'!steam_appid.txt',
	],
	electronLanguages: ['en-US'],
	linux: {
		target: 'AppImage',
		category: 'Game',
	},
	win: {
		target: 'zip',
	},
	publish: null,
	extraMetadata: {
		main: 'dist-electron/main.js',
	},
	afterPack: async function removeUnneededFiles(context) {
		const { appOutDir, electronPlatformName } = context;

		const dirsToRemove = steamDirsToRemove[electronPlatformName] ?? [];
		const steamBase = join(
			appOutDir, 'resources', 'app.asar.unpacked',
			'node_modules', 'steamworks.js', 'dist',
		);

		await Promise.all([
			rm(join(appOutDir, 'LICENSES.chromium.html'), { force: true }),
			...dirsToRemove.map(dir => rm(join(steamBase, dir), { recursive: true, force: true })),
		]);
	},
};

export default config;
