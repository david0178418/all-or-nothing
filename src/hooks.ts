import { useEffect, useMemo, useRef, useState } from 'react'
import debounce from 'lodash.debounce';

export
// From https://usehooks-ts.com/react-hook/use-interval
function useInterval(callback: () => void, delay: number | null) {
	const savedCallback = useRef(callback)

	// Remember the latest callback if it changes.
	useEffect(() => {
		savedCallback.current = callback
	}, [callback])

	// Set up the interval.
	useEffect(() => {
		// Don't schedule if no delay is specified.
		// Note: 0 is a valid value for delay.
		if (delay === null) {
			return
		}

		const id = setInterval(() => {
			savedCallback.current()
		}, delay)

		return () => {
			clearInterval(id)
		}
	}, [delay])
}

export function useDebouncedValue<T>(value: T, delay = 250) {
	// State and setters for debounced value
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		// Update debounced value after delay
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);
		// Cancel the timeout if value changes (also on delay change or unmount)
		// This is how we prevent debounced value from updating if value is changed ...
		// .. within the delay period. Timeout gets cleared and restarted.
		return () => clearTimeout(handler);;
	}, [value, delay]);
	return debouncedValue;
}

type DebounceOptions = {
	leading?: boolean
	trailing?: boolean
	maxWait?: number
}

type ControlFunctions = {
	cancel: () => void
	flush: () => void
	isPending: () => boolean
}

export type DebouncedState<T extends (...args: any) => ReturnType<T>> = ((
	...args: Parameters<T>
) => ReturnType<T> | undefined) &
	ControlFunctions

export function useDebounceCallback<T extends (...args: any) => ReturnType<T>>(
	func: T,
	delay = 500,
	options?: DebounceOptions,
): DebouncedState<T> {
	const debouncedFunc = useRef<ReturnType<typeof debounce>>()

	useUnmount(() => {
		if (debouncedFunc.current) {
			debouncedFunc.current.cancel()
		}
	});

	const debounced = useMemo(() => {
	const debouncedFuncInstance = debounce(func, delay, options)

	const wrappedFunc: DebouncedState<T> = (...args: Parameters<T>) => {
		return debouncedFuncInstance(...args)
	}

	wrappedFunc.cancel = () => {
		debouncedFuncInstance.cancel()
	}

	wrappedFunc.isPending = () => {
		return !!debouncedFunc.current
	}

	wrappedFunc.flush = () => {
		return debouncedFuncInstance.flush()
	}

	return wrappedFunc
	}, [func, delay, options])

	// Update the debounced function ref whenever func, wait, or options change
	useEffect(() => {
		debouncedFunc.current = debounce(func, delay, options)
	}, [func, delay, options])

	return debounced;
}

export function useUnmount(func: () => void) {
	const funcRef = useRef(func)

	funcRef.current = func

	useEffect(() => () => {
		funcRef.current()
	}, [])
}
