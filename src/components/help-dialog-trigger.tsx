import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { useState } from "react";
import PlayingCard from "./playing-card";
import { Colors, Counts, Fills, Shapes } from "src/types";
import { Check, Clear } from "@mui/icons-material";
import { Unstable_Grid2 as Grid,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Fab,
	Typography,
	useMediaQuery,
	useTheme,
	Box,
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
				<QuestionMarkIcon />
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
					<DialogContentText>
						<Typography>
							The object of the game is to identify a set of 3 cards from the 12 cards dealt.
							Each card has a variation of the following four features:
						</Typography>
						<Box marginLeft={2} marginY={2}>
							<Typography>
								<strong>Color:</strong> Red, Green, or Purple.
							</Typography>
							<Typography>
								<strong>Symbol:</strong> Circles, Squares, or Triangles.
							</Typography>
							<Typography>
								<strong>Count:</strong> One, Two, or Three Shapes
							</Typography>
							<Typography>
								<strong>Shading:</strong> Solid, Clear, or Shaded
							</Typography>
						</Box>
						<Typography>
							A "set" consists of three cards in which each feature is <strong>EITHER</strong> the
							same on each card <strong>OR</strong> is different on each card.
						</Typography>
					</DialogContentText>
					<Grid container columns={3} sx={{ marginX: 3 }} spacing={1}>
						<Grid
							xs={3}
							color="green"
							container
							textAlign="center"
							columns={2}
						>
							<Grid xs={3}>
								<Typography>
								<Check />  MATCH!
								</Typography>
							</Grid>
							<Grid xs={1}>
								<Typography>
									<Check /> Color - All Red
								</Typography>
							</Grid>
							<Grid xs={1}>
								<Typography>
									<Check /> Count - All Three
								</Typography>
							</Grid>
							<Grid xs={1}>
								<Typography>
								<Check /> Fill - All Solid
								</Typography>
							</Grid>
							<Grid xs={1}>
								<Typography>
									<Check /> Shapes - All Different
								</Typography>
							</Grid>
						</Grid>
						<Grid xs={1} display="flex" justifyContent="center">
							<PlayingCard
								card={{
									id: 'example-1-1',
									color: Colors.Red,
									count: Counts.Three,
									fill: Fills.Solid,
									shape: Shapes.Circle,
								}}
							/>
						</Grid>
						<Grid xs={1} display="flex" justifyContent="center">
							<PlayingCard
								card={{
									id: 'example-1-2',
									color: Colors.Red,
									count: Counts.Three,
									fill: Fills.Solid,
									shape: Shapes.Square,
								}}
							/>
						</Grid>
						<Grid xs={1} display="flex" justifyContent="center">
							<PlayingCard
								card={{
									id: 'example-1-3',
									color: Colors.Red,
									count: Counts.Three,
									fill: Fills.Solid,
									shape: Shapes.Triangle,
								}}
							/>
						</Grid>
						<Grid
							marginTop={3}
							paddingTop={3}
							borderTop="1px solid black"
							xs={3}
							color="green"
							container
							columns={2}
							textAlign="center"
						>
							<Grid xs={3}>
								<Typography>
								<Check />  MATCH!
								</Typography>
							</Grid>
							<Grid xs={1}>
								<Typography>
									<Check /> Color - All Different
								</Typography>
							</Grid>
							<Grid xs={1}>
								<Typography>
									<Check /> Count - All Different
								</Typography>
							</Grid>
							<Grid xs={1}>
								<Typography>
								<Check /> Fill - All Different
								</Typography>
							</Grid>
							<Grid xs={1}>
								<Typography>
									<Check /> Shapes - All Circles
								</Typography>
							</Grid>
						</Grid>
						<Grid xs={1} display="flex" justifyContent="center">
							<PlayingCard
								card={{
									id: 'example-2-1',
									color: Colors.Red,
									count: Counts.One,
									fill: Fills.Outline,
									shape: Shapes.Circle,
								}}
							/>
						</Grid>
						<Grid xs={1} display="flex" justifyContent="center">
							<PlayingCard
								card={{
									id: 'example-2-2',
									color: Colors.Green,
									count: Counts.Two,
									fill: Fills.Filled,
									shape: Shapes.Circle,
								}}
							/>
						</Grid>
						<Grid xs={1} display="flex" justifyContent="center">
							<PlayingCard
								card={{
									id: 'example-2-3',
									color: Colors.Blue,
									count: Counts.Three,
									fill: Fills.Solid,
									shape: Shapes.Circle,
								}}
							/>
						</Grid>
						<Grid
							marginTop={3}
							paddingTop={3}
							borderTop="1px solid black"
							xs={3}
							color="green"
							container
							columns={2}
							textAlign="center"
						>
							<Grid xs={3} color="red">
								<Typography>
								<Clear />  NOT A MATCH!
								</Typography>
							</Grid>
							<Grid xs={1}>
								<Typography>
									<Check /> Color - All Different
								</Typography>
							</Grid>
							<Grid xs={1}>
								<Typography>
									<Check /> Count - All Different
								</Typography>
							</Grid>
							<Grid xs={1} color="red">
								<Typography>
									<Clear /> Fill - Two Solid, One Outline
								</Typography>
							</Grid>
							<Grid xs={1}>
								<Typography>
									<Check /> Shapes - All Trangles
								</Typography>
							</Grid>
						</Grid>
						<Grid xs={1} display="flex" justifyContent="center">
							<PlayingCard
								card={{
									id: 'example-3-1',
									color: Colors.Green,
									count: Counts.One,
									fill: Fills.Outline,
									shape: Shapes.Triangle,
								}}
							/>
						</Grid>
						<Grid xs={1} display="flex" justifyContent="center">
							<PlayingCard
								card={{
									id: 'example-3-2',
									color: Colors.Blue,
									count: Counts.Two,
									fill: Fills.Solid,
									shape: Shapes.Triangle,
								}}
							/>
						</Grid>
						<Grid xs={1} display="flex" justifyContent="center">
							<PlayingCard
								card={{
									id: 'example-3-3',
									color: Colors.Red,
									count: Counts.Three,
									fill: Fills.Solid,
									shape: Shapes.Triangle,
								}}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}
