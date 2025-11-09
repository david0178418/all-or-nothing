import InfoIcon from "@mui/icons-material/InfoOutlined";
import { useState, useRef } from "react";
import HelpContent from "./help-contnet";
import { useFocusable } from "@/focus/useFocusable";
import FocusIndicator from "./focus-indicator";
import { useTimeout } from "@/utils";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	useMediaQuery,
	useTheme,
	Box,
} from "@mui/material";

export default
function HelpDialogTrigger({
	id,
	order,
	autoFocus,
}: {
	id: string;
	order: number;
	autoFocus?: boolean;
}) {
	const [open, setOpen] = useState(false);
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const { ref, isFocused } = useFocusable({
		id,
		group: 'pause-dialog',
		order,
		autoFocus,
		onSelect: () => setOpen(true),
	});

	return (
		<>
			<Box sx={{ position: 'relative' }} ref={ref}>
				<FocusIndicator visible={isFocused} />
				<Button
					variant="outlined"
					startIcon={<InfoIcon />}
					onClick={() => setOpen(true)}
					fullWidth
				>
					How to Play
				</Button>
			</Box>
			<Dialog
				fullScreen={fullScreen}
				open={open}
				onClose={() => setOpen(false)}
			>
				<DialogTitle id="responsive-dialog-title">
					How to Play
				</DialogTitle>
				<DialogContent>
					<HelpContent />
				</DialogContent>
				<DialogActions>
					<Button
						variant="contained"
						onClick={() => setOpen(false)}
					>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
