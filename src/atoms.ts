import { atom, useAtomValue, useSetAtom } from 'jotai';
import { Screens, ToastMesssage } from './types';
import { NavigationDirection } from './input/input-types';

/**
 * Represents a focusable element in the application
 */
export interface FocusableElement {
	id: string;
	element: HTMLElement | null;
	group: string; // Group identifier (e.g., 'cards', 'menu', 'dialog')
	gridPosition?: { row: number; col: number }; // For 2D grid navigation
	order?: number; // For 1D list navigation
	onFocus?: () => void;
	onBlur?: () => void;
	onSelect?: () => void;
}

const soundAtom = atom(true);

export
function useIsSoundEnabled() {
	return useAtomValue(soundAtom);
}

export
function useSetIsSoundEnabled() {
	return useSetAtom(soundAtom);
}

const musicAtom = atom(true);

export
function useIsMusicEnabled() {
	return useAtomValue(musicAtom);
}

export
function useSetIsMusicEnabled() {
	return useSetAtom(musicAtom);
}

const pausedAtom = atom(false);

const activeScreenAtom = atom<Screens>(Screens.Title);

export
function useActiveScreen() {
	return useAtomValue(activeScreenAtom);
}

export
function useSetActiveScreen() {
	return useSetAtom(activeScreenAtom);
}

export
function useIsPaused() {
	return useAtomValue(pausedAtom);
}

export
function useSetIsPaused() {
	return useSetAtom(pausedAtom);
}
const toastQueueAtom = atom<ToastMesssage[]>([]);

export
const toastMsgAtom = atom(get => get(toastQueueAtom)[0] || null);

export
const pushToastMsgAtom = atom(
	null,
	(get, set, message: ToastMesssage | string) => {

		const addedMsg = (typeof message === 'string') ? { message } : message;

		const tqa = get(toastQueueAtom);

		set(toastQueueAtom, [ ...tqa, addedMsg ]);
	},
);

export
const clearCurrentToastMsgAtom = atom(
	null,
	(get, set) => {
		const [, ...rest] = get(toastQueueAtom);
		set(toastQueueAtom, rest);
	},
);

export
function usePushToastMsg() {
	return useSetAtom(pushToastMsgAtom);
}

const usingNavigationalInputAtom = atom(false);

export
function useUsingNavigationalInput() {
	return useAtomValue(usingNavigationalInputAtom);
}

export
function useSetUsingNavigationalInput() {
	return useSetAtom(usingNavigationalInputAtom);
}

// Focus Management Atoms
const focusableElementsAtom = atom(new Map<string, FocusableElement>());
const currentFocusIdAtom = atom<string | null>(null);
const activeGroupAtom = atom<string | null>(null);

// Helper to get elements in active group
function getElementsInGroup(elements: Map<string, FocusableElement>, group: string): FocusableElement[] {
	return Array.from(elements.values()).filter(el => el.group === group);
}

// Helper to trigger focus callbacks
function triggerFocusCallbacks(
	elements: Map<string, FocusableElement>,
	prevFocusId: string | null,
	newFocusId: string | null
): void {
	// Blur previous element
	if (prevFocusId && prevFocusId !== newFocusId) {
		const prevElement = elements.get(prevFocusId);
		if (prevElement?.onBlur) {
			prevElement.onBlur();
		}
	}

	// Focus new element
	if (newFocusId) {
		const newElement = elements.get(newFocusId);
		if (newElement?.onFocus) {
			newElement.onFocus();
		}
		// Scroll into view
		if (newElement?.element) {
			newElement.element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}
	}
}

// Direction mappings for 2D grid navigation
const DIRECTION_TO_2D_DELTA = {
	[NavigationDirection.UP]: (row: number, col: number) => ({ row: row - 1, col }),
	[NavigationDirection.DOWN]: (row: number, col: number) => ({ row: row + 1, col }),
	[NavigationDirection.LEFT]: (row: number, col: number) => ({ row, col: col - 1 }),
	[NavigationDirection.RIGHT]: (row: number, col: number) => ({ row, col: col + 1 }),
} as const;

// Direction mappings for 1D list navigation
const DIRECTION_TO_1D_INDEX = {
	[NavigationDirection.UP]: (currentIndex: number, length: number) => (currentIndex - 1 + length) % length,
	[NavigationDirection.DOWN]: (currentIndex: number, length: number) => (currentIndex + 1) % length,
	[NavigationDirection.LEFT]: (currentIndex: number, length: number) => (currentIndex - 1 + length) % length,
	[NavigationDirection.RIGHT]: (currentIndex: number, length: number) => (currentIndex + 1) % length,
} as const;

// Navigate in 2D grid
function navigate2D(
	direction: NavigationDirection,
	current: FocusableElement,
	elements: FocusableElement[]
): string | null {
	if (!current.gridPosition) return null;

	const { row, col } = current.gridPosition;

	const handler = DIRECTION_TO_2D_DELTA[direction];
	if (!handler) return null;

	const { row: targetRow, col: targetCol } = handler(row, col);

	// Find element at target position
	const targetElement = elements.find(
		el => el.gridPosition?.row === targetRow && el.gridPosition?.col === targetCol
	);

	return targetElement?.id || null;
}

// Navigate in 1D list
function navigate1D(
	direction: NavigationDirection,
	current: FocusableElement,
	elements: FocusableElement[]
): string | null {
	// Sort elements by order
	const sortedElements = [...elements].sort((a, b) => (a.order || 0) - (b.order || 0));
	const currentIndex = sortedElements.findIndex(el => el.id === current.id);

	if (currentIndex === -1) return null;

	const handler = DIRECTION_TO_1D_INDEX[direction];
	if (!handler) return null;

	const targetIndex = handler(currentIndex, sortedElements.length);

	return sortedElements[targetIndex]?.id || null;
}

// Register a focusable element
export const registerElementAtom = atom(
	null,
	(get, set, element: FocusableElement) => {
		const elements = new Map(get(focusableElementsAtom));
		elements.set(element.id, element);
		set(focusableElementsAtom, elements);
	}
);

// Unregister a focusable element
export const unregisterElementAtom = atom(
	null,
	(get, set, id: string) => {
		const elements = new Map(get(focusableElementsAtom));
		const currentFocusId = get(currentFocusIdAtom);

		if (currentFocusId === id) {
			set(currentFocusIdAtom, null);
		}

		elements.delete(id);
		set(focusableElementsAtom, elements);
	}
);

// Focus a specific element by ID
export const focusElementAtom = atom(
	null,
	(get, set, id: string) => {
		const elements = get(focusableElementsAtom);
		const element = elements.get(id);
		if (!element) return;

		const prevFocusId = get(currentFocusIdAtom);
		set(currentFocusIdAtom, id);

		triggerFocusCallbacks(elements, prevFocusId, id);
	}
);

// Set active group and auto-focus first element
export const setActiveGroupAtom = atom(
	null,
	(get, set, group: string | null) => {
		set(activeGroupAtom, group);

		// Auto-focus first element in group
		if (group) {
			const elements = get(focusableElementsAtom);
			const currentFocusId = get(currentFocusIdAtom);
			const elementsInGroup = getElementsInGroup(elements, group);
			const firstElement = elementsInGroup[0];

			if (firstElement && !currentFocusId) {
				set(focusElementAtom, firstElement.id);
			}
		}
	}
);

// Navigate in a direction
export const navigateAtom = atom(
	null,
	(get, set, direction: NavigationDirection) => {
		const activeGroup = get(activeGroupAtom);
		const currentFocusId = get(currentFocusIdAtom);
		const elements = get(focusableElementsAtom);

		if (!activeGroup || !currentFocusId) {
			// If nothing is focused, focus the first element in the active group
			if (activeGroup) {
				const elementsInGroup = getElementsInGroup(elements, activeGroup);
				const firstElement = elementsInGroup[0];
				if (firstElement) {
					set(focusElementAtom, firstElement.id);
				}
			}
			return;
		}

		const currentElement = elements.get(currentFocusId);
		if (!currentElement) return;

		const elementsInGroup = getElementsInGroup(elements, activeGroup);
		if (elementsInGroup.length === 0) return;

		// Determine if this is a 2D grid or 1D list
		const isGrid = elementsInGroup.some(el => el.gridPosition !== undefined);

		const targetId = isGrid
			? navigate2D(direction, currentElement, elementsInGroup)
			: navigate1D(direction, currentElement, elementsInGroup);

		if (targetId) {
			set(focusElementAtom, targetId);
		}
	}
);

// Select the currently focused element
export const selectCurrentAtom = atom(
	null,
	(get, set) => {
		const currentFocusId = get(currentFocusIdAtom);
		if (!currentFocusId) return;

		const elements = get(focusableElementsAtom);
		const element = elements.get(currentFocusId);
		if (element?.onSelect) {
			element.onSelect();
		}
	}
);

// Clear focus
export const clearFocusAtom = atom(
	null,
	(get, set) => {
		const currentFocusId = get(currentFocusIdAtom);
		if (currentFocusId) {
			const elements = get(focusableElementsAtom);
			const element = elements.get(currentFocusId);
			if (element?.onBlur) {
				element.onBlur();
			}
			set(currentFocusIdAtom, null);
		}
	}
);

// Clear all focus state
export const clearAllFocusAtom = atom(
	null,
	(get, set) => {
		set(focusableElementsAtom, new Map());
		set(currentFocusIdAtom, null);
		set(activeGroupAtom, null);
	}
);

// Hooks for accessing focus state
export function useCurrentFocusId() {
	return useAtomValue(currentFocusIdAtom);
}

export function useActiveGroup() {
	return useAtomValue(activeGroupAtom);
}

export function useRegisterElement() {
	return useSetAtom(registerElementAtom);
}

export function useUnregisterElement() {
	return useSetAtom(unregisterElementAtom);
}

export function useFocusElement() {
	return useSetAtom(focusElementAtom);
}

export function useSetActiveGroup() {
	return useSetAtom(setActiveGroupAtom);
}

export function useNavigate() {
	return useSetAtom(navigateAtom);
}

export function useSelectCurrent() {
	return useSetAtom(selectCurrentAtom);
}

export function useClearFocus() {
	return useSetAtom(clearFocusAtom);
}

export function useClearAllFocus() {
	return useSetAtom(clearAllFocusAtom);
}
