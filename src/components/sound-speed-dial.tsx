import { SpeedDial, SpeedDialAction } from "@mui/material";
import {
	useIsSoundEnabled,
	useSetIsSoundEnabled,
	useIsMusicEnabled,
	useSetIsMusicEnabled,
	useActiveController,
} from "@/atoms";
import {
	GraphicEq as GraphicEqIcon,
	VolumeUp as VolumeUpIcon,
	VolumeOff as VolumeOffIcon,
	MusicNote as MusicNoteIcon,
	MusicOff as MusicOffIcon,
} from '@mui/icons-material';
export default
function SoundSpeedDial() {
	const isSoundEnabled = useIsSoundEnabled();
	const setIsSoundEnabled = useSetIsSoundEnabled();
	const isMusicEnabled = useIsMusicEnabled();
	const setIsMusicEnabled = useSetIsMusicEnabled();
	const activeController = useActiveController();

	if (activeController !== null) return null;

	return (
		<SpeedDial
			ariaLabel="Audio controls"
			icon={<GraphicEqIcon />}
			sx={{
				position: 'fixed',
				bottom: 16,
				right: 16,
			}}
			FabProps={{
				size: 'small',
				color: 'primary',
			}}
		>
			<SpeedDialAction
				icon={isMusicEnabled ? <MusicNoteIcon /> : <MusicOffIcon />}
				slotProps={{
					tooltip: { title: `Music: ${isMusicEnabled ? 'On' : 'Off'}` },
				}}
				onClick={() => setIsMusicEnabled(!isMusicEnabled)}
			/>
			<SpeedDialAction
				icon={isSoundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
				slotProps={{
					tooltip: { title: `Sound Effects: ${isSoundEnabled ? 'On' : 'Off'}` },
				}}
				onClick={() => setIsSoundEnabled(!isSoundEnabled)}
			/>
		</SpeedDial>
	);
}
