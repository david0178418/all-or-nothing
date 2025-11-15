import InfoIcon from "@mui/icons-material/InfoOutlined";
import { useState, useRef } from "react";
import HelpContent from "./help-content";
import { useFocusable } from "@/focus/useFocusable";
import FocusIndicator from "./focus-indicator";
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
import { useActiveController } from "@/atoms";
import { useScrollable } from "@/focus/useScrollable";
import { useBackAction } from "@/input/useBackAction";
import { InputAction } from "@/input/input-types";
import { ButtonPromptsBar } from "@/components/button-prompts";

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
	const activeController = useActiveController();
	const contentRef = useRef<HTMLDivElement>(null);
	const { ref, isFocused } = useFocusable({
		id,
		group: 'pause-dialog',
		order,
		autoFocus,
		onSelect: () => setOpen(true),
	});

	useScrollable({ ref: contentRef });
	useBackAction(() => {
		if (open) {
			setOpen(false);
		}
	});

	return (
		<>
			<Box sx={{ position: 'relative' }} ref={ref}>
				<FocusIndicator visible={isFocused} />
				<Button
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
				<DialogContent ref={contentRef}>
					<HelpContent />
				</DialogContent>
				<DialogActions>
					{activeController && (
						<ButtonPromptsBar
							controllerType={activeController}
							prompts={[
								{ action: InputAction.BACK, label: 'Close' },
							]}
						/>
					)}
					{!activeController && (
						<Button onClick={() => setOpen(false)}>
							Close
						</Button>
					)}
				</DialogActions>
			</Dialog>
		</>
	);
}
