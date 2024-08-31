import PlayingCard from '@/components/playing-card';
import { Card } from '@/types';
import { useInterval } from '@/utils';
import { Grid, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebouncedValue } from '@/hooks';

interface Props {
	shuffleCount: number;
	cards: Card[];
	selectedCards: string[];
	paused?: boolean;
	onSelected(card: Card): void;
}

export default
function GameCardArea(props: Props) {
	const {
		shuffleCount: rawShffleCount,
		cards: unDebouncedRawCards,
		paused,
		selectedCards,
		onSelected,
	} = props;
	const rawCards = useDebouncedValue(unDebouncedRawCards, 100);
	const [shuffleCount, setShuffleCount] = useState(rawShffleCount);
	const [cards, setCards] = useState<Card[]>([]);
	const [newCards, setNewCards] = useState<Card[]>([]);

	useEffect(() => {
		console.log(111);
		setCards(rawCards);

		const insertedCards = rawCards.filter(rawCard => !cards.find(card => card.id === rawCard.id));

		setNewCards(
			// TODO Figure out a more solid way of doing this.
			insertedCards.length > 3 ?
				rawCards :
				insertedCards,
		);

		setShuffleCount(rawShffleCount);
	}, [JSON.stringify(rawCards)]);

	useInterval(() => {
		setNewCards(newCards.slice(1));
	}, newCards.length ? 150 : null);

	return (
		<Grid
			container
			rowSpacing={1}
			columns={{
				xs: 3,
				sm: 6,
			}}
		>
			<AnimatePresence mode="popLayout">
				{cards.map(card => (
					<Grid
						key={`${shuffleCount}-${card.id}`}
						component={motion.div}
						item
						xs={1}
						display="flex"
						justifyContent="center"
						initial={{
							x: '100vw',
							y: '-50vh',
							zIndex: 1000,
						}}
						animate={{
							x: 1,
							y: 1,
							transition: {
								// duration: 55,
								delay: newCards.findIndex(nc => nc.id === card.id) * .15,
							},
							transitionEnd: {
								zIndex: 1,
							},
						}}
						exit={{
							x: '-100vw',
							y: '-50vh',
							zIndex: 1000,
							transition: {
								duration: .5,
							},
						}}
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
			</AnimatePresence>
		</Grid>
	);
}
