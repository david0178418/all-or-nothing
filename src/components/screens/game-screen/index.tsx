import Toast from '@/components/toast';
import ReactGA from "react-ga4";
import PauseDialog from '@/components/pause-dialog';
import GamePlayArea from './game-play-area';
import SoundToggle from '@/components/sound-toggle';
import MusicToggle from '@/components/music-toggle';
import { Box } from '@mui/material';

const {
	PROD,
	VITE_GOOGLE_ANALYTICS_ID = '',
} = import.meta.env;

if (PROD && VITE_GOOGLE_ANALYTICS_ID) {
	ReactGA.initialize(VITE_GOOGLE_ANALYTICS_ID);
}

// SVG noise pattern for subtle texture
const noisePattern = `data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E`;

export default
function Game() {
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
					radial-gradient(ellipse at center, #c8d5c8 0%, #a8b8a8 100%)
				`,
				backgroundSize: '200px 200px, 100% 100%, 100% 100%',
				backgroundPosition: '0 0, center, center',
				overflow: 'hidden',
			}}
		>
			<GamePlayArea />
			<Toast />
			<PauseDialog/>
			<MusicToggle />
			<SoundToggle />
		</Box>
	);
}
