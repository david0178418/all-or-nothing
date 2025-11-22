import { contextBridge } from 'electron';

// Expose Electron APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
	isElectron: true,
	platform: process.platform,
});
