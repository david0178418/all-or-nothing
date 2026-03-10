import { useSetIsPaused, useActiveController } from '@/atoms';
import { InputAction } from '@/input/input-types';
import PlatformButton from '@/components/platform-button';
import FixedBottomLeftContainer from '@/components/fixed-bottom-left-container';
import { ReactNode } from 'react';
import {
	Pause as PauseIcon,
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

export default
function GameOptions(props: Props) {
	const setIsPaused = useSetIsPaused();
	const activeController = useActiveController();
	const { canShuffle, onReshuffle } = props;

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
			id: 'shuffle',
			label: 'No sets',
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
