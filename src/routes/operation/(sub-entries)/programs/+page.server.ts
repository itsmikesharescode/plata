import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createProgramSchema,
	deleteProgramSchema,
	updateProgramSchema
} from './(components)/(forms)/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const getPrograms = async () => {
		const pageNumber = Number(url.searchParams.get('page')) || 1;
		const limit = Number(url.searchParams.get('size')) || 10;
		const initialRow = (pageNumber - 1) * limit;

		if (!supabase) return null;

		const { data, error } = await supabase
			.from('programs_tb')
			.select('*, departments_tb(*)')
			.range(initialRow, initialRow + limit - 1)
			.order('created_at');

		return error ? null : data;
	};

	const getProgramCount = async () => {
		if (!supabase) return 0;
		const { count, error } = await supabase.from('programs_tb').select('*', { count: 'exact' });

		if (error) return 0;

		return count ?? 0;
	};

	return {
		createProgramForm: await superValidate(zod(createProgramSchema)),
		updateProgramForm: await superValidate(zod(updateProgramSchema)),
		deleteProgramForm: await superValidate(zod(deleteProgramSchema)),
		programs: await getPrograms(),
		programCount: await getProgramCount()
	};
};

export const actions: Actions = {
	createProgramEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(createProgramSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase
			.from('programs_tb')
			.insert({ ...form.data, program_code: form.data.program_code.toUpperCase() });

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Program created successfully' };
	},
	updateProgramEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(updateProgramSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase
			.from('programs_tb')
			.update({ ...form.data, program_code: form.data.program_code.toUpperCase() })
			.eq('id', form.data.id);

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Program updated successfully' };
	},
	deleteProgramEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(deleteProgramSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.from('programs_tb').delete().eq('id', form.data.id);

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Program deleted successfully' };
	}
};
