import InfoIcon from "@mui/icons-material/InfoOutlined";
import { useState } from "react";
import HelpContent from "./help-contnet";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Fab,
	useMediaQuery,
	useTheme,
} from "@mui/material";

export default
function HelpDialogTrigger() {
	const [open, setOpen] = useState(false);
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<>
			<Fab
				color="primary"
				size="small"
				sx={{
					position: 'fixed',
					bottom: 16,
					right: 16,
				}}
				onClick={() => setOpen(true)}
			>
				<InfoIcon />
			</Fab>
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
