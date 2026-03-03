import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { execSync } from 'child_process';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from "vite-plugin-svgr";

const gitVersion = execSync('git describe --tags --always').toString().trimEnd();

// https://vitejs.dev/config/
export default defineConfig(async () => {
	const isElectron = process.env['BUILD_TARGET'] === 'electron';

	const plugins: PluginOption[] = [
		react(),
		svgr(),
	];

	if (isElectron) {
		// @ts-expect-error - vite-plugin-electron is only installed for electron builds
		const { default: electron }: { default: (...args: unknown[]) => PluginOption[] } = await import('vite-plugin-electron');
		plugins.push(
			...electron([
				{
					entry: 'electron/main.ts',
					vite: {
						build: {
							outDir: 'dist/electron',
						},
					},
				},
				{
					entry: 'electron/preload.ts',
					onstart(args: { reload: () => void }) { args.reload(); },
				},
			])
		);
	} else {
		plugins.push(
			VitePWA({
				registerType: 'autoUpdate',
				manifest: {
					name: 'All or Nothing',
					orientation: 'portrait',
					short_name: 'All|Nothing',
					id: '/?source=pwa',
					start_url: '/?source=pwa',
					theme_color: '#ffffff',
					background_color: '#ffffff',
					display: 'standalone',
					icons: [
						{
							src: '/assets/android-chrome-192x192.png',
							sizes: '192x192',
							type: 'image/png'
						}, {
							src: '/assets/android-chrome-512x512.png',
							sizes: '512x512',
							type: 'image/png'
						}
					],
					screenshots: [
						{
							src: '/assets/screenshot-1.png',
							type: 'image/png',
							sizes: '880x540',
							form_factor: 'wide'
						},
						{
							src: '/assets/screenshot-2.png',
							type: 'image/png',
							sizes: '355x735',
							form_factor: 'narrow'
						}
					]
				}
			}),
		);
	}

	return {
		base: process.env['VITE_BASE'] ?? '/',
		define: {
			__APP_VERSION__: JSON.stringify(gitVersion),
		},
		build: {
			target: 'esnext',
			outDir: 'dist/web',
		},
		plugins,
		resolve: {
			alias: {
				'@': resolve(__dirname, './src'),
			},
		},
	};
});
