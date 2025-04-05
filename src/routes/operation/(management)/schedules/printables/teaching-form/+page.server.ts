import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const id = url.searchParams.get('id');

	if (!id) redirect(301, '/operation/schedules');

	const getScheduleById = async () => {
		if (!supabase) return null;

		const { data, error } = await supabase
			.from('schedules_tb')
			.select(
				'*, faculties_tb(*), departments_tb(*), programs_tb(*), yearlevels_and_sections_tb(*)'
			)
			.eq('id', id)
			.single();

		if (error) return null;

		return data;
	};

	return {
		schedule: await getScheduleById()
	};
};
