import { ControllerType } from '@/input/input-types';

export type PlayerId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5';

export interface Player {
	id: PlayerId;
	color: string;
	sourceIndex: number | 'keyboard';
	controllerType: ControllerType;
}

export const PLAYER_COLORS = ['#4285F4', '#34A853', '#FBBC05', '#A142F4', '#FF6D01'] as const;

export const PLAYER_IDS = ['p1', 'p2', 'p3', 'p4', 'p5'] as const;
