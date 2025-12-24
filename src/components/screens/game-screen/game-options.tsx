import { useSetIsPaused, useActiveController } from '@/atoms';
import { InputAction } from '@/input/input-types';
import { ButtonGlyphMap } from '@/components/button-prompts/button-glyph-map';
import { ReactNode } from 'react';
import {
	Pause as PauseIcon,
	QuestionMark as QuestionMarkIcon,
	Shuffle as ShuffleIcon,
} from '@mui/icons-material';
import {
	Box,
	Button,
	Stack,
} from '@mui/material';

interface Props {
	canShuffle?: boolean;
	onReshuffle(): void;
	onHintMessage(): void;
}

interface ButtonWithGlyphProps {
	label: string;
	action: InputAction;
	icon: ReactNode;
	onClick: () => void;
	disabled?: boolean;
}

function ButtonWithGlyph(props: ButtonWithGlyphProps) {
	const activeController = useActiveController();
	const { label, action, icon, onClick, disabled = false } = props;

	const glyphUrl = activeController
		? ButtonGlyphMap[activeController]?.[action]
		: null;

	return (
		<Stack direction="row" spacing={0.5} alignItems="center">
			<Button
				onClick={onClick}
				startIcon={icon}
				disabled={disabled}
			>
				{label}
			</Button>
			{glyphUrl && (
				<Box
					component="img"
					src={glyphUrl}
					alt=""
					sx={{
						width: 20,
						height: 20,
					}}
				/>
			)}
		</Stack>
	);
}

export default
function GameOptions(props: Props) {
	const setIsPaused = useSetIsPaused();
	const { canShuffle, onReshuffle, onHintMessage } = props;

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
			<Stack direction="row" spacing={1} justifyContent="center">
				<ButtonWithGlyph
					label="Pause"
					action={InputAction.PAUSE}
					icon={<PauseIcon />}
					onClick={() => setIsPaused(true)}
				/>
				<ButtonWithGlyph
					label="Hint"
					action={InputAction.HINT}
					icon={<QuestionMarkIcon />}
					onClick={onHintMessage}
				/>
				<ButtonWithGlyph
					label="Shuffle"
					action={InputAction.SHUFFLE}
					icon={<ShuffleIcon />}
					onClick={onReshuffle}
					disabled={!canShuffle}
				/>
			</Stack>
		</Box>
	);
}

