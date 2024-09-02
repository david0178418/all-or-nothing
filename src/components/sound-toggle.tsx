import { Fab } from "@mui/material";
import { useIsSoundEnabled, useSetIsSoundEnabled } from "@/atoms";
import {
	VolumeUp as VolumeUpIcon,
	VolumeOff as VolumeOffIcon,
} from '@mui/icons-material';

export default
function SoundToggle() {
	const isSoundEnabled = useIsSoundEnabled();
	const setIsSoundEnabled = useSetIsSoundEnabled();

	return (
		<Fab
			color="primary"
			size="small"
			sx={{
				position: 'fixed',
				bottom: 16,
				right: 16,
			}}
			onClick={() => setIsSoundEnabled(!isSoundEnabled)}
		>
			{isSoundEnabled ? (
				<VolumeUpIcon />
			): (
				<VolumeOffIcon />
			)}
		</Fab>
	);
}
