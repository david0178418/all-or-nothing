import { atom, useAtomValue, useSetAtom } from 'jotai';
import { Screens, ToastMesssage } from './types';

const soundAtom = atom(true);

export
function useIsSoundEnabled() {
	return useAtomValue(soundAtom);
}

export
function useSetIsSoundEnabled() {
	return useSetAtom(soundAtom);
}

const musicAtom = atom(true);

export
function useIsMusicEnabled() {
	return useAtomValue(musicAtom);
}

export
function useSetIsMusicEnabled() {
	return useSetAtom(musicAtom);
}

const pausedAtom = atom(false);

const activeScreenAtom = atom<Screens>(Screens.Title);

export
function useActiveScreen() {
	return useAtomValue(activeScreenAtom);
}

export
function useSetActiveScreen() {
	return useSetAtom(activeScreenAtom);
}

export
function useIsPaused() {
	return useAtomValue(pausedAtom);
}

export
function useSetIsPaused() {
	return useSetAtom(pausedAtom);
}
const toastQueueAtom = atom<ToastMesssage[]>([]);

export
const toastMsgAtom = atom(get => get(toastQueueAtom)[0] || null);

export
const pushToastMsgAtom = atom(
	null,
	(get, set, message: ToastMesssage | string) => {

		const addedMsg = (typeof message === 'string') ? { message } : message;

		const tqa = get(toastQueueAtom);

		set(toastQueueAtom, [ ...tqa, addedMsg ]);
	},
);

export
const clearCurrentToastMsgAtom = atom(
	null,
	(get, set) => {
		const tqa = get(toastQueueAtom);
		tqa.shift();

		set(toastQueueAtom, [ ...tqa ]);
	},
);

export
function usePushToastMsg() {
	return useSetAtom(pushToastMsgAtom);
}
