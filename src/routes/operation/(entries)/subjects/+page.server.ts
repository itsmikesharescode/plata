import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createSubSchema, deleteSubSchema, updateSubSchema } from './(components)/(forms)/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const getSubjects = async () => {
		const pageNumber = Number(url.searchParams.get('page')) || 1;
		const limit = Number(url.searchParams.get('size')) || 10;
		const initialRow = (pageNumber - 1) * limit;

		if (!supabase) return null;

		const { data, error } = await supabase
			.from('subjects_tb')
			.select('*')
			.range(initialRow, initialRow + limit - 1)
			.order('created_at');

		return error ? null : data;
	};

	const getSubjectCount = async () => {
		if (!supabase) return 0;
		const { count, error } = await supabase.from('subjects_tb').select('*', { count: 'exact' });

		if (error) return 0;

		return count ?? 0;
	};

	return {
		createSubForm: await superValidate(zod(createSubSchema)),
		updateSubForm: await superValidate(zod(updateSubSchema)),
		deleteSubForm: await superValidate(zod(deleteSubSchema)),
		subjects: await getSubjects(),
		subjectCount: await getSubjectCount()
	};
};

export const actions: Actions = {
	createSubEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(createSubSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.from('subjects_tb').insert({
			...form.data,
			subject_code: form.data.course_code.toUpperCase()
		});

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Subject created successfully' };
	},
	updateSubEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(updateSubSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase
			.from('subjects_tb')
			.update({
				...form.data,
				subject_code: form.data.course_code.toUpperCase()
			})
			.eq('id', form.data.id);

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Subject updated successfully' };
	},
	deleteSubEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(deleteSubSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.from('subjects_tb').delete().eq('id', form.data.id);

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Subject deleted successfully' };
	}
};
