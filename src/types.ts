import { ReactNode } from "react";

export
type Enum<T extends object> = T[keyof T];

export
type BitwiseValue = Enum<typeof BitwiseValues>;

export
const BitwiseValues = {
	One: 1,
	Two: 2,
	Three: 4,
} as const;

export
const Shapes = {
	triangle: BitwiseValues.One,
	circle: BitwiseValues.Two,
	square: BitwiseValues.Three,
} as const;

export
const ShapeValues = {
	[BitwiseValues.One]: 'triangle',
	[BitwiseValues.Two]: 'circle',
	[BitwiseValues.Three]: 'square',
} as const;

export
const Colors = {
	red: 1,
	green: 2,
	blue: 4,
} as const;

export
const ColorValues = {
	[BitwiseValues.One]: '#FF0000',
	[BitwiseValues.Two]: '#00FF00',
	[BitwiseValues.Three]: '#0000FF',
} as const;

export
const Fills = {
	outline: BitwiseValues.One,
	solid: BitwiseValues.Two,
	filled: BitwiseValues.Three,
} as const;

export
const FillValues = {
	[BitwiseValues.One]: 'outline',
	[BitwiseValues.Two]: 'solid',
	[BitwiseValues.Three]: 'filled',
} as const;

export
const Counts = {
	one: BitwiseValues.One,
	two: BitwiseValues.Two,
	three: BitwiseValues.Three,
} as const;

export
const CountValues = {
	[BitwiseValues.One]: 1,
	[BitwiseValues.Two]: 2,
	[BitwiseValues.Three]: 3,
} as const;

export
interface Card {
	id: string;
	shape: Enum<typeof Shapes>;
	color: Enum<typeof Colors>;
	fill: Enum<typeof Fills>;
	count: Enum<typeof Counts>;
}

export
interface ToastMesssage {
	message: ReactNode;
	delay?: number;
	onClose?(): void;
}
