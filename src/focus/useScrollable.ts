import { RefObject, useCallback } from 'react';
import { useGamepadManager } from '@/input/input-hooks';
import { useKeyboardManager } from '@/input/input-hooks';
import { InputAction, InputEvent } from '@/input/input-types';

interface UseScrollableOptions {
	ref: RefObject<HTMLElement | null>;
	scrollAmount?: number;
}

const DEFAULT_SCROLL_AMOUNT = 250;

/**
 * Hook to make a container scrollable via controller/keyboard navigation.
 * Scrolls whenever navigation events are received.
 */
export
function useScrollable({
	ref,
	scrollAmount = DEFAULT_SCROLL_AMOUNT,
}: UseScrollableOptions): void {
	const handleInput = useCallback((event: InputEvent) => {
		if (!ref.current) return;

		const { action } = event;
		const element = ref.current;

		switch (action) {
			case InputAction.NAVIGATE_UP:
				element.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
				break;
			case InputAction.NAVIGATE_DOWN:
				element.scrollBy({ top: scrollAmount, behavior: 'smooth' });
				break;
			case InputAction.NAVIGATE_LEFT:
				element.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
				break;
			case InputAction.NAVIGATE_RIGHT:
				element.scrollBy({ left: scrollAmount, behavior: 'smooth' });
				break;
		}
	}, [ref, scrollAmount]);

	useGamepadManager(handleInput);
	useKeyboardManager(handleInput);
}
