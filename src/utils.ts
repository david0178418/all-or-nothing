import { useEffect, useLayoutEffect, useRef } from 'react'

export
function moveAndOverwriteItem<T>(arr: T[], fromIndex: number, toIndex: number): T[] {
	if (fromIndex < 0 || fromIndex >= arr.length || toIndex < 0 || toIndex >= arr.length) {
		console.warn("Indices are out of bounds. Returning original array.");
		return [...arr]; // Return a copy of the original array
	}

	const newArr = [...arr];

	const [item] = newArr.splice(fromIndex, 1) as [T];

	newArr[toIndex] = item;

	return newArr;
}

export
function randomizeArray<T>(array: T[]): T[] {
	const newArray = array.slice();

	// Fisher-Yates Shuffle
	for (let i = newArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		// @ts-ignore
		[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
	}

	return newArray;
}

export function useTimeout(callback: () => void, delay: number | null): void {
	const savedCallback = useRef(callback);

	// Remember the latest callback if it changes.
	useLayoutEffect(() => {
		savedCallback.current = callback
	}, [callback]);

	// Set up the timeout.
	useEffect(() => {
		// Don't schedule if no delay is specified.
		// Note: 0 is a valid value for delay.
		if (!delay && delay !== 0) {
			return;
		}

		const id = setTimeout(() => {
			savedCallback.current();
		}, delay);

		return () => clearTimeout(id);
	}, [delay])
}


// import { useEffect, useRef } from 'react'

export
// source https://usehooks-ts.com/react-hook/use-interval
function useInterval(callback: () => void, delay: number | null) {
	const savedCallback = useRef(callback);

	// Remember the latest callback if it changes.
	useEffect(() => {
		savedCallback.current = callback
	}, [callback]);

	// Set up the interval.
	useEffect(() => {
		// Don't schedule if no delay is specified.
		// Note: 0 is a valid value for delay.
		if (delay === null) {
			return;
		}

		const id = setInterval(() => {
			savedCallback.current()
		}, delay);

		return () => clearInterval(id);
	}, [delay])
}

export
async function resetGame() {
	const { resetGameCore } = await import('@/core');
	await resetGameCore();
}
