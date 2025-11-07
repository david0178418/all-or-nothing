import { useEffect, ReactNode, useCallback, useRef } from 'react';
import { getGamepadManager } from '@/input/gamepad-manager';
import { getKeyboardManager } from '@/input/keyboard-manager';
import { InputEvent, NavigationDirection, PrimaryInputAction } from '@/input/input-types';
import {
	useSetUsingNavigationalInput,
	useUsingNavigationalInput,
	useNavigate,
	useSelectCurrent,
	useClearAllFocus,
} from '@/atoms';
import { isIn } from '@/utils';

/**
 * Manages input routing from keyboard/gamepad to focus actions
 */
export function FocusInputManager({ children }: { children: ReactNode }) {
	const usingNavigationalInput = useUsingNavigationalInput();
	const setUsingNavigationalInput = useSetUsingNavigationalInput();
	const navigate = useNavigate();
	const selectCurrent = useSelectCurrent();
	const clearAllFocus = useClearAllFocus();
	const gamepadManager = getGamepadManager();
	const keyboardManager = getKeyboardManager();
	const actionHandlers = {
		[PrimaryInputAction.NAVIGATE_UP]: () => navigate(NavigationDirection.UP),
		[PrimaryInputAction.NAVIGATE_DOWN]: () => navigate(NavigationDirection.DOWN),
		[PrimaryInputAction.NAVIGATE_LEFT]: () => navigate(NavigationDirection.LEFT),
		[PrimaryInputAction.NAVIGATE_RIGHT]: () => navigate(NavigationDirection.RIGHT),
		[PrimaryInputAction.SELECT]: () => selectCurrent(),
	} as const;

	const usingNavigationalInputRef = useRef(false);
	useEffect(() => {
		usingNavigationalInputRef.current = usingNavigationalInput;
	}, [usingNavigationalInput]);

	// Handle input events
	const handleInput = useCallback((event: InputEvent) => {
		const { action } = event;

		// Detect keyboard/gamepad input (any navigational input means they're using keyboard/controller)
		if (!usingNavigationalInputRef.current) {
			setUsingNavigationalInput(true);
			return;
		}

		if(!isIn(action, PrimaryInputAction)) return;

		actionHandlers[action]();

	}, [setUsingNavigationalInput]);

	// Stable mouse/touch handler using ref
	const handleMouseOrTouch = useCallback(() => {
		if (usingNavigationalInputRef.current) {
			setUsingNavigationalInput(false);
		}
	}, [setUsingNavigationalInput]);

	useEffect(() => {
		// Initialize input managers
		gamepadManager.init();
		keyboardManager.init();

		gamepadManager.addListener(handleInput);
		keyboardManager.addListener(handleInput);

		// Detect mouse/touch usage to hide focus indicators
		window.addEventListener('mousedown', handleMouseOrTouch);
		window.addEventListener('touchstart', handleMouseOrTouch);

		// Cleanup
		return () => {
			gamepadManager.removeListener(handleInput);
			keyboardManager.removeListener(handleInput);
			gamepadManager.destroy();
			keyboardManager.destroy();
			clearAllFocus();
			window.removeEventListener('mousedown', handleMouseOrTouch);
			window.removeEventListener('touchstart', handleMouseOrTouch);
		};
	}, [gamepadManager, keyboardManager, handleInput, handleMouseOrTouch, clearAllFocus]);

	return <>{children}</>;
}
