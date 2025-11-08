import { useEffect, ReactNode, useMemo } from 'react';
import { InputEvent, NavigationDirection, PrimaryInputAction } from '@/input/input-types';
import { useGamepadManager, useKeyboardManager } from '@/input/input-hooks';
import { isIn } from '@/utils';
import {
	useUsingNavigationalInput,
	useNavigate,
	useSelectCurrent,
	useClearAllFocus,
} from '@/atoms';

/**
 * Manages input routing from keyboard/gamepad to focus actions
 */
export function FocusInputManager({ children }: { children: ReactNode }) {
	const usingNavigationalInput = useUsingNavigationalInput();
	const navigate = useNavigate();
	const selectCurrent = useSelectCurrent();
	const clearAllFocus = useClearAllFocus();

	useGamepadManager(handleInput);
	useKeyboardManager(handleInput);

	const actionHandlers = useMemo(() => ({
		[PrimaryInputAction.NAVIGATE_UP]: () => navigate(NavigationDirection.UP),
		[PrimaryInputAction.NAVIGATE_DOWN]: () => navigate(NavigationDirection.DOWN),
		[PrimaryInputAction.NAVIGATE_LEFT]: () => navigate(NavigationDirection.LEFT),
		[PrimaryInputAction.NAVIGATE_RIGHT]: () => navigate(NavigationDirection.RIGHT),
		[PrimaryInputAction.SELECT]: () => selectCurrent(),
	} as const), [navigate, selectCurrent]);

	useEffect(() => {
		return () => clearAllFocus();
	}, [clearAllFocus]);

	function handleInput(event: InputEvent) {
		const { action } = event;

		if (!usingNavigationalInput) return;

		if(!isIn(action, PrimaryInputAction)) return;

		actionHandlers[action]();
	}

	return <>{children}</>;
}
