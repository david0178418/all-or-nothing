/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly BASE_URL: string;
	readonly DEV: boolean;
	readonly MODE: string;
	readonly PROD: boolean;
	readonly PUBLIC_DIR?: string;
	readonly SSR: boolean;
	readonly VITE_AD_CONTENT_URL: string;
	readonly VITE_GOOGLE_ANALYTICS_ID: string;
	readonly VITE_USER_NODE_ENV: "development";
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
