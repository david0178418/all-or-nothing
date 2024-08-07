import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	publicDir: process.env.PUBLIC_DIR || 'public',
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
});
