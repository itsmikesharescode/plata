import { getContext, setContext } from 'svelte';

class RowState<T> {
	#activeRow = $state<T | null>(null);

	getActiveRow() {
		return this.#activeRow;
	}

	setActiveRow(row: T | null) {
		this.#activeRow = row;
	}
}

const RowStateKey = Symbol('rowState');

export const initRowState = <T>() => {
	return setContext(RowStateKey, new RowState<T>());
};

export const useRowState = () => {
	return getContext<ReturnType<typeof initRowState>>(RowStateKey);
};
