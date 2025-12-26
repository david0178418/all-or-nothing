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

interface MouseButtonProps {
	label: string;
	icon: ReactNode;
	onClick: () => void;
	disabled?: boolean;
}

interface PlatformButtonProps {
	label: string;
	action: InputAction;
	onClick: () => void;
	disabled?: boolean;
}

// Mouse control button: outlined variant with icon only
function MouseButton(props: MouseButtonProps) {
	const { label, icon, onClick, disabled = false } = props;

	return (
		<Button
			size="large"
			variant="outlined"
			onClick={onClick}
			startIcon={icon}
			disabled={disabled}
		>
			{label}
		</Button>
	);
}

// Platform control button: text variant with glyph
function PlatformButton(props: PlatformButtonProps) {
	const activeController = useActiveController();
	const { label, action, onClick, disabled = false } = props;

	if (!activeController) {
		return null;
	}

	const GlyphComponent = ButtonGlyphMap[activeController]?.[action];

	if (!GlyphComponent) {
		return null;
	}

	return (
		<Button
			size="large"
			variant="text"
			onClick={onClick}
			startIcon={
				<GlyphComponent
					width={40}
					height={40}
					viewBox="0 0 64 64"
					display="block"
				/>
			}
			disabled={disabled}
		>
			{label}
		</Button>
	);
}

export default
function GameOptions(props: Props) {
	const setIsPaused = useSetIsPaused();
	const activeController = useActiveController();
	const { canShuffle, onReshuffle, onHintMessage } = props;

	const pauseAction = () => setIsPaused(true);

	// Mouse controls: centered below play area
	const mouseControls = !activeController ? (
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
				<MouseButton
					label="Pause"
					icon={<PauseIcon />}
					onClick={pauseAction}
				/>
				<MouseButton
					label="Hint"
					icon={<QuestionMarkIcon />}
					onClick={onHintMessage}
				/>
				<MouseButton
					label="Shuffle"
					icon={<ShuffleIcon />}
					onClick={onReshuffle}
					disabled={!canShuffle}
				/>
			</Stack>
		</Box>
	) : null;

	// Platform controls: bottom of screen, aligned with container
	const platformControls = activeController ? (
		<Box
			sx={{
				position: 'fixed',
				bottom: 0,
				left: 0,
				right: 0,
				pointerEvents: 'none',
				display: {
					xs: 'none',
					sm: 'block',
				},
			}}
		>
			<Box
				sx={{
					maxWidth: 'xl',
					margin: '0 auto',
					position: 'relative',
					height: 0,
				}}
			>
				<Box
					sx={{
						position: 'absolute',
						bottom: 16,
						left: 16,
						pointerEvents: 'auto',
					}}
				>
					<Stack direction="row" spacing={1}>
						<PlatformButton
							label="Pause"
							action={InputAction.PAUSE}
							onClick={pauseAction}
						/>
						<PlatformButton
							label="Hint"
							action={InputAction.HINT}
							onClick={onHintMessage}
						/>
						<PlatformButton
							label="Shuffle"
							action={InputAction.SHUFFLE}
							onClick={onReshuffle}
							disabled={!canShuffle}
						/>
					</Stack>
				</Box>
			</Box>
		</Box>
	) : null;

	return (
		<>
			{mouseControls}
			{platformControls}
		</>
	);
}
