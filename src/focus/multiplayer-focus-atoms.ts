import { atom, useSetAtom, useAtomValue } from 'jotai';
import { NavigationDirection } from '@/input/input-types';
import { navigate2D, navigate1D } from './focus-navigation';
import type { PlayerId } from '@/multiplayer/multiplayer-types';

interface MultiplayerFocusableElement {
	id: string;
	gridPosition?: { row: number; col: number };
	order?: number;
	onSelect?: (playerId: PlayerId) => void;
}

// Element registry for multiplayer focus
const multiplayerElementsAtom = atom(new Map<string, MultiplayerFocusableElement>());

// Per-player focus: Map from PlayerId to focused element ID
const playerFocusAtom = atom<ReadonlyMap<PlayerId, string | null>>(new Map());

// Register a multiplayer focusable element
const registerMultiplayerElementAtom = atom(
	null,
	(get, set, element: MultiplayerFocusableElement) => {
		const elements = new Map(get(multiplayerElementsAtom));
		elements.set(element.id, element);
		set(multiplayerElementsAtom, elements);
	}
);

// Unregister a multiplayer focusable element
const unregisterMultiplayerElementAtom = atom(
	null,
	(get, set, id: string) => {
		const elements = new Map(get(multiplayerElementsAtom));
		elements.delete(id);
		set(multiplayerElementsAtom, elements);

		// Clear focus for any player focused on this element
		const currentFocus = get(playerFocusAtom);
		const hasChange = Array.from(currentFocus.values()).some(focusId => focusId === id);

		if (hasChange) {
			set(playerFocusAtom, new Map(
				Array.from(currentFocus.entries()).map(
					([pid, focusId]) => [pid, focusId === id ? null : focusId] as const
				)
			));
		}
	}
);

// Focus a specific element for a specific player
const focusPlayerElementAtom = atom(
	null,
	(get, set, { playerId, elementId }: { playerId: PlayerId; elementId: string }) => {
		const elements = get(multiplayerElementsAtom);
		if (!elements.has(elementId)) return;

		const currentFocus = get(playerFocusAtom);
		if (currentFocus.get(playerId) === elementId) return;

		const focus = new Map(currentFocus);
		focus.set(playerId, elementId);
		set(playerFocusAtom, focus);
	}
);

// Navigate a specific player in a direction
const navigatePlayerAtom = atom(
	null,
	(get, set, { playerId, direction }: { playerId: PlayerId; direction: NavigationDirection }) => {
		const elements = get(multiplayerElementsAtom);
		const currentFocus = get(playerFocusAtom);
		const currentId = currentFocus.get(playerId) ?? null;
		const allElements = Array.from(elements.values());

		if (allElements.length === 0) return;

		if (!currentId) {
			const first = allElements[0];
			if (first) {
				set(focusPlayerElementAtom, { playerId, elementId: first.id });
			}
			return;
		}

		const current = elements.get(currentId);
		if (!current) return;

		const isGrid = current.gridPosition !== undefined;
		const targetId = isGrid
			? navigate2D(direction, current, allElements)
			: navigate1D(direction, current, allElements);

		if (targetId) {
			set(focusPlayerElementAtom, { playerId, elementId: targetId });
		}
	}
);

// Select the currently focused element for a player
const selectPlayerCurrentAtom = atom(
	null,
	(get, _set, playerId: PlayerId) => {
		const currentFocus = get(playerFocusAtom);
		const currentId = currentFocus.get(playerId);
		if (!currentId) return;

		const elements = get(multiplayerElementsAtom);
		const element = elements.get(currentId);
		element?.onSelect?.(playerId);
	}
);

// Initialize focus for a set of players (spread across available elements)
const initializePlayerFocusAtom = atom(
	null,
	(get, set, playerIds: readonly PlayerId[]) => {
		const elements = get(multiplayerElementsAtom);
		const allElements = Array.from(elements.values());

		const focus = new Map(
			playerIds.map((pid, i) => {
				const elementIndex = Math.min(i, allElements.length - 1);
				return [pid, allElements[elementIndex]?.id ?? null] as const;
			})
		);

		set(playerFocusAtom, focus);
	}
);

// Clear all multiplayer focus state
const clearMultiplayerFocusAtom = atom(
	null,
	(_get, set) => {
		set(playerFocusAtom, new Map());
		set(multiplayerElementsAtom, new Map());
	}
);

// Hooks
export function usePlayerFocus() {
	return useAtomValue(playerFocusAtom);
}

export function useRegisterMultiplayerElement() {
	return useSetAtom(registerMultiplayerElementAtom);
}

export function useUnregisterMultiplayerElement() {
	return useSetAtom(unregisterMultiplayerElementAtom);
}

export function useFocusPlayerElement() {
	return useSetAtom(focusPlayerElementAtom);
}

export function useNavigatePlayer() {
	return useSetAtom(navigatePlayerAtom);
}

export function useSelectPlayerCurrent() {
	return useSetAtom(selectPlayerCurrentAtom);
}

export function useInitializePlayerFocus() {
	return useSetAtom(initializePlayerFocusAtom);
}

export function useClearMultiplayerFocus() {
	return useSetAtom(clearMultiplayerFocusAtom);
}
