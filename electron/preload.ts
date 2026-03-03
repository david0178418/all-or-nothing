import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
	platform: 'electron' as const,
});
