import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		target: 'esnext',
	},
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Make a Set',
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
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
});
