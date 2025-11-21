declare namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: 'development' | 'production';
		AD_CONTENT_URL?: string;
		GOOGLE_ANALYTICS_ID?: string;
	}
}

declare module '*.mp3' {
	const src: string;
	export default src;
}
