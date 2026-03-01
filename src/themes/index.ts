import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import type { GameTheme } from './types';
import { defaultTheme } from './default';
import { fetchManifest, getScheduledEntry, loadTheme } from './loader';
import type { ThemeManifestEntry } from './loader';

const gameThemeAtom = atom<GameTheme>(defaultTheme);

export
function useGameTheme(): GameTheme {
	return useAtomValue(gameThemeAtom);
}

export
function useInitializeThemes() {
	const setTheme = useSetAtom(gameThemeAtom);

	useEffect(() => {
		let manifestEntries: readonly ThemeManifestEntry[] = [];

		const loadScheduledTheme = async () => {
			const manifest = await fetchManifest();
			manifestEntries = manifest;

			const scheduled = getScheduledEntry(manifest);
			if (scheduled) {
				const theme = await loadTheme(scheduled);
				setTheme(theme);
			}
		};

		loadScheduledTheme();

		window.setTheme = (name?: string) => {
			if (name === 'default') {
				setTheme(defaultTheme);
				return;
			}

			if (name === undefined) {
				setTheme(defaultTheme);

				const scheduled = getScheduledEntry(manifestEntries);
				if (scheduled) {
					loadTheme(scheduled).then(setTheme);
				}
				return;
			}

			const entry = manifestEntries.find(e => e.name === name);

			if (!entry) {
				const validNames = ['default', ...manifestEntries.map(e => e.name)];
				throw new Error(
					`Invalid theme '${name}'. Valid options: ${validNames.join(', ')}`,
				);
			}

			loadTheme(entry).then(setTheme);
		};

		return () => {
			delete window.setTheme;
		};
	}, [setTheme]);
}
