import confetti from 'canvas-confetti';

export
function fireConvergenceConfetti(
	center: { x: number; y: number },
	colors: string[],
) {
	confetti({
		particleCount: 80,
		spread: 360,
		origin: center,
		colors,
		startVelocity: 30,
		gravity: 0.8,
		ticks: 80,
		disableForReducedMotion: true,
	});
}

/**
 * Fire small particle trail bursts along card paths during convergence.
 * Returns a cleanup function to cancel pending timeouts.
 */
const trailColors = ['#ff8f00', '#ffc107', '#ffab00'] as const;

export
function fireConvergenceTrails(
	cardPositions: ReadonlyArray<{ x: number; y: number }>,
	center: { x: number; y: number },
): () => void {
	const trailSteps = 6;
	const stepInterval = 60; // ms between trail bursts
	const timeouts: ReturnType<typeof setTimeout>[] = [];

	cardPositions.forEach((start) => {
		Array.from({ length: trailSteps }, (_, step) => {
			const t = (step + 1) / (trailSteps + 1);
			const trailX = start.x + (center.x - start.x) * t;
			const trailY = start.y + (center.y - start.y) * t;

			const timeout = setTimeout(() => {
				confetti({
					particleCount: 15,
					spread: 50,
					origin: { x: trailX, y: trailY },
					colors: [...trailColors],
					startVelocity: 12,
					gravity: 0.5,
					ticks: 60,
					scalar: 0.8,
					disableForReducedMotion: true,
				});
			}, step * stepInterval);

			timeouts.push(timeout);
		});
	});

	return () => timeouts.forEach(clearTimeout);
}
