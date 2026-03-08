import { NavigationDirection } from '@/input/input-types';

export interface NavigableElement {
	id: string;
	gridPosition?: { row: number; col: number };
	order?: number;
}

const DIRECTION_TO_2D_DELTA = {
	[NavigationDirection.UP]: (row: number, col: number) => ({ row: row - 1, col }),
	[NavigationDirection.DOWN]: (row: number, col: number) => ({ row: row + 1, col }),
	[NavigationDirection.LEFT]: (row: number, col: number) => ({ row, col: col - 1 }),
	[NavigationDirection.RIGHT]: (row: number, col: number) => ({ row, col: col + 1 }),
} as const;

const DIRECTION_TO_1D_INDEX = {
	[NavigationDirection.UP]: (currentIndex: number, length: number) => (currentIndex - 1 + length) % length,
	[NavigationDirection.DOWN]: (currentIndex: number, length: number) => (currentIndex + 1) % length,
	[NavigationDirection.LEFT]: (currentIndex: number, length: number) => (currentIndex - 1 + length) % length,
	[NavigationDirection.RIGHT]: (currentIndex: number, length: number) => (currentIndex + 1) % length,
} as const;

export function navigate2D<T extends NavigableElement>(
	direction: NavigationDirection,
	current: T,
	elements: readonly T[]
): string | null {
	if (!current.gridPosition) return null;

	const { row, col } = current.gridPosition;

	const handler = DIRECTION_TO_2D_DELTA[direction];
	if (!handler) return null;

	const { row: targetRow, col: targetCol } = handler(row, col);

	const targetElement = elements.find(
		el => el.gridPosition?.row === targetRow && el.gridPosition?.col === targetCol
	);

	return targetElement?.id ?? null;
}

export function navigate1D<T extends NavigableElement>(
	direction: NavigationDirection,
	current: T,
	elements: readonly T[]
): string | null {
	const sortedElements = [...elements].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
	const currentIndex = sortedElements.findIndex(el => el.id === current.id);

	if (currentIndex === -1) return null;

	const handler = DIRECTION_TO_1D_INDEX[direction];
	if (!handler) return null;

	const targetIndex = handler(currentIndex, sortedElements.length);

	return sortedElements[targetIndex]?.id ?? null;
}
