import ReactGA from "react-ga4";
import PauseDialog from '@/components/pause-dialog';
import GamePlayArea from './game-play-area';
import SoundSpeedDial from '@/components/sound-speed-dial';
import { useMusic } from '@/components/music-toggle';
import { Box } from '@mui/material';
import { useGameTheme } from '@/themes';
import { noisePattern } from '@/constants';

const {
	PROD,
	VITE_GOOGLE_ANALYTICS_ID = '',
} = import.meta.env;

if (PROD && VITE_GOOGLE_ANALYTICS_ID) {
	ReactGA.initialize(VITE_GOOGLE_ANALYTICS_ID);
}

export default
function Game() {
	const gameTheme = useGameTheme();
	useMusic();

	return (
		<Box
			sx={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100vw',
				height: '100vh',
				background: `
					url("${noisePattern}"),
					radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 100%),
					${gameTheme.background.gameScreen}
				`,
				backgroundSize: '200px 200px, 100% 100%, 100% 100%',
				backgroundPosition: '0 0, center, center',
				overflow: 'hidden',
			}}
		>
			<GamePlayArea />
			<PauseDialog/>
			<SoundSpeedDial />
		</Box>
	);
}
