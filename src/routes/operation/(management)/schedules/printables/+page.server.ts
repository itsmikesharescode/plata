import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const getSchedules = async () => {
		const program_id = url.searchParams.get('id');

		const query = supabase.from('schedules_tb').select('*').order('created_at');

		if (program_id) query.eq('program_id', program_id);

		const { data, error } = await query;

		return error ? null : data;
	};

	return {
		schedules: await getSchedules()
	};
};
