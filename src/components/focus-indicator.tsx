import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useFocusContext } from '@/focus/focus-context';

interface FocusIndicatorProps {
	visible: boolean;
}

/**
 * Visual indicator for focused elements (keyboard/controller navigation)
 */
export default function FocusIndicator({ visible }: FocusIndicatorProps) {
	const { usingNavigationalInput } = useFocusContext();
	const shouldShow = visible && usingNavigationalInput;

	return (
		<AnimatePresence>
			{shouldShow && (
				<Box
					component={motion.div}
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.95 }}
					transition={{ duration: 0.15 }}
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						border: '3px solid',
						borderColor: 'primary.main',
						borderRadius: 1,
						pointerEvents: 'none',
						zIndex: 10,
						boxShadow: '0 0 10px rgba(33, 150, 243, 0.5)',
					}}
				/>
			)}
		</AnimatePresence>
	);
}
