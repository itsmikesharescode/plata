import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createSubSchema, deleteSubSchema, updateSubSchema } from './(components)/(forms)/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const getSubjects = async () => {
		const page = url.searchParams.get('page');
		const size = url.searchParams.get('size');
		const limit = size ? Number(size) : 10;

		if (!supabase) return null;

		if (page) {
			const initialRow = (Number(page) - 1) * limit;
			const finalRow = Number(page) * limit;

			const { data, error } = await supabase
				.from('subjects_tb')
				.select('*')
				.range(initialRow, finalRow)
				.order('created_at');

			if (error) return null;

			return data;
		} else {
			const { data, error } = await supabase
				.from('subjects_tb')
				.select('*')
				.limit(limit)
				.order('created_at');
			if (error) return null;

			return data;
		}
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

		const { error } = await supabase.from('subjects_tb').insert(form.data);

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Subject created successfully' };
	},
	updateSubEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(updateSubSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.from('subjects_tb').update(form.data).eq('id', form.data.id);

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
