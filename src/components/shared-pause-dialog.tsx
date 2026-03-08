import { ReactNode, useCallback, useEffect } from 'react';
import {
	useIsPaused,
	useIsSoundEnabled,
	useSetIsSoundEnabled,
	useIsMusicEnabled,
	useSetIsMusicEnabled,
} from '@/atoms';
import { useSetActiveGroup } from '@/focus/focus-atoms';
import {
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
import FocusableButton from '@/components/focusable-button';

interface SharedPauseDialogProps {
	focusGroup: string;
	children: ReactNode;
	soundMusicStartOrder: number;
	onClose: () => void;
}

export default
function SharedPauseDialog({ focusGroup, children, soundMusicStartOrder, onClose }: SharedPauseDialogProps) {
	const paused = useIsPaused();
	const setActiveGroup = useSetActiveGroup();
	const isSoundEnabled = useIsSoundEnabled();
	const setIsSoundEnabled = useSetIsSoundEnabled();
	const isMusicEnabled = useIsMusicEnabled();
	const setIsMusicEnabled = useSetIsMusicEnabled();
	// Set focus group when paused, clear when unpaused
	useEffect(() => {
		setActiveGroup(paused ? focusGroup : null);
	}, [paused, setActiveGroup, focusGroup]);

	const handleToggleSound = useCallback(() => {
		setIsSoundEnabled(!isSoundEnabled);
	}, [isSoundEnabled, setIsSoundEnabled]);

	const handleToggleMusic = useCallback(() => {
		setIsMusicEnabled(!isMusicEnabled);
	}, [isMusicEnabled, setIsMusicEnabled]);

	return (
		<Dialog open={paused} onClose={onClose}>
			<DialogContent>
				<DialogContentText>
					Paused
				</DialogContentText>
				<Box
					display="inline-block"
					width={300}
				>
					<Box display="flex" flexDirection="column" gap={2}>
						{children}
						<FocusableButton
							id={`${focusGroup}-sound`}
							group={focusGroup}
							order={soundMusicStartOrder}
							startIcon={isSoundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
							onClick={handleToggleSound}
						>
							Sound: {isSoundEnabled ? 'On' : 'Off'}
						</FocusableButton>
						<FocusableButton
							id={`${focusGroup}-music`}
							group={focusGroup}
							order={soundMusicStartOrder + 1}
							startIcon={isMusicEnabled ? <MusicNoteIcon /> : <MusicOffIcon />}
							onClick={handleToggleMusic}
						>
							Music: {isMusicEnabled ? 'On' : 'Off'}
						</FocusableButton>
					</Box>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
