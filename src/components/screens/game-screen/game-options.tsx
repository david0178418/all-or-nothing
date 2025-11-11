import { useSetIsPaused, useActiveController } from '@/atoms';
import { InputAction } from '@/input/input-types';
import { ControllerButtonLabels } from '@/input/controller-mappings';
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

interface ButtonWithBadgeProps {
	label: string;
	action: InputAction;
	icon: ReactNode;
	onClick: () => void;
	disabled?: boolean;
}

function ButtonWithBadge(props: ButtonWithBadgeProps) {
	const activeController = useActiveController();
	const { label, action, icon, onClick, disabled = false } = props;

	const buttonLabel = activeController
		? ControllerButtonLabels[activeController]?.[action]
		: null;

	return (
		<Stack direction="row" spacing={0.5} alignItems="center">
			<Button
				onClick={onClick}
				startIcon={icon}
				disabled={disabled}
			>
				{label}{buttonLabel ? ` [${buttonLabel}]` : '' }
			</Button>
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
				<ButtonWithBadge
					label="Pause"
					action={InputAction.PAUSE}
					icon={<PauseIcon />}
					onClick={() => setIsPaused(true)}
				/>
				<ButtonWithBadge
					label="Hint"
					action={InputAction.HINT}
					icon={<QuestionMarkIcon />}
					onClick={onHintMessage}
				/>
				<ButtonWithBadge
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

