import { ReactNode } from 'react';
import { Box, Button } from '@mui/material';
import { useFocusable } from '@/focus/useFocusable';
import { useActivationGuard } from '@/hooks';
import FocusIndicator from './focus-indicator';

interface Props {
	id: string;
	group: string;
	order: number;
	onClick: () => void;
	disabled?: boolean;
	startIcon?: ReactNode;
	children: ReactNode;
	autoFocus?: boolean;
}

export default
function FocusableButton({
	id,
	group,
	order,
	onClick,
	disabled,
	startIcon,
	children,
	autoFocus,
}: Props) {
	const handleActivation = useActivationGuard(onClick);

	const { ref, isFocused } = useFocusable({
		id,
		group,
		order,
		onSelect: handleActivation,
		disabled,
		autoFocus,
	});

	return (
		<Box sx={{ position: 'relative' }} ref={ref}>
			<FocusIndicator visible={isFocused} />
			<Button
				disabled={disabled}
				startIcon={startIcon}
				onClick={handleActivation}
				fullWidth
			>
				{children}
			</Button>
		</Box>
	);
}
