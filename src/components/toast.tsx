import { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { clearCurrentToastMsgAtom, toastMsgAtom } from '@/atoms';
import { useAtomValue, useSetAtom } from 'jotai';

export default
function Toast() {
	const toastMsg = useAtomValue(toastMsgAtom);
	const clearMsg = useSetAtom(clearCurrentToastMsgAtom);
	const [isOpen, setOpen] = useState(false);
	const {
		delay = 3000,
		message = '',
		onClose = () => {},
	} = toastMsg || {};

	useEffect(() => {
		setOpen(!!toastMsg);
	}, [toastMsg]);

	function handleClose() {
		setOpen(false);
		onClose();
	}

	return (
		<Snackbar
			open={isOpen}
			autoHideDuration={delay}
			onClose={handleClose}
			TransitionProps={{ onExited: clearMsg }}
			message={message}
			action={
				<IconButton
					size="small"
					color="inherit"
					onClick={handleClose}
				>
					<CloseIcon fontSize="small" />
				</IconButton>
			}
		/>
	);
}
