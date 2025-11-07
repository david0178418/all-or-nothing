import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { getFocusManager } from './focus-manager';
import { getGamepadManager } from '@/input/gamepad-manager';
import { getKeyboardManager } from '@/input/keyboard-manager';
import { InputAction, InputEvent, NavigationDirection } from '@/input/input-types';
import { useSetUsingNavigationalInput } from '@/atoms';

interface FocusContextValue {
	currentFocusId: string | null;
	setActiveGroup: (group: string | null) => void;
	usingNavigationalInput: boolean;
}

const FocusContext = createContext<FocusContextValue | null>(null);

/**
 * Provider component for focus management
 */
export function FocusProvider({ children }: { children: ReactNode }) {
	const [currentFocusId, setCurrentFocusId] = useState<string | null>(null);
	const [usingNavigationalInput, setUsingNavigationalInputLocal] = useState(false);
	const setUsingNavigationalInput = useSetUsingNavigationalInput();
	const focusManager = getFocusManager();
	const gamepadManager = getGamepadManager();
	const keyboardManager = getKeyboardManager();

	// Use ref to track navigational input state to avoid recreating callbacks
	const usingNavigationalInputRef = useRef(false);
	useEffect(() => {
		usingNavigationalInputRef.current = usingNavigationalInput;
	}, [usingNavigationalInput]);

	// Stable function to update focus state
	const updateFocusState = useCallback(() => {
		setCurrentFocusId(focusManager.getCurrentFocusId());
	}, [focusManager]);

	// Stable function to set active group
	const setActiveGroup = useCallback((group: string | null) => {
		focusManager.setActiveGroup(group);
		updateFocusState();
	}, [focusManager, updateFocusState]);

	// Handle input events
	const handleInput = useCallback((event: InputEvent) => {
		const { action } = event;

		// Detect keyboard/gamepad input (any navigational input means they're using keyboard/controller)
		if (!usingNavigationalInputRef.current) {
			setUsingNavigationalInputLocal(true);
			setUsingNavigationalInput(true);
		}

		// Map input actions to focus manager actions
		switch (action) {
			case InputAction.NAVIGATE_UP:
				focusManager.navigate(NavigationDirection.UP);
				updateFocusState();
				break;
			case InputAction.NAVIGATE_DOWN:
				focusManager.navigate(NavigationDirection.DOWN);
				updateFocusState();
				break;
			case InputAction.NAVIGATE_LEFT:
				focusManager.navigate(NavigationDirection.LEFT);
				updateFocusState();
				break;
			case InputAction.NAVIGATE_RIGHT:
				focusManager.navigate(NavigationDirection.RIGHT);
				updateFocusState();
				break;
			case InputAction.SELECT:
				focusManager.selectCurrent();
				break;
			// Other actions (BACK, PAUSE, HINT, SHUFFLE) are handled by specific components
		}
	}, [focusManager, updateFocusState, setUsingNavigationalInput]);

	// Stable mouse/touch handler using ref
	const handleMouseOrTouch = useCallback(() => {
		if (usingNavigationalInputRef.current) {
			setUsingNavigationalInputLocal(false);
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
			focusManager.clear();
			window.removeEventListener('mousedown', handleMouseOrTouch);
			window.removeEventListener('touchstart', handleMouseOrTouch);
		};
	}, [gamepadManager, keyboardManager, focusManager, handleInput, handleMouseOrTouch]);

	return (
		<FocusContext.Provider value={{ currentFocusId, setActiveGroup, usingNavigationalInput }}>
			{children}
		</FocusContext.Provider>
	);
}

/**
 * Hook to access the focus context
 */
export function useFocusContext() {
	const context = useContext(FocusContext);
	if (!context) {
		throw new Error('useFocusContext must be used within a FocusProvider');
	}
	return context;
}
