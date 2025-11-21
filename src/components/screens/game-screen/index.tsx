import Toast from '@/components/toast';
import ReactGA from "react-ga4";
import PauseDialog from '@/components/pause-dialog';
import GamePlayArea from './game-play-area';
import SoundToggle from '@/components/sound-toggle';
import MusicToggle from '@/components/music-toggle';

const IsProd = import.meta.env.NODE_ENV === 'production';
const GoogleAnalyticsId = import.meta.env.GOOGLE_ANALYTICS_ID || '';

if (IsProd && GoogleAnalyticsId) {
	ReactGA.initialize(GoogleAnalyticsId);
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
