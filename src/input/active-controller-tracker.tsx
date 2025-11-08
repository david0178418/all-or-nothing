import { ReactNode } from 'react';
import { InputEvent } from '@/input/input-types';
import { useGamepadManager, useKeyboardManager } from '@/input/input-hooks';
import { useEventListener } from 'usehooks-ts';
import { useSetActiveController } from '@/atoms';

/**
 * Tracks the active controller based on last input source.
 * Sets activeController to the source of the most recent input event.
 * Clears activeController (sets to null) when mouse or touch input is detected.
 */
export function ActiveControllerTracker({ children }: { children: ReactNode }) {
	const setActiveController = useSetActiveController();

	useGamepadManager(handleInput);
	useKeyboardManager(handleInput);
	useEventListener('mousedown', handleMouseOrTouch);
	useEventListener('touchstart', handleMouseOrTouch);

	function handleInput(event: InputEvent) {
		setActiveController(event.source);
	}

	function handleMouseOrTouch() {
		setActiveController(null);
	}

	return <>{children}</>;
}
