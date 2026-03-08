import { useSetIsPaused } from '@/atoms';
import {
	PlayArrow as PlayArrowIcon,
	ArrowBack as BackIcon,
} from '@mui/icons-material';
import { useCallback } from 'react';
import FocusableButton from '@/components/focusable-button';
import SharedPauseDialog from '@/components/shared-pause-dialog';

interface MultiplayerPauseDialogProps {
	onQuit: () => void;
}

export default
function MultiplayerPauseDialog({ onQuit }: MultiplayerPauseDialogProps) {
	const setPaused = useSetIsPaused();

	const handleResume = useCallback(() => {
		setPaused(false);
	}, [setPaused]);

	const handleQuit = useCallback(() => {
		onQuit();
		setPaused(false);
	}, [onQuit, setPaused]);

	return (
		<SharedPauseDialog
			focusGroup="mp-pause-dialog"
			soundMusicStartOrder={2}
			onClose={handleResume}
		>
			<FocusableButton
				id="mp-pause-resume"
				group="mp-pause-dialog"
				order={0}
				startIcon={<PlayArrowIcon />}
				onClick={handleResume}
				autoFocus
			>
				Resume
			</FocusableButton>
			<FocusableButton
				id="mp-pause-quit"
				group="mp-pause-dialog"
				order={1}
				startIcon={<BackIcon />}
				onClick={handleQuit}
			>
				Quit to Title
			</FocusableButton>
		</SharedPauseDialog>
	);
}
