import { useIsPaused } from '@/atoms';
import { useInterval } from '@/hooks';
import { performTimerTick } from '@/core';
import { useTimeout } from '@/utils';
import { useState } from 'react';
import { useTime } from './game-play-area';
import { Box, Typography } from '@mui/material';
import { AccessTime } from '@mui/icons-material';

interface Props {
	gameComplete?: boolean;
}

export default
function GameTimer(props: Props) {
	const { gameComplete } = props;
	const paused = useIsPaused();
	const [passedCardRevealDelay, setPassedCardRevealDelay] = useState(false);
	const time = useTime();
	const runTimer = passedCardRevealDelay && !gameComplete && !paused;

	useTimeout(() => {
		// wait until cards reveal to run timer
		setPassedCardRevealDelay(true);
	}, 1200);

	useInterval(() => {
		const newTime = time + 1;
		performTimerTick(newTime);
	}, runTimer ? 1000 : null);

	const formattedTime = time ?
		`${time / 60 | 0}:${(time % 60).toString().padStart(2, '0')}`
		: '0:00';

	return (
		<Box display="flex" gap={1} alignItems="center">
			<AccessTime />
			<Typography variant="h5">
				<strong>{formattedTime}</strong>
			</Typography>
		</Box>
	);
}
