import { app, BrowserWindow } from 'electron';
import { join } from 'path';

function createWindow() {
	const win = new BrowserWindow({
		width: 1024,
		height: 768,
		minWidth: 800,
		minHeight: 600,
		title: 'All or Nothing',
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			preload: join(__dirname, 'preload.js'),
		},
	});

	const devServerUrl = process.env['VITE_DEV_SERVER_URL'];

	if (devServerUrl) {
		win.loadURL(devServerUrl);
	} else {
		win.loadFile(join(__dirname, '../dist/web/index.html'));
	}
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => app.quit());
