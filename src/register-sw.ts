export async function registerSW() {
	try {
		await navigator.serviceWorker.register('/sw.js', { scope: '/' })
		console.log('Service worker registered')
	} catch(err) {
		console.error('Service worker registration failed:', err);
	}
}
