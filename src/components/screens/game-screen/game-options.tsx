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

interface ButtonConfig {
	id: string;
	label: string;
	mouseIcon: ReactNode;
	platformAction: InputAction;
	onClick: () => void;
	disabled?: boolean;
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

// Fixed bottom-left container for platform controls
function FixedBottomLeftContainer({ children }: { children: ReactNode }) {
	return (
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
					{children}
				</Box>
			</Box>
		</Box>
	);
}

export default
function GameOptions(props: Props) {
	const setIsPaused = useSetIsPaused();
	const activeController = useActiveController();
	const { canShuffle, onReshuffle, onHintMessage } = props;

	const buttonConfigs: ButtonConfig[] = [
		{
			id: 'pause',
			label: 'Pause',
			mouseIcon: <PauseIcon />,
			platformAction: InputAction.PAUSE,
			onClick: () => setIsPaused(true),
			disabled: false,
		},
		{
			id: 'hint',
			label: 'Hint',
			mouseIcon: <QuestionMarkIcon />,
			platformAction: InputAction.HINT,
			onClick: onHintMessage,
			disabled: false,
		},
		{
			id: 'shuffle',
			label: 'Shuffle',
			mouseIcon: <ShuffleIcon />,
			platformAction: InputAction.SHUFFLE,
			onClick: onReshuffle,
			disabled: !canShuffle,
		},
	];

	return (
		<>
			{activeController && (
				<FixedBottomLeftContainer>
					<Stack direction="row" spacing={1}>
						{buttonConfigs.map(config => (
							<PlatformButton
								key={config.id}
								label={config.label}
								action={config.platformAction}
								onClick={config.onClick}
								disabled={config.disabled}
							/>
						))}
					</Stack>
				</FixedBottomLeftContainer>
			)}
			{!activeController && (
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
						{buttonConfigs.map(config => (
							<MouseButton
								key={config.id}
								label={config.label}
								icon={config.mouseIcon}
								onClick={config.onClick}
								disabled={config.disabled}
							/>
						))}
					</Stack>
				</Box>
			)}
		</>
	);
}
