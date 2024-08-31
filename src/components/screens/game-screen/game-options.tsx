import { useSetIsPaused } from '@/atoms';
import {
	Pause as PauseIcon,
	QuestionMark as QuestionMarkIcon,
	Shuffle as ShuffleIcon,
} from '@mui/icons-material';
import {
	Box,
	Button,
	ButtonGroup,
} from '@mui/material';

interface Props {
	canShuffle?: boolean;
	onReshuffle(): void;
	onHintMessage(): void;
}

export default
function GameOptions(props: Props) {
	const setIsPaused = useSetIsPaused();
	const {
		canShuffle,
		onReshuffle,
		onHintMessage,
	} = props;

	return (
		<Box
			paddingTop={3}
			paddingBottom={20}
			textAlign="center"
			display={{
				xs: 'none',
				sm: 'block',
			}}
		>
			<ButtonGroup variant="outlined">
				<Button onClick={() => setIsPaused(true)} startIcon={<PauseIcon/>}>
					Pause
				</Button>
				<Button onClick={onHintMessage} startIcon={<QuestionMarkIcon />}>
					Hint
				</Button>
				<Button disabled={!canShuffle} onClick={onReshuffle} startIcon={<ShuffleIcon />}>
					Shuffle
				</Button>
			</ButtonGroup>
		</Box>
	);
}

