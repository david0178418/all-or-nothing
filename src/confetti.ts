import confetti from 'canvas-confetti';
import { Card, ColorValues } from '@/types';

function getCardCenter(cardId: string): { x: number; y: number } | null {
	const el = document.querySelector(`[data-card-id=${CSS.escape(cardId)}]`);

	if (!el) {
		return null;
	}

	const rect = el.getBoundingClientRect();

	return {
		x: (rect.left + rect.width / 2) / window.innerWidth,
		y: (rect.top + rect.height / 2) / window.innerHeight,
	};
}

export
function fireMatchConfetti(cards: [Card, Card, Card]) {
	const colors = cards.map(card => ColorValues[card.color]);

	cards.forEach(card => {
		if (!card.id) {
			return;
		}

		const origin = getCardCenter(card.id);

		if (!origin) {
			return;
		}

		confetti({
			particleCount: 40,
			spread: 70,
			origin,
			colors,
			startVelocity: 25,
			gravity: 0.8,
			ticks: 60,
			disableForReducedMotion: true,
		});
	});
}
