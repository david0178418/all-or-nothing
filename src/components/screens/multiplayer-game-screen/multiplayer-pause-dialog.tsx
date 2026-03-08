import {
	useIsPaused,
	useSetIsPaused,
	useIsSoundEnabled,
	useSetIsSoundEnabled,
	useIsMusicEnabled,
	useSetIsMusicEnabled,
} from '@/atoms';
import { useSetActiveGroup } from '@/focus/focus-atoms';
import {
	PlayArrow as PlayArrowIcon,
	ArrowBack as BackIcon,
	VolumeUp as VolumeUpIcon,
	VolumeOff as VolumeOffIcon,
	MusicNote as MusicNoteIcon,
	MusicOff as MusicOffIcon,
} from '@mui/icons-material';
import {
	Dialog,
	DialogContent,
	DialogContentText,
	Box,
} from '@mui/material';
import { useEffect, useCallback } from 'react';
import FocusableButton from '@/components/focusable-button';

interface MultiplayerPauseDialogProps {
	onQuit: () => void;
}

export default
function MultiplayerPauseDialog({ onQuit }: MultiplayerPauseDialogProps) {
	const paused = useIsPaused();
	const setPaused = useSetIsPaused();
	const setActiveGroup = useSetActiveGroup();
	const isSoundEnabled = useIsSoundEnabled();
	const setIsSoundEnabled = useSetIsSoundEnabled();
	const isMusicEnabled = useIsMusicEnabled();
	const setIsMusicEnabled = useSetIsMusicEnabled();

	useEffect(() => {
		if (paused) {
			setActiveGroup('mp-pause-dialog');
		}
	}, [paused, setActiveGroup]);

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
		<Dialog open={paused} onClose={handleResume}>
			<DialogContent>
				<DialogContentText>
					Paused
				</DialogContentText>
				<Box
					display="inline-block"
					width={300}
				>
					<Box display="flex" flexDirection="column" gap={2}>
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
							id="mp-pause-sound"
							group="mp-pause-dialog"
							order={1}
							startIcon={isSoundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
							onClick={handleToggleSound}
						>
							Sound: {isSoundEnabled ? 'On' : 'Off'}
						</FocusableButton>
						<FocusableButton
							id="mp-pause-music"
							group="mp-pause-dialog"
							order={2}
							startIcon={isMusicEnabled ? <MusicNoteIcon /> : <MusicOffIcon />}
							onClick={handleToggleMusic}
						>
							Music: {isMusicEnabled ? 'On' : 'Off'}
						</FocusableButton>
						<FocusableButton
							id="mp-pause-quit"
							group="mp-pause-dialog"
							order={3}
							startIcon={<BackIcon />}
							onClick={handleQuit}
						>
							Quit to Title
						</FocusableButton>
					</Box>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
