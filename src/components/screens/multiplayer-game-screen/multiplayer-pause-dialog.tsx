import {
	useSetIsPaused,
	useIsSoundEnabled,
	useSetIsSoundEnabled,
	useIsMusicEnabled,
	useSetIsMusicEnabled,
} from '@/atoms';
import {
	PlayArrow as PlayArrowIcon,
	ArrowBack as BackIcon,
	VolumeUp as VolumeUpIcon,
	VolumeOff as VolumeOffIcon,
	MusicNote as MusicNoteIcon,
	MusicOff as MusicOffIcon,
} from '@mui/icons-material';
import { useCallback } from 'react';
import FocusableButton from '@/components/focusable-button';
import SharedPauseDialog from '@/components/shared-pause-dialog';

const FOCUS_GROUP = 'mp-pause-dialog';

interface MultiplayerPauseDialogProps {
	onQuit: () => void;
}

export default
function MultiplayerPauseDialog({ onQuit }: MultiplayerPauseDialogProps) {
	const setPaused = useSetIsPaused();
	const isSoundEnabled = useIsSoundEnabled();
	const setIsSoundEnabled = useSetIsSoundEnabled();
	const isMusicEnabled = useIsMusicEnabled();
	const setIsMusicEnabled = useSetIsMusicEnabled();

	const handleResume = useCallback(() => {
		setPaused(false);
	}, [setPaused]);

	const handleQuit = useCallback(() => {
		onQuit();
		setPaused(false);
	}, [onQuit, setPaused]);

	const handleToggleSound = useCallback(() => {
		setIsSoundEnabled(!isSoundEnabled);
	}, [isSoundEnabled, setIsSoundEnabled]);

	const handleToggleMusic = useCallback(() => {
		setIsMusicEnabled(!isMusicEnabled);
	}, [isMusicEnabled, setIsMusicEnabled]);

	return (
		<SharedPauseDialog
			focusGroup={FOCUS_GROUP}
			onClose={handleResume}
		>
			<FocusableButton
				id="mp-pause-resume"
				group={FOCUS_GROUP}
				order={0}
				startIcon={<PlayArrowIcon />}
				onClick={handleResume}
				autoFocus
			>
				Resume
			</FocusableButton>
			<FocusableButton
				id="mp-pause-quit"
				group={FOCUS_GROUP}
				order={1}
				startIcon={<BackIcon />}
				onClick={handleQuit}
			>
				Quit to Title
			</FocusableButton>
			<FocusableButton
				id="mp-pause-sound"
				group={FOCUS_GROUP}
				order={2}
				startIcon={isSoundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
				onClick={handleToggleSound}
			>
				Sound: {isSoundEnabled ? 'On' : 'Off'}
			</FocusableButton>
			<FocusableButton
				id="mp-pause-music"
				group={FOCUS_GROUP}
				order={3}
				startIcon={isMusicEnabled ? <MusicNoteIcon /> : <MusicOffIcon />}
				onClick={handleToggleMusic}
			>
				Music: {isMusicEnabled ? 'On' : 'Off'}
			</FocusableButton>
		</SharedPauseDialog>
	);
}
