import { useCallback } from 'react';
import { useGamepadManager, useKeyboardManager } from './input-hooks';
import { InputAction, InputEvent } from './input-types';

/**
 * Hook to handle the BACK action from gamepad or keyboard input.
 * Executes the provided callback when the BACK action is triggered.
 */
export
function useBackAction(onBack: () => void): void {
	const handleInput = useCallback((event: InputEvent) => {
		if (event.action === InputAction.BACK) {
			onBack();
		}
	}, [onBack]);

	useGamepadManager(handleInput);
	useKeyboardManager(handleInput);
}
