import PlayingCard from '@/components/playing-card';
import { Card } from '@/types';
import { useInterval } from '@/utils';
import { Grid, Box } from '@mui/material';
import { useEffect, useState } from 'react';

interface Props {
	cards: Card[];
	selectedCards: string[];
	paused?: boolean;
	onSelected(card: Card): void;
}

export default
function GameCardArea(props: Props) {
	const {
		cards: rawCards,
		paused,
		selectedCards,
		onSelected,
	} = props;
	const [cards, setCards] = useState<Card[]>([]);
	const [newCards, setNewCards] = useState<Card[]>([]);

	useEffect(() => {
		const insertedCards = rawCards.filter(rawCard => !cards.find(card => card.id === rawCard.id));

		setNewCards(
			// TODO Figure out a more solid way of doing this.
			insertedCards.length > 3 ?
				rawCards :
				insertedCards,
		);
		setCards(rawCards);
	}, [rawCards]);

	useInterval(() => {
		setNewCards(newCards.slice(1));
	}, newCards.length ? 100 : null);

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
								flipped={paused || !!newCards.find(newCard => newCard.id === card.id)}
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
