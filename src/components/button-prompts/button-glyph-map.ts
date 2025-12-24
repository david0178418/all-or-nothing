import { ControllerType, InputAction } from '@/input/input-types';
import { FunctionComponent, SVGProps } from 'react';

type SvgComponent = FunctionComponent<SVGProps<SVGSVGElement>>;

// Xbox imports
import xboxButtonA from './assets/xbox/button_a.svg?react';
import xboxButtonB from './assets/xbox/button_b.svg?react';
import xboxButtonX from './assets/xbox/button_x.svg?react';
import xboxButtonY from './assets/xbox/button_y.svg?react';
import xboxButtonStart from './assets/xbox/button_start.svg?react';
import xboxDpadUp from './assets/xbox/dpad_up.svg?react';
import xboxDpadDown from './assets/xbox/dpad_down.svg?react';
import xboxDpadLeft from './assets/xbox/dpad_left.svg?react';
import xboxDpadRight from './assets/xbox/dpad_right.svg?react';

// PlayStation imports
import psButtonCross from './assets/playstation/button_cross.svg?react';
import psButtonCircle from './assets/playstation/button_circle.svg?react';
import psButtonSquare from './assets/playstation/button_square.svg?react';
import psButtonTriangle from './assets/playstation/button_triangle.svg?react';
import psButtonOptions from './assets/playstation/button_options.svg?react';
import psDpadUp from './assets/playstation/dpad_up.svg?react';
import psDpadDown from './assets/playstation/dpad_down.svg?react';
import psDpadLeft from './assets/playstation/dpad_left.svg?react';
import psDpadRight from './assets/playstation/dpad_right.svg?react';

// Nintendo Switch imports
import switchButtonA from './assets/switch/button_a.svg?react';
import switchButtonB from './assets/switch/button_b.svg?react';
import switchButtonX from './assets/switch/button_x.svg?react';
import switchButtonY from './assets/switch/button_y.svg?react';
import switchButtonPlus from './assets/switch/button_plus.svg?react';
import switchDpadUp from './assets/switch/dpad_up.svg?react';
import switchDpadDown from './assets/switch/dpad_down.svg?react';
import switchDpadLeft from './assets/switch/dpad_left.svg?react';
import switchDpadRight from './assets/switch/dpad_right.svg?react';

// Keyboard imports
import keyboardEnter from './assets/keyboard/enter.svg?react';
import keyboardEscape from './assets/keyboard/escape.svg?react';
import keyboardH from './assets/keyboard/h.svg?react';
import keyboardR from './assets/keyboard/r.svg?react';
import keyboardP from './assets/keyboard/p.svg?react';
import keyboardArrowUp from './assets/keyboard/arrow_up.svg?react';
import keyboardArrowDown from './assets/keyboard/arrow_down.svg?react';
import keyboardArrowLeft from './assets/keyboard/arrow_left.svg?react';
import keyboardArrowRight from './assets/keyboard/arrow_right.svg?react';

/**
 * Maps ControllerType + InputAction to SVG component
 */
export const ButtonGlyphMap: Record<ControllerType, Partial<Record<InputAction, SvgComponent>>> = {
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
