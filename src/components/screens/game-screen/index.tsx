import Toast from '@/components/toast';
import ReactGA from "react-ga4";
import PauseDialog from '@/components/pause-dialog';
import GamePlayArea from './game-play-area';
import SoundToggle from '@/components/sound-toggle';
import MusicToggle from '@/components/music-toggle';

const {
	PROD,
	VITE_GOOGLE_ANALYTICS_ID = '',
} = import.meta.env;

if (PROD && VITE_GOOGLE_ANALYTICS_ID) {
	ReactGA.initialize(VITE_GOOGLE_ANALYTICS_ID);
}

export default
function Game() {
	return (
		<>
			<GamePlayArea />
			<Toast />
			<PauseDialog/>
			<MusicToggle />
			<SoundToggle />
		</>
	);
}
