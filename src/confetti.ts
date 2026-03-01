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
