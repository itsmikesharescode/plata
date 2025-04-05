import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createFacultySchema,
	deleteFacultySchema,
	updateFacultySchema
} from './(components)/(forms)/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const getFaculties = async () => {
		const pageNumber = Number(url.searchParams.get('page')) || 1;
		const limit = Number(url.searchParams.get('size')) || 10;
		const initialRow = (pageNumber - 1) * limit;

		if (!supabase) return null;

		const { data, error } = await supabase
			.from('faculties_tb')
			.select('*, departments_tb(*)')
			.range(initialRow, initialRow + limit - 1)
			.order('created_at');

		return error ? null : data;
	};

	const getFacultyCount = async () => {
		if (!supabase) return 0;
		const { count, error } = await supabase.from('faculties_tb').select('*', { count: 'exact' });

		if (error) return 0;

		return count ?? 0;
	};

	return {
		createFacultyForm: await superValidate(zod(createFacultySchema)),
		updateFacultyForm: await superValidate(zod(updateFacultySchema)),
		deleteFacultyForm: await superValidate(zod(deleteFacultySchema)),
		faculties: await getFaculties(),
		facultyCount: await getFacultyCount()
	};
};

export const actions: Actions = {
	createFacultyEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(createFacultySchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.from('faculties_tb').insert(form.data);

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Faculty created successfully' };
	},
	updateFacultyEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(updateFacultySchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.from('faculties_tb').update(form.data).eq('id', form.data.id);

		if (error) return fail(400, { form, msg: error.message });

		return { form, msg: 'Faculty updated successfully' };
	},
	deleteFacultyEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(deleteFacultySchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.from('faculties_tb').delete().eq('id', form.data.id);

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Faculty deleted successfully' };
	}
};
