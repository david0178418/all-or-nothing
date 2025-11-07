import { NavigationDirection } from '@/input/input-types';

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

/**
 * Manages focus state and navigation between focusable elements
 */
export class FocusManager {
	private focusableElements: Map<string, FocusableElement> = new Map();
	private currentFocusId: string | null = null;
	private activeGroup: string | null = null;

	/**
	 * Register a focusable element
	 */
	public register(element: FocusableElement): void {
		this.focusableElements.set(element.id, element);
	}

	/**
	 * Unregister a focusable element
	 */
	public unregister(id: string): void {
		if (this.currentFocusId === id) {
			this.currentFocusId = null;
		}
		this.focusableElements.delete(id);
	}

	/**
	 * Set the active group for focus navigation
	 */
	public setActiveGroup(group: string | null): void {
		this.activeGroup = group;
		// Auto-focus first element in group
		if (group) {
			const elementsInGroup = this.getElementsInGroup(group);
			if (elementsInGroup.length > 0 && !this.currentFocusId) {
				this.focusElement(elementsInGroup[0]!.id);
			}
		}
	}

	/**
	 * Get the currently focused element ID
	 */
	public getCurrentFocusId(): string | null {
		return this.currentFocusId;
	}

	/**
	 * Focus a specific element by ID
	 */
	public focusElement(id: string): void {
		const element = this.focusableElements.get(id);
		if (!element) return;

		// Blur previous element
		if (this.currentFocusId && this.currentFocusId !== id) {
			const prevElement = this.focusableElements.get(this.currentFocusId);
			if (prevElement?.onBlur) {
				prevElement.onBlur();
			}
		}

		// Focus new element
		this.currentFocusId = id;
		if (element.onFocus) {
			element.onFocus();
		}

		// Scroll element into view if needed
		if (element.element) {
			element.element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}
	}

	/**
	 * Navigate in a direction
	 */
	public navigate(direction: NavigationDirection): void {
		if (!this.activeGroup || !this.currentFocusId) {
			// If nothing is focused, focus the first element in the active group
			if (this.activeGroup) {
				const elementsInGroup = this.getElementsInGroup(this.activeGroup);
				if (elementsInGroup.length > 0) {
					this.focusElement(elementsInGroup[0]!.id);
				}
			}
			return;
		}

		const currentElement = this.focusableElements.get(this.currentFocusId);
		if (!currentElement) return;

		const elementsInGroup = this.getElementsInGroup(this.activeGroup);
		if (elementsInGroup.length === 0) return;

		// Determine if this is a 2D grid or 1D list
		const isGrid = elementsInGroup.some(el => el.gridPosition !== undefined);

		if (isGrid) {
			this.navigate2D(direction, currentElement, elementsInGroup);
		} else {
			this.navigate1D(direction, currentElement, elementsInGroup);
		}
	}

	/**
	 * Trigger the select action on the currently focused element
	 */
	public selectCurrent(): void {
		if (!this.currentFocusId) return;

		const element = this.focusableElements.get(this.currentFocusId);
		if (element?.onSelect) {
			element.onSelect();
		}
	}

	/**
	 * Clear focus from current element
	 */
	public clearFocus(): void {
		if (this.currentFocusId) {
			const element = this.focusableElements.get(this.currentFocusId);
			if (element?.onBlur) {
				element.onBlur();
			}
			this.currentFocusId = null;
		}
	}

	/**
	 * Clear all registered elements (useful for cleanup)
	 */
	public clear(): void {
		this.focusableElements.clear();
		this.currentFocusId = null;
		this.activeGroup = null;
	}

	/**
	 * Get all elements in a specific group
	 */
	private getElementsInGroup(group: string): FocusableElement[] {
		return Array.from(this.focusableElements.values()).filter(el => el.group === group);
	}

	/**
	 * Navigate in a 2D grid
	 */
	private navigate2D(
		direction: NavigationDirection,
		current: FocusableElement,
		elements: FocusableElement[]
	): void {
		if (!current.gridPosition) return;

		const { row, col } = current.gridPosition;
		let targetRow = row;
		let targetCol = col;

		switch (direction) {
			case NavigationDirection.UP:
				targetRow = row - 1;
				break;
			case NavigationDirection.DOWN:
				targetRow = row + 1;
				break;
			case NavigationDirection.LEFT:
				targetCol = col - 1;
				break;
			case NavigationDirection.RIGHT:
				targetCol = col + 1;
				break;
		}

		// Find element at target position
		const targetElement = elements.find(
			el => el.gridPosition?.row === targetRow && el.gridPosition?.col === targetCol
		);

		if (targetElement) {
			this.focusElement(targetElement.id);
		}
	}

	/**
	 * Navigate in a 1D list
	 */
	private navigate1D(
		direction: NavigationDirection,
		current: FocusableElement,
		elements: FocusableElement[]
	): void {
		// Sort elements by order
		const sortedElements = elements.sort((a, b) => (a.order || 0) - (b.order || 0));
		const currentIndex = sortedElements.findIndex(el => el.id === current.id);

		if (currentIndex === -1) return;

		let targetIndex = currentIndex;

		// Map directions to next/previous in list
		if (direction === NavigationDirection.DOWN || direction === NavigationDirection.RIGHT) {
			targetIndex = (currentIndex + 1) % sortedElements.length; // Wrap around
		} else if (direction === NavigationDirection.UP || direction === NavigationDirection.LEFT) {
			targetIndex = (currentIndex - 1 + sortedElements.length) % sortedElements.length; // Wrap around
		}

		const targetElement = sortedElements[targetIndex];
		if (targetElement) {
			this.focusElement(targetElement.id);
		}
	}
}

// Singleton instance
let focusManager: FocusManager | null = null;

/**
 * Get the singleton focus manager instance
 */
export function getFocusManager(): FocusManager {
	if (!focusManager) {
		focusManager = new FocusManager();
	}
	return focusManager;
}
