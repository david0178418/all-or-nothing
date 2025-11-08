import { useEffect, useRef, useCallback } from 'react';
import { getGamepadManager } from './gamepad-manager';
import { getKeyboardManager } from './keyboard-manager';
import { InputEvent } from './input-types';

type InputListener = (event: InputEvent) => void;

// Reference counting for manager lifecycle
// These track how many components are using each manager
let gamepadInitCount = 0;
let keyboardInitCount = 0;

/**
 * Hook to manage gamepad input with automatic lifecycle handling.
 * Handles init/destroy and listener registration/cleanup.
 * Safe to use in multiple components via reference counting.
 *
 * @param listener - Callback function to receive gamepad input events
 */
export
function useGamepadManager(listener: InputListener): void {
	// Store listener in ref to allow changes without re-initialization
	const listenerRef = useRef(listener);

	// Update ref when listener changes (no effect re-run needed)
	useEffect(() => {
		listenerRef.current = listener;
	}, [listener]);

	// Create stable callback that uses the ref
	const stableListener = useCallback((event: InputEvent) => {
		listenerRef.current(event);
	}, []);

	useEffect(() => {
		const manager = getGamepadManager();

		// Only init on first consumer to avoid duplicate event listeners
		if (!gamepadInitCount) manager.init();

		gamepadInitCount++;

		manager.addListener(stableListener);

		return () => {
			manager.removeListener(stableListener);
			gamepadInitCount--;

			// Only destroy when last consumer unmounts
			if (!gamepadInitCount) manager.destroy();
		};
	}, [stableListener]); // Only depends on stable callback
}

/**
 * Hook to manage keyboard input with automatic lifecycle handling.
 * Handles init/destroy and listener registration/cleanup.
 * Safe to use in multiple components via reference counting.
 *
 * @param listener - Callback function to receive keyboard input events
 */
export
function useKeyboardManager(listener: InputListener): void {
	// Store listener in ref to allow changes without re-initialization
	const listenerRef = useRef(listener);

	// Update ref when listener changes (no effect re-run needed)
	useEffect(() => {
		listenerRef.current = listener;
	}, [listener]);

	// Create stable callback that uses the ref
	const stableListener = useCallback((event: InputEvent) => {
		listenerRef.current(event);
	}, []);

	useEffect(() => {
		const manager = getKeyboardManager();

		// Only init on first consumer to avoid duplicate event listeners
		if (!keyboardInitCount) manager.init();

		keyboardInitCount++;

		manager.addListener(stableListener);

		return () => {
			manager.removeListener(stableListener);
			keyboardInitCount--;

			// Only destroy when last consumer unmounts
			if (!keyboardInitCount) manager.destroy();
		};
	}, [stableListener]); // Only depends on stable callback
}
