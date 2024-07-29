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
	Triangle: BitwiseValues.One,
	Circle: BitwiseValues.Two,
	Square: BitwiseValues.Three,
} as const;

export
const ShapeValues = {
	[Shapes.Triangle]: 'triangle',
	[Shapes.Circle]: 'circle',
	[Shapes.Square]: 'square',
} as const;

export
const Colors = {
	Red: BitwiseValues.One,
	Green: BitwiseValues.Two,
	Blue: BitwiseValues.Three,
} as const;

export
const ColorValues = {
	[Colors.Red]: '#C92020',
	[Colors.Green]: '#17B321',
	[Colors.Blue]: '#8A00A6',
} as const;

export
const Fills = {
	Outline: BitwiseValues.One,
	Solid: BitwiseValues.Two,
	Filled: BitwiseValues.Three,
} as const;

export
const FillValues = {
	[Fills.Outline]: 'outline',
	[Fills.Solid]: 'solid',
	[Fills.Filled]: 'filled',
} as const;

export
const Counts = {
	One: BitwiseValues.One,
	Two: BitwiseValues.Two,
	Three: BitwiseValues.Three,
} as const;

export
const CountValues = {
	[Counts.One]: 1,
	[Counts.Two]: 2,
	[Counts.Three]: 3,
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
