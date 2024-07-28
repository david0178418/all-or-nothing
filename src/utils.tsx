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
