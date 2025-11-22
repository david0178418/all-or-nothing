import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import electron from 'vite-plugin-electron';

// https://vitejs.dev/config/
export default defineConfig({
	base: './',
	build: {
		target: 'esnext',
		outDir: 'dist-electron-renderer',
		rollupOptions: {
			input: resolve(__dirname, 'index.electron.html'),
		},
	},
	plugins: [
		react(),
		electron([
			{
				// Main process entry point
				entry: 'electron/main.ts',
				vite: {
					build: {
						outDir: 'dist-electron',
						lib: {
							entry: 'electron/main.ts',
							formats: ['es'],
							fileName: () => 'main.js',
						},
						rollupOptions: {
							external: ['electron'],
						},
					},
				},
			},
			{
				// Preload script
				entry: 'electron/preload.ts',
				vite: {
					build: {
						outDir: 'dist-electron',
						lib: {
							entry: 'electron/preload.ts',
							formats: ['cjs'],
							fileName: () => 'preload.js',
						},
						rollupOptions: {
							external: ['electron'],
						},
					},
				},
			},
		]),
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
});
