import { atom, useAtomValue, useSetAtom } from 'jotai';
import { NavigationDirection } from '../input/input-types';
import { navigate2D, navigate1D } from './focus-navigation';

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

// Register a focusable element
export const registerElementAtom = atom(
	null,
	(get, set, element: FocusableElement) => {
		const elements = new Map(get(focusableElementsAtom));
		elements.set(element.id, element);
		set(focusableElementsAtom, elements);
	}
);

// Unregister a focusable element. When `element` is provided, only removes if
// the currently registered instance matches (prevents AnimatePresence
// exit-animating components from removing registrations created by newly
// mounted replacements).
export const unregisterElementAtom = atom(
	null,
	(get, set, { id, element }: { id: string; element?: FocusableElement }) => {
		const elements = get(focusableElementsAtom);

		if (element && elements.get(id) !== element) return;

		const newElements = new Map(elements);
		const currentFocusId = get(currentFocusIdAtom);

		if (currentFocusId === id) {
			set(currentFocusIdAtom, null);
		}

		newElements.delete(id);
		set(focusableElementsAtom, newElements);
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

		if (!group) return;

		const elements = get(focusableElementsAtom);
		const currentFocusId = get(currentFocusIdAtom);

		// If current focus is already in the new group, keep it
		const currentElement = currentFocusId ? elements.get(currentFocusId) : null;
		if (currentElement?.group === group) return;

		// Auto-focus first element in new group, or clear stale focus
		const elementsInGroup = getElementsInGroup(elements, group);
		const firstElement = elementsInGroup[0];
		if (firstElement) {
			set(focusElementAtom, firstElement.id);
		} else {
			set(clearFocusAtom);
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

		// Determine if this is a 2D grid or 1D list based on current element
		const isGrid = currentElement.gridPosition !== undefined;

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
	(get) => {
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
