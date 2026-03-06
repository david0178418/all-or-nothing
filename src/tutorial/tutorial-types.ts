import { ReactNode } from 'react';

export interface TutorialStep {
	readonly id: string;
	readonly content: ReactNode;
	readonly highlightCards?: readonly number[];
	readonly enableSelection?: boolean;
	readonly tooltipPosition?: 'top' | 'bottom' | 'center';
}
