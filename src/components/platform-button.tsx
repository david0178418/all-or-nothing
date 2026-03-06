import { useActiveController } from '@/atoms';
import { InputAction, ControllerType } from '@/input/input-types';
import { ButtonGlyphMap } from '@/components/button-prompts/button-glyph-map';
import { Button } from '@mui/material';

const keyboardGlyphStyle = { filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.6)) drop-shadow(0 0 0.5px rgba(0,0,0,0.4))' } as const;

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
