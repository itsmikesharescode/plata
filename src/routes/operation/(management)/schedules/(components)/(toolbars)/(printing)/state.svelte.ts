import type { Database } from '$lib/database.types';
import { getContext, setContext } from 'svelte';

type Schedule = Database['public']['Tables']['schedules_tb']['Row'];

class PrintingState {
	#schedules = $state<Schedule[] | null>(null);

	setSchedules(schedules: Schedule[] | null) {
		this.#schedules = schedules;
	}

	getSchedules() {
		return this.#schedules;
	}
}

const PrintingKey = Symbol('PrintingState');

export const initPrintingState = () => {
	return setContext(PrintingKey, new PrintingState());
};

export const usePrintingState = () => {
	return getContext<ReturnType<typeof initPrintingState>>(PrintingKey);
};
