import { Box, Typography, Stack } from '@mui/material';
import { ControllerType, InputAction } from '@/input/input-types';
import { ControllerButtonLabels } from '@/input/controller-mappings';

interface ButtonPromptProps {
	action: InputAction;
	controllerType: ControllerType;
	label: string;
}

/**
 * Display a single button prompt (e.g., "A - Select")
 */
export function ButtonPrompt({ action, controllerType, label }: ButtonPromptProps) {
	const buttonLabel = ControllerButtonLabels[controllerType][action];

	if (!buttonLabel) return null;

	return (
		<Stack direction="row" spacing={0.5} alignItems="center">
			<Box
				sx={{
					bgcolor: 'rgba(0, 0, 0, 0.7)',
					color: 'white',
					px: 1,
					py: 0.5,
					borderRadius: 1,
					fontSize: '0.75rem',
					fontWeight: 'bold',
					minWidth: '28px',
					textAlign: 'center',
					border: '1px solid rgba(255, 255, 255, 0.3)',
				}}
			>
				{buttonLabel}
			</Box>
			<Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
				{label}
			</Typography>
		</Stack>
	);
}

interface ButtonPromptsBarProps {
	controllerType: ControllerType;
	prompts: Array<{ action: InputAction; label: string }>;
}

/**
 * Display a bar of button prompts for current context
 */
export function ButtonPromptsBar({ controllerType, prompts }: ButtonPromptsBarProps) {
	if (controllerType === ControllerType.GENERIC) return null;

	return (
		<Box
			sx={{
				display: 'flex',
				gap: 2,
				flexWrap: 'wrap',
				p: 1,
				bgcolor: 'rgba(255, 255, 255, 0.9)',
				borderRadius: 1,
			}}
		>
			{prompts.map((prompt, index) => (
				<ButtonPrompt
					key={index}
					action={prompt.action}
					controllerType={controllerType}
					label={prompt.label}
				/>
			))}
		</Box>
	);
}
