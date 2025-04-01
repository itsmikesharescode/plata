import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const getHistories = async () => {
		if (!supabase) return null;

		const { data, error } = await supabase.from('history_tb').select('*').order('created_at');

		if (error) return null;

		return data;
	};

	return {
		histories: await getHistories()
	};
};
