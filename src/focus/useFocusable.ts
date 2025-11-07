import { useEffect, useRef, useState, useMemo } from 'react';
import { getFocusManager, FocusableElement } from './focus-manager';
import { useFocusContext } from './focus-context';

interface UseFocusableOptions {
	id: string;
	group: string;
	gridPosition?: { row: number; col: number };
	order?: number;
	onSelect?: () => void;
	disabled?: boolean;
	autoFocus?: boolean; // Auto-focus this element when it mounts
}

/**
 * Hook to make a component focusable via keyboard/controller
 */
export function useFocusable({
	id,
	group,
	gridPosition,
	order,
	onSelect,
	disabled = false,
	autoFocus = false,
}: UseFocusableOptions) {
	const elementRef = useRef<HTMLElement>(null);
	const [isFocused, setIsFocused] = useState(false);
	const { currentFocusId } = useFocusContext();
	const focusManager = getFocusManager();

	// Store the latest onSelect callback in a ref to avoid re-registration
	const onSelectRef = useRef(onSelect);
	useEffect(() => {
		onSelectRef.current = onSelect;
	}, [onSelect]);

	// Stabilize gridPosition to prevent unnecessary re-registrations
	const gridPositionKey = gridPosition ? JSON.stringify(gridPosition) : null;

	// Update focused state when global focus changes
	useEffect(() => {
		setIsFocused(currentFocusId === id);
	}, [currentFocusId, id]);

	// Register/unregister the element
	useEffect(() => {
		if (disabled) {
			focusManager.unregister(id);
			return;
		}

		const focusableElement: FocusableElement = {
			id,
			element: elementRef.current,
			group,
			gridPosition,
			order,
			onFocus: () => setIsFocused(true),
			onBlur: () => setIsFocused(false),
			onSelect: () => {
				// Use the ref to get the latest callback without re-registering
				if (onSelectRef.current) {
					onSelectRef.current();
				}
			},
		};

		focusManager.register(focusableElement);

		return () => {
			focusManager.unregister(id);
		};
	}, [id, group, gridPositionKey, order, disabled, focusManager]);

	// Handle auto-focus separately - only run once when autoFocus is first true
	const hasAutoFocused = useRef(false);
	useEffect(() => {
		if (autoFocus && !hasAutoFocused.current && !disabled) {
			// Small delay to ensure element is registered first
			const timeoutId = setTimeout(() => {
				focusManager.focusElement(id);
				hasAutoFocused.current = true;
			}, 0);
			return () => clearTimeout(timeoutId);
		}
	}, [autoFocus, disabled, focusManager, id])

	return {
		ref: elementRef,
		isFocused,
		focus: () => focusManager.focusElement(id),
	};
}
