// Get the current date in Pacific time as a Date with year/month/day set accordingly
export
function getPacificDate(): Date {
	const pacific = new Date().toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' });
	return new Date(pacific);
}

// Format a date as "Month Day, Year" (e.g. "May 23, 2026")
export
function formatPacificDate(date: Date): string {
	return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
