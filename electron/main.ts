import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Keep a global reference to prevent garbage collection
let mainWindow: BrowserWindow | null = null;

const isDev = process.env['NODE_ENV'] === 'development';
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 1280,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			contextIsolation: true,
			nodeIntegration: false,
		},
		// Match PWA portrait orientation preference
		resizable: true,
		title: 'All or Nothing',
	});

	// Load from Vite dev server in development, or from built files in production
	if (isDev && VITE_DEV_SERVER_URL) {
		mainWindow.loadURL(VITE_DEV_SERVER_URL);
		mainWindow.webContents.openDevTools();
	} else {
		mainWindow.loadFile(path.join(__dirname, '../dist-electron-renderer/index.electron.html'));
	}

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

// Create window when Electron is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// On macOS, re-create window when dock icon is clicked
app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});
