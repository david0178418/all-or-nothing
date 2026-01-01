import { useIsPaused } from '@/atoms';
import { useInterval } from '@/hooks';
import FormattedTime from '@/components/formatted-time';
import { updateTime, decayScoreValue, resetComboIfExpired } from '@/core';
import { useTimeout } from '@/utils';
import { useState } from 'react';
import { useTime } from './game-play-area';

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
		Promise.all([
			updateTime(newTime),
			decayScoreValue(1),
			resetComboIfExpired(newTime),
		]);
	}, runTimer ? 1000 : null);

	if(!time) {
		return null;
	}

	return (
		<FormattedTime label="Time:" value={time} variant="h5" />
	);
}
