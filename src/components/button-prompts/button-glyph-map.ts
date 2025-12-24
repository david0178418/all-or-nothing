import { ControllerType, InputAction } from '@/input/input-types';

// Xbox imports
import xboxButtonA from './assets/xbox/button_a.svg';
import xboxButtonB from './assets/xbox/button_b.svg';
import xboxButtonX from './assets/xbox/button_x.svg';
import xboxButtonY from './assets/xbox/button_y.svg';
import xboxButtonStart from './assets/xbox/button_start.svg';
import xboxDpadUp from './assets/xbox/dpad_up.svg';
import xboxDpadDown from './assets/xbox/dpad_down.svg';
import xboxDpadLeft from './assets/xbox/dpad_left.svg';
import xboxDpadRight from './assets/xbox/dpad_right.svg';

// PlayStation imports
import psButtonCross from './assets/playstation/button_cross.svg';
import psButtonCircle from './assets/playstation/button_circle.svg';
import psButtonSquare from './assets/playstation/button_square.svg';
import psButtonTriangle from './assets/playstation/button_triangle.svg';
import psButtonOptions from './assets/playstation/button_options.svg';
import psDpadUp from './assets/playstation/dpad_up.svg';
import psDpadDown from './assets/playstation/dpad_down.svg';
import psDpadLeft from './assets/playstation/dpad_left.svg';
import psDpadRight from './assets/playstation/dpad_right.svg';

// Nintendo Switch imports
import switchButtonA from './assets/switch/button_a.svg';
import switchButtonB from './assets/switch/button_b.svg';
import switchButtonX from './assets/switch/button_x.svg';
import switchButtonY from './assets/switch/button_y.svg';
import switchButtonPlus from './assets/switch/button_plus.svg';
import switchDpadUp from './assets/switch/dpad_up.svg';
import switchDpadDown from './assets/switch/dpad_down.svg';
import switchDpadLeft from './assets/switch/dpad_left.svg';
import switchDpadRight from './assets/switch/dpad_right.svg';

// Keyboard imports
import keyboardEnter from './assets/keyboard/enter.svg';
import keyboardEscape from './assets/keyboard/escape.svg';
import keyboardH from './assets/keyboard/h.svg';
import keyboardR from './assets/keyboard/r.svg';
import keyboardP from './assets/keyboard/p.svg';
import keyboardArrowUp from './assets/keyboard/arrow_up.svg';
import keyboardArrowDown from './assets/keyboard/arrow_down.svg';
import keyboardArrowLeft from './assets/keyboard/arrow_left.svg';
import keyboardArrowRight from './assets/keyboard/arrow_right.svg';

/**
 * Maps ControllerType + InputAction to SVG glyph URL
 */
export const ButtonGlyphMap: Record<ControllerType, Partial<Record<InputAction, string>>> = {
	[ControllerType.XBOX]: {
		[InputAction.SELECT]: xboxButtonA,
		[InputAction.BACK]: xboxButtonB,
		[InputAction.HINT]: xboxButtonX,
		[InputAction.SHUFFLE]: xboxButtonY,
		[InputAction.PAUSE]: xboxButtonStart,
		[InputAction.NAVIGATE_UP]: xboxDpadUp,
		[InputAction.NAVIGATE_DOWN]: xboxDpadDown,
		[InputAction.NAVIGATE_LEFT]: xboxDpadLeft,
		[InputAction.NAVIGATE_RIGHT]: xboxDpadRight,
	},
	[ControllerType.PLAYSTATION]: {
		[InputAction.SELECT]: psButtonCross,
		[InputAction.BACK]: psButtonCircle,
		[InputAction.HINT]: psButtonSquare,
		[InputAction.SHUFFLE]: psButtonTriangle,
		[InputAction.PAUSE]: psButtonOptions,
		[InputAction.NAVIGATE_UP]: psDpadUp,
		[InputAction.NAVIGATE_DOWN]: psDpadDown,
		[InputAction.NAVIGATE_LEFT]: psDpadLeft,
		[InputAction.NAVIGATE_RIGHT]: psDpadRight,
	},
	[ControllerType.NINTENDO_SWITCH]: {
		[InputAction.SELECT]: switchButtonB,
		[InputAction.BACK]: switchButtonA,
		[InputAction.HINT]: switchButtonY,
		[InputAction.SHUFFLE]: switchButtonX,
		[InputAction.PAUSE]: switchButtonPlus,
		[InputAction.NAVIGATE_UP]: switchDpadUp,
		[InputAction.NAVIGATE_DOWN]: switchDpadDown,
		[InputAction.NAVIGATE_LEFT]: switchDpadLeft,
		[InputAction.NAVIGATE_RIGHT]: switchDpadRight,
	},
	[ControllerType.KEYBOARD]: {
		[InputAction.SELECT]: keyboardEnter,
		[InputAction.BACK]: keyboardEscape,
		[InputAction.HINT]: keyboardH,
		[InputAction.SHUFFLE]: keyboardR,
		[InputAction.PAUSE]: keyboardP,
		[InputAction.NAVIGATE_UP]: keyboardArrowUp,
		[InputAction.NAVIGATE_DOWN]: keyboardArrowDown,
		[InputAction.NAVIGATE_LEFT]: keyboardArrowLeft,
		[InputAction.NAVIGATE_RIGHT]: keyboardArrowRight,
	},
	// Generic uses Xbox glyphs
	[ControllerType.GENERIC]: {
		[InputAction.SELECT]: xboxButtonA,
		[InputAction.BACK]: xboxButtonB,
		[InputAction.HINT]: xboxButtonX,
		[InputAction.SHUFFLE]: xboxButtonY,
		[InputAction.PAUSE]: xboxButtonStart,
		[InputAction.NAVIGATE_UP]: xboxDpadUp,
		[InputAction.NAVIGATE_DOWN]: xboxDpadDown,
		[InputAction.NAVIGATE_LEFT]: xboxDpadLeft,
		[InputAction.NAVIGATE_RIGHT]: xboxDpadRight,
	},
};
