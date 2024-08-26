import PlayingCard from '@/components/playing-card';
import { Card } from '@/types';
import { Grid, Box } from '@mui/material';

interface Props {
	cards: Card[];
	selectedCards: string[];
	paused?: boolean;
	onSelected(card: Card): void;
}

export default
function GameCardArea(props: Props) {
	const {
		cards,
		paused,
		selectedCards,
		onSelected,
	} = props;

	return (
		<Grid
			container
			rowSpacing={1}
			columns={{
				xs: 3,
				sm: 6,
			}}
		>
			{cards.map(card => (
				<Grid
					item
					xs={1}
					key={card.id}
					display="flex"
					justifyContent="center"
				>
					<Box maxWidth="80%">
						{card && (
							<PlayingCard
								card={card}
								flipped={paused}
								selected={!!card.id && selectedCards.includes(card.id)}
								onClick={() => onSelected(card)}
							/>
						)}
					</Box>
				</Grid>
			))}
		</Grid>
	);
}
