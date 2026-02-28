import { useState, useEffect, useRef } from 'react';
import { Box, LinearProgress, Typography, keyframes } from '@mui/material';
import { useComboCount, useLastMatchTime } from '@/game-queries';
import { useIsPaused } from '@/atoms';
import { resetComboState, SCORE_CONFIG } from '@/core';

const { COMBO_THRESHOLD_SECONDS } = SCORE_CONFIG;

const pulseAnimation = keyframes`
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.1);
	}
	100% {
		transform: scale(1);
	}
`;

export default
function GameComboIndicator() {
	const comboCount = useComboCount();
	const lastMatchTime = useLastMatchTime();
	const paused = useIsPaused();
	const [elapsed, setElapsed] = useState<number>(COMBO_THRESHOLD_SECONDS);
	const prevLastMatchTimeRef = useRef(lastMatchTime);
	const matchTimestampRef = useRef<number | null>(null);
	const prevPausedRef = useRef(paused);

	// Reset combo state when game becomes paused
	useEffect(() => {
		if (paused && !prevPausedRef.current) {
			resetComboState();
		}
		prevPausedRef.current = paused;
	}, [paused]);

	// Synchronize elapsed state during render when lastMatchTime changes.
	// This avoids the one-frame flash from waiting for an effect to reset the animation.
	if (lastMatchTime !== prevLastMatchTimeRef.current) {
		prevLastMatchTimeRef.current = lastMatchTime;
		if (lastMatchTime > 0) {
			matchTimestampRef.current = performance.now();
			setElapsed(0);
		} else {
			matchTimestampRef.current = null;
			setElapsed(COMBO_THRESHOLD_SECONDS);
		}
	}

	// Wall-clock driven animation loop — fully decoupled from the integer game timer,
	// eliminating jumps at second boundaries and ensuring the bar always starts at 100%.
	useEffect(() => {
		if (paused || matchTimestampRef.current === null || lastMatchTime === 0) {
			return;
		}

		const startTimestamp = matchTimestampRef.current;
		let animationFrameId: number;

		const animate = () => {
			const wallElapsed = (performance.now() - startTimestamp) / 1000;
			setElapsed(wallElapsed);
			if (wallElapsed < COMBO_THRESHOLD_SECONDS) {
				animationFrameId = requestAnimationFrame(animate);
			}
		};

		animationFrameId = requestAnimationFrame(animate);

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [lastMatchTime, paused]);

	const timeRemaining = Math.max(0, COMBO_THRESHOLD_SECONDS - elapsed);
	const progress = (timeRemaining / COMBO_THRESHOLD_SECONDS) * 100;
	const isActive = lastMatchTime > 0 && (comboCount > 0 || timeRemaining > 0);

	const getBarColor = () => {
		if (timeRemaining > 4) return '#4caf50'; // Green
		if (timeRemaining > 2) return '#ffc107'; // Yellow
		return '#f44336'; // Red
	};

	return (
		<Box
			paddingX={1}
			display="flex"
			alignItems="center"
			gap={2}
			sx={{
				paddingTop: 1,
				paddingBottom: 1,
				minHeight: {
					xs: '30px',
				},
				visibility: isActive ? 'visible' : 'hidden',
			}}
		>
			<Typography
				variant="body1"
				sx={{
					fontWeight: 'bold',
					whiteSpace: 'nowrap',
					animation: `${pulseAnimation} 0.4s ease-in-out`,
					fontSize: {
						xs: '0.9rem',
						sm: '1rem',
					},
				}}
			>
				×{comboCount + 1} Combo
			</Typography>

			<Box
				sx={{
					flexGrow: 1,
					display: 'flex',
					alignItems: 'center',
					gap: 1,
				}}
			>
				<LinearProgress
					variant="determinate"
					value={progress}
					sx={{
						flexGrow: 1,
						height: {
							xs: 6,
							sm: 8,
						},
						borderRadius: 1,
						backgroundColor: 'rgba(255, 255, 255, 0.1)',
						'& .MuiLinearProgress-bar': {
							backgroundColor: getBarColor(),
							transition: 'background-color 0.3s ease, transform 0.1s linear',
						},
					}}
				/>
				<Typography
					variant="caption"
					sx={{
						minWidth: '32px',
						textAlign: 'right',
						fontSize: {
							xs: '0.7rem',
							sm: '0.75rem',
						},
					}}
				>
					{timeRemaining.toFixed(1)}s
				</Typography>
			</Box>
		</Box>
	);
}
