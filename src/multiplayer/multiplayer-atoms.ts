import { atom, useAtomValue, useSetAtom } from 'jotai';
import type { Player } from './multiplayer-types';

// Player roster (populated from lobby, consumed by multiplayer game screen)
const playerRosterAtom = atom<readonly Player[]>([]);

export function usePlayerRoster() {
	return useAtomValue(playerRosterAtom);
}

export function useSetPlayerRoster() {
	return useSetAtom(playerRosterAtom);
}
