import { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { Card } from '@/types';
import { useGameTheme } from '@/themes';
import { fireConvergenceConfetti, fireConvergenceTrails } from '@/confetti';

export interface ConvergenceData {
	offsets: Map<string, { dx: number; dy: number }>;
	center: { x: number; y: number };
	colors: string[];
}

export function useConvergenceAnimation(
	discardingCardIds: readonly string[],
	cards: readonly Card[],
): ConvergenceData | null {
	const gameTheme = useGameTheme();
	const [convergenceData, setConvergenceData] = useState<ConvergenceData | null>(null);
	const confettiTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
	const trailCleanupRef = useRef<(() => void) | undefined>(undefined);
	const cardsRef = useRef(cards);
	cardsRef.current = cards;

	// Compute convergence offsets when cards are being discarded
	useLayoutEffect(() => {
		if (discardingCardIds.length === 0) {
			setConvergenceData(null);
			clearTimeout(confettiTimeoutRef.current);
			trailCleanupRef.current?.();
			return;
		}

		if (discardingCardIds.length < 3) {
			return;
		}

		const batchIds = discardingCardIds.slice(-3);

		const positions = batchIds
			.map(id => {
				const el = document.querySelector(`[data-card-id="${CSS.escape(id)}"]`);
				if (!el) return null;
				const rect = el.getBoundingClientRect();
				return { id, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
			})
			.filter((p): p is NonNullable<typeof p> => p !== null);

		if (positions.length < 3) return;

		const centerX = positions.reduce((sum, p) => sum + p.x, 0) / positions.length;
		const centerY = positions.reduce((sum, p) => sum + p.y, 0) / positions.length;

		const offsets = new Map<string, { dx: number; dy: number }>();
		positions.forEach(p => {
			offsets.set(p.id, {
				dx: centerX - p.x,
				dy: centerY - p.y,
			});
		});

		const batchColors = batchIds
			.map(id => cardsRef.current.find(c => c.id === id))
			.filter((c): c is Card => !!c)
			.map(c => gameTheme.colors[c.color]);

		const data: ConvergenceData = {
			offsets,
			center: {
				x: centerX / window.innerWidth,
				y: centerY / window.innerHeight,
			},
			colors: batchColors,
		};

		setConvergenceData(data);

		// Fire particle trails during convergence phase (starts after 350ms glow delay)
		trailCleanupRef.current?.();
		const cardScreenPositions = positions.map(p => ({
			x: p.x / window.innerWidth,
			y: p.y / window.innerHeight,
		}));
		const trailTimeout = setTimeout(() => {
			trailCleanupRef.current = fireConvergenceTrails(
				cardScreenPositions,
				data.center,
			);
		}, 350);

		// Fire confetti when convergence reaches center:
		// 350ms glow delay + 420ms convergence phase (60% of 700ms)
		clearTimeout(confettiTimeoutRef.current);
		confettiTimeoutRef.current = setTimeout(() => {
			fireConvergenceConfetti(data.center, data.colors);
		}, 780);

		return () => clearTimeout(trailTimeout);
	}, [discardingCardIds, gameTheme.colors]);

	// Cleanup confetti timeout and trail particles on unmount
	useEffect(() => {
		return () => {
			clearTimeout(confettiTimeoutRef.current);
			trailCleanupRef.current?.();
		};
	}, []);

	return convergenceData;
}
