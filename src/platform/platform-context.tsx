import { createContext, useContext, type ReactNode } from 'react';
import type { PlatformService } from './types';
import { createNoopPlatformService } from './noop-platform-service';

const PlatformContext = createContext<PlatformService>(createNoopPlatformService());

interface Props {
	readonly service: PlatformService;
	readonly children: ReactNode;
}

export function PlatformProvider({ service, children }: Props) {
	return (
		<PlatformContext value={service}>
			{children}
		</PlatformContext>
	);
}

export function usePlatformService(): PlatformService {
	return useContext(PlatformContext);
}
