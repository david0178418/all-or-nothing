import { useSetIsPaused } from '@/atoms';
import {
	Pause as PauseIcon,
	Shuffle as ShuffleIcon,
} from '@mui/icons-material';
import {
	Box,
	Button,
	Fab,
} from '@mui/material';

interface Props {
	canShuffle: boolean;
	onReshuffle(): void;
}

export default
function GameOptionsMobile(props: Props) {
	const setIsPaused = useSetIsPaused();
	const { canShuffle, onReshuffle } = props;

	return (
		<Box
			sx={{
				position: 'fixed',
				bottom: 16,
				left: 0,
				right: 0,
				display: {
					xs: 'flex',
					sm: 'none',
				},
				justifyContent: 'center',
				zIndex: (theme) => theme.zIndex.speedDial,
				pointerEvents: 'none',
			}}
		>
			<Fab
				color="primary"
				size="small"
				sx={{
					position: 'absolute',
					left: 16,
					pointerEvents: 'auto',
				}}
				onClick={() => setIsPaused(true)}
			>
				<PauseIcon />
			</Fab>
			<Button
				variant="outlined"
				startIcon={<ShuffleIcon />}
				disabled={!canShuffle}
				sx={{ pointerEvents: 'auto' }}
				onClick={onReshuffle}
			>
				No sets
			</Button>
		</Box>
	);
}
