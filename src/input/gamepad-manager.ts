import {
	ControllerType,
	GamepadAxis,
	GamepadButton,
	InputAction,
	InputEvent,
	InputListener,
} from './input-types';
import { ControllerMappings, detectControllerType } from './controller-mappings';

/**
 * Threshold for analog stick input to be considered a directional press
 */
const ANALOG_THRESHOLD = 0.5;

/**
 * Deadzone for analog stick to prevent drift
 */
const ANALOG_DEADZONE = 0.15;

/**
 * Manages gamepad input using the browser Gamepad API
 */
export class GamepadManager {
	private listeners: InputListener[] = [];
	private previousButtonStates: Map<number, boolean[]> = new Map();
	private previousAxisStates: Map<number, { x: boolean; y: boolean }> = new Map();
	private animationFrameId: number | null = null;
	private connectedGamepad: Gamepad | null = null;
	private controllerType: ControllerType = ControllerType.GENERIC;
	private onControllerConnected: ((type: ControllerType) => void) | null = null;
	private onControllerDisconnected: (() => void) | null = null;

	constructor() {
		this.handleGamepadConnected = this.handleGamepadConnected.bind(this);
		this.handleGamepadDisconnected = this.handleGamepadDisconnected.bind(this);
		this.poll = this.poll.bind(this);
	}

	/**
	 * Initialize the gamepad manager
	 */
	public init(): void {
		window.addEventListener('gamepadconnected', this.handleGamepadConnected);
		window.addEventListener('gamepaddisconnected', this.handleGamepadDisconnected);

		// Check for already connected gamepads
		const gamepads = navigator.getGamepads();
		for (const gamepad of gamepads) {
			if (gamepad) {
				this.handleGamepadConnected({ gamepad } as GamepadEvent);
				break; // Use first connected gamepad
			}
		}
	}

	/**
	 * Clean up the gamepad manager
	 */
	public destroy(): void {
		window.removeEventListener('gamepadconnected', this.handleGamepadConnected);
		window.removeEventListener('gamepaddisconnected', this.handleGamepadDisconnected);
		this.stopPolling();
		this.listeners = [];
	}

	/**
	 * Add an input listener
	 */
	public addListener(listener: InputListener): void {
		this.listeners.push(listener);
	}

	/**
	 * Remove an input listener
	 */
	public removeListener(listener: InputListener): void {
		this.listeners = this.listeners.filter(l => l !== listener);
	}

	/**
	 * Set callback for controller connection
	 */
	public setOnControllerConnected(callback: (type: ControllerType) => void): void {
		this.onControllerConnected = callback;
	}

	/**
	 * Set callback for controller disconnection
	 */
	public setOnControllerDisconnected(callback: () => void): void {
		this.onControllerDisconnected = callback;
	}

	/**
	 * Get the currently connected controller type
	 */
	public getControllerType(): ControllerType | null {
		return this.connectedGamepad ? this.controllerType : null;
	}

	/**
	 * Handle gamepad connection
	 */
	private handleGamepadConnected(event: GamepadEvent): void {
		console.log('Gamepad connected:', event.gamepad.id);
		this.connectedGamepad = event.gamepad;
		this.controllerType = detectControllerType(event.gamepad.id);
		console.log('Detected controller type:', this.controllerType);

		// Initialize button states for this gamepad
		this.previousButtonStates.set(event.gamepad.index, new Array(event.gamepad.buttons.length).fill(false));
		this.previousAxisStates.set(event.gamepad.index, { x: false, y: false });

		this.startPolling();

		if (this.onControllerConnected) {
			this.onControllerConnected(this.controllerType);
		}
	}

	/**
	 * Handle gamepad disconnection
	 */
	private handleGamepadDisconnected(event: GamepadEvent): void {
		console.log('Gamepad disconnected:', event.gamepad.id);

		if (this.connectedGamepad && this.connectedGamepad.index === event.gamepad.index) {
			this.connectedGamepad = null;
			this.previousButtonStates.delete(event.gamepad.index);
			this.previousAxisStates.delete(event.gamepad.index);
			this.stopPolling();

			if (this.onControllerDisconnected) {
				this.onControllerDisconnected();
			}
		}
	}

	/**
	 * Start polling for gamepad input
	 */
	private startPolling(): void {
		if (!this.animationFrameId) {
			this.poll();
		}
	}

	/**
	 * Stop polling for gamepad input
	 */
	private stopPolling(): void {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}

	/**
	 * Poll gamepad state and emit input events
	 */
	private poll(): void {
		if (!this.connectedGamepad) {
			return;
		}

		// Get fresh gamepad state (must be called each frame)
		const gamepads = navigator.getGamepads();
		const gamepad = gamepads[this.connectedGamepad.index];

		if (!gamepad) {
			this.animationFrameId = requestAnimationFrame(this.poll);
			return;
		}

		this.processButtons(gamepad);
		this.processAnalogStick(gamepad);

		this.animationFrameId = requestAnimationFrame(this.poll);
	}

	/**
	 * Process button presses
	 */
	private processButtons(gamepad: Gamepad): void {
		const previousStates = this.previousButtonStates.get(gamepad.index) || [];
		const mapping = ControllerMappings[this.controllerType];

		gamepad.buttons.forEach((button, index) => {
			const isPressed = button.pressed;
			const wasPressed = previousStates[index] || false;

			// Button just pressed (rising edge)
			if (isPressed && !wasPressed) {
				const action = mapping[index as GamepadButton];
				if (action) {
					this.emitInputEvent(action);
				}
			}

			previousStates[index] = isPressed;
		});

		this.previousButtonStates.set(gamepad.index, previousStates);
	}

	/**
	 * Process analog stick as directional input
	 */
	private processAnalogStick(gamepad: Gamepad): void {
		const axes = gamepad.axes;
		if (axes.length < 2) return;

		const previousState = this.previousAxisStates.get(gamepad.index) || { x: false, y: false };

		// Left stick X-axis (left/right)
		const xAxis = axes[GamepadAxis.LEFT_STICK_X];
		const xPressed = Math.abs(xAxis) > ANALOG_DEADZONE && Math.abs(xAxis) > ANALOG_THRESHOLD;

		if (xPressed && !previousState.x) {
			if (xAxis < 0) {
				this.emitInputEvent(InputAction.NAVIGATE_LEFT);
			} else {
				this.emitInputEvent(InputAction.NAVIGATE_RIGHT);
			}
		}

		// Left stick Y-axis (up/down)
		const yAxis = axes[GamepadAxis.LEFT_STICK_Y];
		const yPressed = Math.abs(yAxis) > ANALOG_DEADZONE && Math.abs(yAxis) > ANALOG_THRESHOLD;

		if (yPressed && !previousState.y) {
			if (yAxis < 0) {
				this.emitInputEvent(InputAction.NAVIGATE_UP);
			} else {
				this.emitInputEvent(InputAction.NAVIGATE_DOWN);
			}
		}

		this.previousAxisStates.set(gamepad.index, {
			x: xPressed,
			y: yPressed,
		});
	}

	/**
	 * Emit an input event to all listeners
	 */
	private emitInputEvent(action: InputAction): void {
		const event: InputEvent = {
			action,
			source: this.controllerType,
			timestamp: Date.now(),
		};

		this.listeners.forEach(listener => listener(event));
	}
}

// Singleton instance
let gamepadManager: GamepadManager | null = null;

/**
 * Get the singleton gamepad manager instance
 */
export function getGamepadManager(): GamepadManager {
	if (!gamepadManager) {
		gamepadManager = new GamepadManager();
	}
	return gamepadManager;
}
