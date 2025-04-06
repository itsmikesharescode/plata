import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createScheduleSchema,
	updateScheduleSchema,
	deleteScheduleSchema
} from './(components)/(forms)/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const getSchedules = async () => {
		const pageNumber = Number(url.searchParams.get('page')) || 1;
		const limit = Number(url.searchParams.get('size')) || 10;
		const initialRow = (pageNumber - 1) * limit;

		if (!supabase) return null;

		const { data, error } = await supabase
			.from('schedules_tb')
			.select(
				'*, faculties_tb(*, departments_tb(*)), programs_tb(*, departments_tb(*)), departments_tb(*), yearlevels_and_sections_tb(*)'
			)
			.range(initialRow, initialRow + limit - 1)
			.order('created_at', { ascending: false });

		return error ? null : data;
	};

	const getSchedulesCount = async () => {
		if (!supabase) return 0;
		const { count, error } = await supabase.from('schedules_tb').select('*', { count: 'exact' });

		if (error) return 0;

		return count ?? 0;
	};

	return {
		createScheduleForm: await superValidate(zod(createScheduleSchema)),
		updateScheduleForm: await superValidate(zod(updateScheduleSchema)),
		deleteScheduleForm: await superValidate(zod(deleteScheduleSchema)),
		schedules: await getSchedules(),
		schedulesCount: await getSchedulesCount()
	};
};

export const actions: Actions = {
	createScheduleEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(createScheduleSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.from('schedules_tb').insert(form.data);

		if (error) return fail(401, { form });

		return { form, msg: 'Schedule created successfully' };
	},

	updateScheduleEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(updateScheduleSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.from('schedules_tb').update(form.data).eq('id', form.data.id);

		if (error) return fail(401, { form });

		return { form, msg: 'Schedule updated successfully' };
	},

	deleteScheduleEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(deleteScheduleSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.from('schedules_tb').delete().eq('id', form.data.id);

		if (error) return fail(401, { form });

		return { form, msg: 'Schedule deleted successfully' };
	}
};
