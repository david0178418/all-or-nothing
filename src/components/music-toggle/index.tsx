import { Fab } from "@mui/material";
import { useIsMusicEnabled, useSetIsMusicEnabled } from "@/atoms";
import useSound from "use-sound";
import { useEffect, useState } from "react";
import { randomChoice } from "@/utils";
import {
	MusicNote as MusicNoteIcon,
	MusicOff as MusicOffIcon,
} from '@mui/icons-material';

// TODO Remove music from code base
// import song1 from './Little Prelude and Fugue - Sir Cubworth.mp3';
// import song2 from './No.9_Esther’s Waltz - Esther Abrami.mp3';
// import song3 from './Sonatina No 2 in F Major Allegro - Joel Cummins.mp3';
// import song4 from './Theme for a One-Handed Piano Concerto - Sir Cubworth.mp3';

// TODO Implement theme
import song1 from './Corny Candy - The Soundlings.mp3';
import song2 from './Happy Haunts - Aaron Kenny.mp3';

export default
function MusicToggle() {
	const isEnabled = useIsMusicEnabled();
	const setIsEnabled = useSetIsMusicEnabled();
	useMusic();

	return (
		<Fab
			color="primary"
			size="small"
			sx={{
				position: 'fixed',
				bottom: 16,
				right: 64,
			}}
			onClick={() => setIsEnabled(!isEnabled)}
		>
			{isEnabled ? (
				<MusicNoteIcon />
			): (
				<MusicOffIcon />
			)}
		</Fab>
	);
}

function getRandomSong() {
	// TODO Implement theme
	return randomChoice({
		song: song1,
		volume: .3,
	}, {
		song: song2,
		volume: .2,
	// }, {
	// 	song: song3,
	// 	volume: .1,
	// }, {
	// 	song: song4,
	// 	volume: .2,
	});
}

function useMusic() {
	const isEnabled = useIsMusicEnabled();
	const [isLoaded, setIsLoaded] = useState(false);
	const [activeSong] = useState(getRandomSong);
	const [play, { stop }] = useSound(activeSong.song, {
		volume: activeSong.volume,
		loop: true,
		onload: () => setIsLoaded(true),
	});

	useEffect(() => {
		return stop;
	}, [stop]);

	useEffect(() => {
		if(!isLoaded) {
			return;
		}

		isEnabled ?
			play():
			stop();
	}, [isEnabled, isLoaded]);
}

