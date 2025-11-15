import { Box, Grid, Typography } from '@mui/material';
import PlayingCard from './playing-card';
import { Colors, Counts, Fills, Shapes } from '@/types';
import { Check, Clear } from '@mui/icons-material';

export default
function HelpContent() {
	return (
		<>
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
			<Grid container columns={3} sx={{ marginX: 0 }} spacing={0}>
				<Grid
					size={3}
					container
					color="green"
					textAlign="center"
					columns={2}
				>
					<Grid size={3}>
						<Typography>
						<Check />  MATCH!
						</Typography>
					</Grid>
					<Grid size={1}>
						<Typography>
							<Check /> Color - All Red
						</Typography>
					</Grid>
					<Grid size={1}>
						<Typography>
							<Check /> Count - All Three
						</Typography>
					</Grid>
					<Grid size={1}>
						<Typography>
						<Check /> Fill - All Solid
						</Typography>
					</Grid>
					<Grid size={1}>
						<Typography>
							<Check /> Shapes - All Different
						</Typography>
					</Grid>
				</Grid>
				<Grid
					container
					size={3}
					rowSpacing={0}
					spacing={10}
					paddingTop={2}
					justifyContent="center"
					rowGap={3}
					columns={{
						xs: 2,
						md: 3,
					}}
				>
					<Grid>
						<PlayingCard
							width={150}
							card={{
								id: 'example-1-1',
								color: Colors.Red,
								count: Counts.Three,
								fill: Fills.Solid,
								shape: Shapes.Circle,
							}}
						/>
					</Grid>
					<Grid>
						<PlayingCard
							width={150}
							card={{
								id: 'example-1-2',
								color: Colors.Red,
								count: Counts.Three,
								fill: Fills.Solid,
								shape: Shapes.Square,
							}}
						/>
					</Grid>
					<Grid>
						<PlayingCard
							width={150}
							card={{
								id: 'example-1-3',
								color: Colors.Red,
								count: Counts.Three,
								fill: Fills.Solid,
								shape: Shapes.Triangle,
							}}
						/>
					</Grid>
				</Grid>
				<Grid
					marginTop={3}
					paddingTop={3}
					borderTop="1px solid black"
					size={3}
					color="green"
					container
					columns={2}
					textAlign="center"
				>
					<Grid size={3}>
						<Typography>
						<Check />  MATCH!
						</Typography>
					</Grid>
					<Grid size={1}>
						<Typography>
							<Check /> Color - All Different
						</Typography>
					</Grid>
					<Grid size={1}>
						<Typography>
							<Check /> Count - All Different
						</Typography>
					</Grid>
					<Grid size={1}>
						<Typography>
						<Check /> Fill - All Different
						</Typography>
					</Grid>
					<Grid size={1}>
						<Typography>
							<Check /> Shapes - All Circles
						</Typography>
					</Grid>
				</Grid>
				<Grid
					container
					size={3}
					rowSpacing={0}
					spacing={10}
					paddingTop={2}
					justifyContent="center"
					rowGap={3}
					columns={{
						xs: 2,
						md: 3,
					}}
				>
					<Grid>
						<PlayingCard
							width={150}
							card={{
								id: 'example-2-1',
								color: Colors.Red,
								count: Counts.One,
								fill: Fills.Outline,
								shape: Shapes.Circle,
							}}
						/>
					</Grid>
					<Grid>
						<PlayingCard
							width={150}
							card={{
								id: 'example-2-2',
								color: Colors.Green,
								count: Counts.Two,
								fill: Fills.Filled,
								shape: Shapes.Circle,
							}}
						/>
					</Grid>
					<Grid>
						<PlayingCard
							width={150}
							card={{
								id: 'example-2-3',
								color: Colors.Blue,
								count: Counts.Three,
								fill: Fills.Solid,
								shape: Shapes.Circle,
							}}
						/>
					</Grid>
				</Grid>
				<Grid
					marginTop={3}
					paddingTop={3}
					borderTop="1px solid black"
					size={3}
					color="green"
					container
					columns={2}
					textAlign="center"
				>
					<Grid size={3} color="red">
						<Typography>
						<Clear />  NOT A MATCH!
						</Typography>
					</Grid>
					<Grid size={1}>
						<Typography>
							<Check /> Color - All Different
						</Typography>
					</Grid>
					<Grid size={1}>
						<Typography>
							<Check /> Count - All Different
						</Typography>
					</Grid>
					<Grid size={1} color="red">
						<Typography>
							<Clear /> Fill - Two Solid, One Outline
						</Typography>
					</Grid>
					<Grid size={1}>
						<Typography>
							<Check /> Shapes - All Trangles
						</Typography>
					</Grid>
				</Grid>
				<Grid
					container
					size={3}
					rowSpacing={0}
					spacing={10}
					paddingTop={2}
					justifyContent="center"
					rowGap={3}
					columns={{
						xs: 2,
						md: 3,
					}}
				>
					<Grid>
						<PlayingCard
							width={150}
							card={{
								id: 'example-3-1',
								color: Colors.Green,
								count: Counts.One,
								fill: Fills.Outline,
								shape: Shapes.Triangle,
							}}
						/>
					</Grid>
					<Grid>
						<PlayingCard
							width={150}
							card={{
								id: 'example-3-2',
								color: Colors.Blue,
								count: Counts.Two,
								fill: Fills.Solid,
								shape: Shapes.Triangle,
							}}
						/>
					</Grid>
					<Grid>
						<PlayingCard
							width={150}
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
			</Grid>
		</>
	);
}
