import Card from "./card";

export
const GLOBAL = {
	selected: [],
	cardAttributes: {
		fill: {
			clear: 1,
			shaded: 2,
			solid: 4,
		},
		color: {
			red: 1,
			green: 2,
			purple: 4,
		},
		shape: {
			triangle: 1,
			squiggle: 2,
			oval: 4,
		},
		count:{
			one: 1,
			two: 2,
			three: 4,
		},
		width: 54,
		height: 80,
	},
};

export default
function Game() {
	var deck,
		inPlay,
		selected	= GLOBAL.selected,
		boardLimit	= 12,
		setsMade,
		msgTimeout,
		canScore;

	function start() {
		deck = [];
		inPlay = [];
		selected.length = 0;
		setsMade = 0;

		document.querySelector('#board')?.replaceChildren();
		document.querySelector('#board')?.addEventListener('click', selectionCheck);
		document.querySelector('#reshuffle')?.addEventListener('click', reshuffle);
		document.querySelector('#hint')?.addEventListener('click', hintMessage);
		document.querySelector('#new_game')?.addEventListener('click', restart);
		document.querySelector('#message')?.replaceChildren();
		document.querySelector('#message')?.setAttribute('hidden', 'true');

		createDeck();
		shuffle();
		shuffle();
		shuffle();
		fillBoard();
		updateStatus();
	}

	function restart() {
		displayMessage('New game!');
		start();
	}

	function createDeck() {
		var cardCount = 1;

		for(var f = 1; f <=4; f += f) {
			for(var col = 1; col <=4; col += col) {
				for(var s = 1; s <=4; s += s) {
					for(var cnt = 1; cnt <=4; cnt += cnt) {
						deck.push(Card(f, col, s, cnt, cardCount));
						cardCount++;
					}
				}
			}
		}
	}

	function endGame() {
		displayMessage('Game over! <br/>All matches made.', true);
	}

	function updateStatus() {
		document.querySelector('#deck_count')?.replaceChildren(
			deck.length
		);
		document.querySelector('#sets_made')?.replaceChildren(
			setsMade
		);
	}

	function hintMessage() {
		if(canScore) {
			displayMessage('A set exists!');
		}
		else {
			displayMessage('A set does not exist!');
		}
	}

	function selectionCheck() {
		if(selected.length == 3) {
			if(scored()) {
				displayMessage('Set made!');
				selected.map(removeCards);
				fillBoard();
				setsMade++;
				updateStatus();
			}

			else {
				displayMessage("That ain't a set!");
			}

			selected[0].toggleSelect();
			selected[0].toggleSelect();
			selected[0].toggleSelect();
		}
	}

	function removeCards(elem) {
		var index = inPlay.indexOf(elem);
		inPlay.splice(index, 1);
		elem.remove();
	}

	function reshuffle() {
		for(var x = 0; x < 3; x++) {
			if(selected[0]) {
				selected[0].toggleSelect();
			}
		}

		for(x = 0; x < inPlay.length; x++) {
			deck.push(inPlay[x]);
		}

		inPlay.length = 0;
		document.querySelector('#board')?.replaceChildren('');

		shuffle();
		fillBoard();
		displayMessage('Reshuffled remaining deck');
	}

	function deselect(elem) {
		elem.toggleSelect();
	}

	function scored() {
		return set(selected[0], selected[1], selected[2]);
	}

	function setExists() {
		for(var x = 0; x < inPlay.length - 2; x++) {
			for(var y = x + 1; y < inPlay.length - 1; y++) {
				for(var z = y + 1; z < inPlay.length; z++) {
					if(set(inPlay[x], inPlay[y], inPlay[z])) {
						return true;
					}
				}
			}
		}

		return false;
	}

	function set(a, b, c) {
		if(!(
				((a.color & b.color & c.color) == a.color) ||
				((a.color | b.color | c.color) == 7) )
		) {
			return false;
		}

		else if(!(
				((a.fill & b.fill & c.fill) == a.fill) ||
				((a.fill | b.fill | c.fill) == 7) )
		) {
			return false;
		}
		else if(!(
				((a.shape & b.shape & c.shape) == a.shape) ||
				((a.shape | b.shape | c.shape) == 7) )
		) {
			return false
		}
		else if(!(
				((a.count & b.count & c.count) == a.count) ||
				((a.count | b.count | c.count) == 7) )
		) {
			return false
		}
		else {
			return true;
		}
	}

	function fillBoard() {
		var dealCount = boardLimit - inPlay.length,
			drawnCard;

			if(dealCount > deck.length) {
				dealCount = deck.length;
			}

		for(var x = 0; x < dealCount; x++) {
			drawnCard = deck.pop();
			inPlay.push(drawnCard);
			drawnCard.deal();
		}

		canScore = setExists();

		if(!deck.length && !canScore) {
			endGame();
		}
	}

	function shuffle() {
		var i = deck.length,
			j,
			tempi,
			tempj;

		if ( i == 0 ) {
			return false;
		}

		while ( --i ) {
			j = Math.floor( Math.random() * ( i + 1 ) );
			tempi = deck[i];
			tempj = deck[j];

			deck[i] = tempj;
			deck[j] = tempi;
		}
	}

	function displayMessage(msg, noTimeout) {
		clearTimeout(msgTimeout);

		document.querySelector('#message')?.replaceChildren(msg);
		document.querySelector('#message')?.removeAttribute('hidden');

		msgTimeout = setTimeout(() => {
			document.querySelector('#message')?.setAttribute('hidden', 'true');
		}, noTimeout ? 0: 2000);
	}

	return {
		get start() {
			return start;
		},
		get reshuffle() {
			return reshuffle;
		}
	};
}
