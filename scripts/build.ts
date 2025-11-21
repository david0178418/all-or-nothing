import { build } from 'bun';
import { cp } from 'node:fs/promises';
import { generateSW } from 'workbox-build';
import { browserslist } from '../package.json';

console.log('Building application');

await build({
	entrypoints: ['./src/index.html'],
	outdir: './dist',
	splitting: true,
	target: 'browser',
	sourcemap: true,
	minify: true,
	define: {
		'process.env.NODE_ENV': JSON.stringify(Bun.env.NODE_ENV || 'development'),
		'process.env.GOOGLE_ANALYTICS_ID': JSON.stringify(Bun.env.GOOGLE_ANALYTICS_ID || ''),
		'process.env.AD_CONTENT_URL': JSON.stringify(Bun.env.AD_CONTENT_URL || ''),
	},
});

console.log('Bundle complete. Copying assets:');

await cp('./src/static/manifest.json', './dist/static/manifest.json');

await cp('./src/static/assets', './dist/assets', { recursive: true });

console.log('Asset copy complete.  Generating Service Worker');

await generateSW({
	globDirectory: 'dist',
	globPatterns: [
		'**/*.{html,js,css,png,jpg,woff,woff2,mp3}'
	],
	swDest: 'dist/sw.js',
	navigateFallback: '/index.html',
	clientsClaim: true,
	skipWaiting: true,
	cleanupOutdatedCaches: true,
	babelPresetEnvTargets: [browserslist],
});

console.log('Service worker generated at dist/sw.js');

console.log('Build Complete');
