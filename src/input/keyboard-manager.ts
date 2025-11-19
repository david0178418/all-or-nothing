import { ControllerType, InputEvent, InputListener } from './input-types';
import { KeyboardMappings } from './controller-mappings';

/**
 * Manages keyboard input
 */
export class KeyboardManager {
	private listeners: InputListener[] = [];
	private pressedKeys: Set<string> = new Set();
	private enabled: boolean = true;

	constructor() {
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
	}

	/**
	 * Initialize the keyboard manager
	 */
	public init() {
		window.addEventListener('keydown', this.handleKeyDown);
		window.addEventListener('keyup', this.handleKeyUp);

		return this;
	}

	/**
	 * Clean up the keyboard manager
	 */
	public destroy(): void {
		window.removeEventListener('keydown', this.handleKeyDown);
		window.removeEventListener('keyup', this.handleKeyUp);
		this.listeners = [];
		this.pressedKeys.clear();
	}

	/**
	 * Add an input listener
	 */
	public addListener(listener: InputListener) {
		this.listeners.push(listener);

		return this;
	}

	/**
	 * Remove an input listener
	 */
	public removeListener(listener: InputListener) {
		this.listeners = this.listeners.filter(l => l !== listener);

		return this;
	}

	/**
	 * Enable or disable keyboard input
	 */
	public setEnabled(enabled: boolean): void {
		this.enabled = enabled;
		if (!enabled) {
			this.pressedKeys.clear();
		}
	}

	/**
	 * Check if keyboard input is enabled
	 */
	public isEnabled(): boolean {
		return this.enabled;
	}

	/**
	 * Handle key down event
	 */
	private handleKeyDown(event: KeyboardEvent): void {
		if (!this.enabled) return;

		// Ignore if user is typing in an input field
		const target = event.target as HTMLElement;
		if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
			return;
		}

		const key = event.key;

		// Prevent repeated events when key is held down
		if (this.pressedKeys.has(key)) {
			return;
		}

		this.pressedKeys.add(key);

		// Check if this key is mapped to an action
		const action = KeyboardMappings[key];
		if (action) {
			// Prevent default browser behavior for mapped keys
			event.preventDefault();

			const inputEvent: InputEvent = {
				action,
				source: ControllerType.KEYBOARD,
				timestamp: Date.now(),
			};

			this.listeners.forEach(listener => listener(inputEvent));
		}
	}

	/**
	 * Handle key up event
	 */
	private handleKeyUp(event: KeyboardEvent): void {
		const key = event.key;
		this.pressedKeys.delete(key);
	}
}

// Singleton instance
let keyboardManager: KeyboardManager | null = null;

/**
 * Get the singleton keyboard manager instance
 */
export function getKeyboardManager(): KeyboardManager {
	if (!keyboardManager) {
		keyboardManager = new KeyboardManager();
	}
	return keyboardManager;
}
