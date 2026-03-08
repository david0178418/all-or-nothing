import { useEffect, useRef, useMemo } from 'react';
import type { PlayerId } from '@/multiplayer/multiplayer-types';
import {
	usePlayerFocus,
	useRegisterMultiplayerElement,
	useUnregisterMultiplayerElement,
} from './multiplayer-focus-atoms';

interface UseMultiplayerFocusableOptions {
	id: string;
	gridPosition?: { row: number; col: number };
	order?: number;
	onSelect?: (playerId: PlayerId) => void;
	disabled?: boolean;
}

export function useMultiplayerFocusable({
	id,
	gridPosition,
	order,
	onSelect,
	disabled = false,
}: UseMultiplayerFocusableOptions) {
	const elementRef = useRef<HTMLElement>(null);
	const playerFocus = usePlayerFocus();
	const registerElement = useRegisterMultiplayerElement();
	const unregisterElement = useUnregisterMultiplayerElement();

	const onSelectRef = useRef(onSelect);
	useEffect(() => {
		onSelectRef.current = onSelect;
	}, [onSelect]);

	useEffect(() => {
		if (disabled) {
			unregisterElement({ id });
			return;
		}

		const element = {
			id,
			gridPosition,
			order,
			onSelect: (playerId: PlayerId) => {
				onSelectRef.current?.(playerId);
			},
		};

		registerElement(element);

		return () => {
			unregisterElement({ id, element });
		};
	}, [id, gridPosition?.row, gridPosition?.col, order, disabled, registerElement, unregisterElement]);

	const focusedBy = useMemo(() =>
		Array.from(playerFocus.entries())
			.filter(([, focusId]) => focusId === id)
			.map(([pid]) => pid),
		[playerFocus, id]
	);

	return {
		ref: elementRef,
		focusedBy,
	};
}
