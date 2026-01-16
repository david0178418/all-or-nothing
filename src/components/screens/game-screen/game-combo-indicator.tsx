import { Box, LinearProgress, Typography, keyframes } from '@mui/material';
import { useComboCount, useLastMatchTime, useTime } from './game-play-area';

const COMBO_THRESHOLD_SECONDS = 7;

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
	const currentTime = useTime();

	const timeElapsed = currentTime - lastMatchTime;
	const timeRemaining = Math.max(0, COMBO_THRESHOLD_SECONDS - timeElapsed);
	const progress = (timeRemaining / COMBO_THRESHOLD_SECONDS) * 100;

	const isActive = comboCount > 0 || timeRemaining > 0;

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
