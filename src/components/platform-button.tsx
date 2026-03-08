import { useActiveController } from '@/atoms';
import { InputAction, ControllerType } from '@/input/input-types';
import { ButtonGlyphMap, keyboardGlyphStyle } from '@/components/button-prompts/button-glyph-map';
import { Button } from '@mui/material';

interface Props {
	label: string;
	action: InputAction;
	onClick: () => void;
	disabled?: boolean;
}

export default
function PlatformButton({ label, action, onClick, disabled = false }: Props) {
	const activeController = useActiveController();

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
					style={activeController === ControllerType.KEYBOARD ? keyboardGlyphStyle : undefined}
				/>
			}
			disabled={disabled}
		>
			{label}
		</Button>
	);
}
