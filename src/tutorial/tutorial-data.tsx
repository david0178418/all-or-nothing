import { Typography, Box, LinearProgress } from '@mui/material';
import {
	Check as CheckIcon,
	Close as CloseIcon,
} from '@mui/icons-material';
import { Card, Colors, Shapes, Fills, Counts } from '@/types';
import type { TutorialStep } from './tutorial-types';

const highlightSx = {
	border: '2px solid',
	borderColor: '#90caf9',
	borderRadius: 1,
	boxShadow: '0 0 8px rgba(144, 202, 249, 0.6)',
	px: 1,
	py: 0.5,
} as const;

const dimSx = {
	opacity: 0.4,
	px: 1,
	py: 0.5,
} as const;

const mockBarSx = {
	backgroundColor: 'rgba(0, 0, 0, 0.3)',
	borderRadius: 1,
	p: 1.5,
	mt: 2,
} as const;

function MockScoreBar({ highlighted, nextValue, penaltyLabel }: {
	highlighted?: boolean;
	nextValue?: string;
	penaltyLabel?: string;
}) {
	return (
		<Box
			sx={{
				...mockBarSx,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}
		>
			<Typography variant="body2" color="text.secondary" sx={dimSx}>0:42</Typography>
			<Box sx={highlighted ? highlightSx : dimSx}>
				<Typography variant="body1" fontWeight="bold">
					Score: 25,000
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Next: {nextValue ?? '8,500'}
				</Typography>
				{penaltyLabel && (
					<Typography variant="caption" color="error.main" fontWeight="bold">
						{penaltyLabel}
					</Typography>
				)}
			</Box>
			<Typography variant="body2" color="text.secondary" sx={dimSx}>54 cards left</Typography>
		</Box>
	);
}

function MockComboDisplay() {
	return (
		<Box sx={mockBarSx}>
			<Box sx={{ ...highlightSx, display: 'flex', alignItems: 'center', gap: 1.5 }}>
				<Typography variant="body2" fontWeight="bold" whiteSpace="nowrap">
					×2 Combo
				</Typography>
				<LinearProgress
					variant="determinate"
					value={65}
					sx={{
						flexGrow: 1,
						height: 6,
						borderRadius: 1,
						backgroundColor: 'rgba(255, 255, 255, 0.1)',
						'& .MuiLinearProgress-bar': {
							backgroundColor: '#4caf50',
						},
					}}
				/>
				<Typography variant="caption" sx={{ minWidth: '28px', textAlign: 'right' }}>
					4.6s
				</Typography>
			</Box>
			<MockScoreBar nextValue="9,500" />
		</Box>
	);
}

export const TUTORIAL_CARDS: readonly Card[] = [
	{ color: Colors.Red, shape: Shapes.Circle, fill: Fills.Solid, count: Counts.One },       // 0
	{ color: Colors.Red, shape: Shapes.Circle, fill: Fills.Outline, count: Counts.Two },     // 1
	{ color: Colors.Red, shape: Shapes.Circle, fill: Fills.Filled, count: Counts.Three },    // 2
	{ color: Colors.Green, shape: Shapes.Triangle, fill: Fills.Solid, count: Counts.One },   // 3
	{ color: Colors.Green, shape: Shapes.Square, fill: Fills.Outline, count: Counts.Two },   // 4
	{ color: Colors.Green, shape: Shapes.Circle, fill: Fills.Filled, count: Counts.Three },  // 5
	{ color: Colors.Blue, shape: Shapes.Square, fill: Fills.Solid, count: Counts.One },      // 6
	{ color: Colors.Blue, shape: Shapes.Triangle, fill: Fills.Outline, count: Counts.Two },  // 7
	{ color: Colors.Blue, shape: Shapes.Circle, fill: Fills.Filled, count: Counts.One },     // 8
	{ color: Colors.Red, shape: Shapes.Square, fill: Fills.Solid, count: Counts.Three },     // 9
	{ color: Colors.Green, shape: Shapes.Triangle, fill: Fills.Filled, count: Counts.Two },  // 10
	{ color: Colors.Blue, shape: Shapes.Square, fill: Fills.Outline, count: Counts.Three },  // 11
] as const;

function AttributeRow({ label, value, valid }: { label: string; value: string; valid: boolean }) {
	return (
		<Box display="flex" alignItems="center" gap={1}>
			{valid
				? <CheckIcon fontSize="small" color="success" />
				: <CloseIcon fontSize="small" color="error" />
			}
			<Typography variant="body2">
				<strong>{label}:</strong> {value}
			</Typography>
		</Box>
	);
}

export const TUTORIAL_STEPS: readonly TutorialStep[] = [
	{
		id: 'welcome',
		tooltipPosition: 'center',
		content: (
			<>
				<Typography variant="h6" gutterBottom>Welcome to All or Nothing!</Typography>
				<Typography variant="body2">
					This quick tutorial will teach you how to find sets.
					It only takes a minute.
				</Typography>
			</>
		),
	},
	{
		id: 'the-board',
		tooltipPosition: 'bottom',
		content: (
			<>
				<Typography variant="h6" gutterBottom>The Board</Typography>
				<Typography variant="body2">
					12 cards are dealt face-up. Your goal is to find groups
					of 3 cards that form a valid "set."
				</Typography>
			</>
		),
	},
	{
		id: 'shape-attribute',
		highlightCards: [0],
		tooltipPosition: 'bottom',
		content: (
			<>
				<Typography variant="h6" gutterBottom>Card Attributes</Typography>
				<Typography variant="body2">
					Every card has 4 attributes: <strong>shape</strong>, <strong>color</strong>,{' '}
					<strong>count</strong>, and <strong>fill</strong>.
				</Typography>
				<Typography variant="body2" sx={{ mt: 1 }}>
					This card is a <strong>red solid circle</strong> with a count of <strong>1</strong>.
				</Typography>
			</>
		),
	},
	{
		id: 'color-attribute',
		highlightCards: [0, 3, 6],
		tooltipPosition: 'bottom',
		content: (
			<>
				<Typography variant="h6" gutterBottom>Color</Typography>
				<Typography variant="body2">
					Cards come in three colors: <strong>red</strong>, <strong>green</strong>,
					and <strong>blue</strong>.
				</Typography>
				<Typography variant="body2" sx={{ mt: 1 }}>
					These three cards each have a different color.
				</Typography>
			</>
		),
	},
	{
		id: 'count-attribute',
		highlightCards: [0, 1, 2],
		tooltipPosition: 'bottom',
		content: (
			<>
				<Typography variant="h6" gutterBottom>Count</Typography>
				<Typography variant="body2">
					Each card shows <strong>1</strong>, <strong>2</strong>, or <strong>3</strong> shapes.
				</Typography>
				<Typography variant="body2" sx={{ mt: 1 }}>
					These cards show 1, 2, and 3 shapes respectively.
				</Typography>
			</>
		),
	},
	{
		id: 'fill-attribute',
		highlightCards: [0, 1, 2],
		tooltipPosition: 'bottom',
		content: (
			<>
				<Typography variant="h6" gutterBottom>Fill</Typography>
				<Typography variant="body2">
					Each shape's fill is either <strong>none</strong>, <strong>shaded</strong>,
					or <strong>solid</strong>.
				</Typography>
				<Typography variant="body2" sx={{ mt: 1 }}>
					These three cards show all three fills.
				</Typography>
			</>
		),
	},
	{
		id: 'the-rule',
		tooltipPosition: 'center',
		content: (
			<>
				<Typography variant="h6" gutterBottom>The Rule</Typography>
				<Typography variant="body2">
					For 3 cards to be a valid set, <strong>each attribute</strong> must
					be either <strong>all the same</strong> or <strong>all different</strong> across
					the 3 cards.
				</Typography>
				<Typography variant="body2" sx={{ mt: 1 }}>
					If any attribute has two of one kind and one of another, it's not a set.
				</Typography>
			</>
		),
	},
	{
		id: 'valid-set-example',
		highlightCards: [0, 1, 2],
		tooltipPosition: 'bottom',
		content: (
			<>
				<Typography variant="h6" gutterBottom>Valid Set</Typography>
				<Typography variant="body2" sx={{ mb: 1 }}>
					These 3 cards form a valid set. Let's check each attribute:
				</Typography>
				<AttributeRow label="Color" value="All red" valid />
				<AttributeRow label="Shape" value="All circles" valid />
				<AttributeRow label="Fill" value="All different (solid, none, shaded)" valid />
				<AttributeRow label="Count" value="All different (1, 2, 3)" valid />
			</>
		),
	},
	{
		id: 'invalid-set-example',
		highlightCards: [0, 3, 7],
		tooltipPosition: 'bottom',
		content: (
			<>
				<Typography variant="h6" gutterBottom>Invalid Set</Typography>
				<Typography variant="body2" sx={{ mb: 1 }}>
					These 3 cards do NOT form a valid set:
				</Typography>
				<AttributeRow label="Color" value="All different (red, green, blue)" valid />
				<AttributeRow label="Shape" value="All different (circle, triangle, triangle)" valid={false} />
				<AttributeRow label="Fill" value="Solid, solid, none" valid={false} />
				<AttributeRow label="Count" value="1, 1, 2" valid={false} />
			</>
		),
	},
	{
		id: 'try-it',
		enableSelection: true,
		tooltipPosition: 'bottom',
		content: (
			<>
				<Typography variant="h6" gutterBottom>Your Turn!</Typography>
				<Typography variant="body2">
					Try to find a valid set. Select 3 cards that follow the rule:
					each attribute must be all the same or all different.
				</Typography>
			</>
		),
	},
	{
		id: 'scoring',
		tooltipPosition: 'center',
		content: (
			<>
				<Typography variant="h6" gutterBottom>Scoring</Typography>
				<Typography variant="body2">
					Each match earns you points. The <strong>"Next"</strong> value
					below your score shows how many points your next match is worth.
				</Typography>
				<Typography variant="body2" sx={{ mt: 1 }}>
					It starts at <strong>10,000</strong> and decreases over time, but
					never drops below <strong>1,000</strong>. Act fast for more points!
				</Typography>
				<MockScoreBar highlighted />
			</>
		),
	},
	{
		id: 'no-sets',
		tooltipPosition: 'center',
		content: (
			<>
				<Typography variant="h6" gutterBottom>No Sets</Typography>
				<Typography variant="body2">
					Sometimes no valid set exists among the dealt cards. When this
					happens, press the <strong>"No sets"</strong> button to shuffle
					the board.
				</Typography>
				<Typography variant="body2" sx={{ mt: 1 }}>
					Correctly identifying that no sets exist counts as finding a
					set — you earn points and it contributes to your combo chain.
				</Typography>
			</>
		),
	},
	{
		id: 'penalties',
		tooltipPosition: 'center',
		content: (
			<>
				<Typography variant="h6" gutterBottom>Penalties</Typography>
				<Typography variant="body2">
					Selecting an invalid set or shuffling when a valid set exists
					each reduce your next match value by <strong>500</strong> points.
				</Typography>
				<MockScoreBar highlighted nextValue="8,000" penaltyLabel="-500" />
			</>
		),
	},
	{
		id: 'combos',
		tooltipPosition: 'center',
		content: (
			<>
				<Typography variant="h6" gutterBottom>Combos</Typography>
				<Typography variant="body2">
					Find another set within <strong>7 seconds</strong> of your last
					match to start a combo. A timer bar shows how much time remains.
				</Typography>
				<Typography variant="body2" sx={{ mt: 1 }}>
					Each combo adds a <strong>bonus</strong> to your next match value.
					Keep chaining sets to build bigger combos and earn even more points!
				</Typography>
				<MockComboDisplay />
			</>
		),
	},
	{
		id: 'complete',
		tooltipPosition: 'center',
		content: (
			<>
				<Typography variant="h6" gutterBottom>You got it!</Typography>
				<Typography variant="body2">
					You're ready to play. Find sets as fast as you can.
					If no sets exist, use the shuffle button. Good luck!
				</Typography>
			</>
		),
	},
] as const;
