import { Box, Typography } from '@mui/material';
import { ControllerType, InputAction } from '@/input/input-types';
import { ButtonGlyphMap, keyboardGlyphStyle } from '@/components/button-prompts/button-glyph-map';

interface MultiplayerButtonPromptsProps {
	controllerTypes: readonly ControllerType[];
}

const DISPLAYED_ACTIONS = [
	{ action: InputAction.SELECT, label: 'Select' },
	{ action: InputAction.SHUFFLE, label: 'No Sets' },
	{ action: InputAction.PAUSE, label: 'Pause' },
] as const;

export default function MultiplayerButtonPrompts({ controllerTypes }: MultiplayerButtonPromptsProps) {
	const uniqueTypes = [...new Set(controllerTypes)];

	return (
		<Box display="flex" justifyContent="center" gap={3} paddingY={1}>
			{DISPLAYED_ACTIONS.map(({ action, label }) => (
				<Box key={action} display="flex" alignItems="center" gap={0.5}>
					<Typography variant="body2" color="text.secondary">
						{label}:
					</Typography>
					{uniqueTypes.map(type => {
						const GlyphComponent = ButtonGlyphMap[type]?.[action];
						if (!GlyphComponent) return null;
						return (
							<GlyphComponent
								key={type}
								width={40}
								height={40}
								viewBox="0 0 64 64"
								style={type === ControllerType.KEYBOARD ? keyboardGlyphStyle : undefined}
							/>
						);
					})}
				</Box>
			))}
		</Box>
	);
}
