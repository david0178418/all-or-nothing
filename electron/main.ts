import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { registerSteamHandlers } from './steam-handlers';

const STEAM_APP_ID = 480; // Replace with real app ID

registerSteamHandlers(STEAM_APP_ID);

function createWindow() {
	const win = new BrowserWindow({
		width: 1024,
		height: 768,
		minWidth: 800,
		minHeight: 600,
		title: 'All or Nothing',
		webPreferences: {
			preload: join(__dirname, 'preload.js'),
			contextIsolation: true,
			nodeIntegration: false,
		},
	});

	if (process.env['VITE_DEV_SERVER_URL']) {
		win.loadURL(process.env['VITE_DEV_SERVER_URL']);
	} else {
		win.loadFile(join(__dirname, '../dist/web/index.html'));
	}
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
