import { Fab } from "@mui/material";
import { useIsMusicEnabled, useSetIsMusicEnabled, useActiveController } from "@/atoms";
import useSound from "use-sound";
import { useEffect, useState } from "react";
import song1 from './Little Prelude and Fugue - Sir Cubworth.mp3';
import song2 from './No.9_Esther\'s Waltz - Esther Abrami.mp3';
import song3 from './Sonatina No 2 in F Major Allegro - Joel Cummins.mp3';
import song4 from './Theme for a One-Handed Piano Concerto - Sir Cubworth.mp3';
import {
	MusicNote as MusicNoteIcon,
	MusicOff as MusicOffIcon,
} from '@mui/icons-material';
import { randomChoice } from "@/utils";

export default
function MusicToggle() {
	const isEnabled = useIsMusicEnabled();
	const setIsEnabled = useSetIsMusicEnabled();
	const activeController = useActiveController();
	useMusic();

	if (activeController !== null) return null;

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
	return randomChoice({
		song: song1,
		volume: .3,
	}, {
		song: song2,
		volume: .2,
	}, {
		song: song3,
		volume: .1,
	}, {
		song: song4,
		volume: .2,
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

