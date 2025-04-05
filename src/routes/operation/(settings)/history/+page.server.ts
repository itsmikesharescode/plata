import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const getHistories = async () => {
		const pageNumber = Number(url.searchParams.get('page')) || 1;
		const limit = Number(url.searchParams.get('size')) || 10;
		const initialRow = (pageNumber - 1) * limit;

		if (!supabase) return null;

		const { data, error } = await supabase
			.from('history_tb')
			.select('*')
			.range(initialRow, initialRow + limit - 1)
			.order('created_at');

		return error ? null : data;
	};

	const getHistoryCount = async () => {
		if (!supabase) return 0;
		const { count, error } = await supabase.from('history_tb').select('*', { count: 'exact' });

		if (error) return 0;

		return count ?? 0;
	};

	return {
		histories: await getHistories(),
		historyCount: await getHistoryCount()
	};
};
