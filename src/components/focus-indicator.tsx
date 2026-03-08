import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useUsingNavigationalInput } from '@/atoms';

interface FocusIndicatorProps {
	visible: boolean;
	colors?: readonly string[];
}

export default function FocusIndicator({ visible, colors }: FocusIndicatorProps) {
	const usingNavigationalInput = useUsingNavigationalInput();
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
						borderColor: colors?.length ? colors[0] : 'primary.main',
						borderRadius: 1,
						pointerEvents: 'none',
						zIndex: 10,
						boxShadow: colors?.length
							? `0 0 10px ${colors[0]}80`
							: '0 0 10px rgba(33, 150, 243, 0.5)',
						...(colors && colors.length > 1 ? {
							borderImage: `linear-gradient(135deg, ${colors.join(', ')}) 1`,
						} : {}),
					}}
				/>
			)}
		</AnimatePresence>
	);
}
