import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createYnsSchema, deleteYnsSchema, updateYnsSchema } from './(components)/(forms)/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const getYns = async () => {
		const pageNumber = Number(url.searchParams.get('page')) || 1;
		const limit = Number(url.searchParams.get('size')) || 10;
		const initialRow = (pageNumber - 1) * limit;

		if (!supabase) return null;

		const { data, error } = await supabase
			.from('yearlevels_and_sections_tb')
			.select('*')
			.range(initialRow, initialRow + limit - 1)
			.order('created_at', { ascending: false });

		return error ? null : data;
	};

	const getYnsCount = async () => {
		if (!supabase) return 0;
		const { count, error } = await supabase.from('yearlevels_and_sections_tb').select('*', {
			count: 'exact'
		});

		if (error) return 0;

		return count ?? 0;
	};

	return {
		createYnsForm: await superValidate(zod(createYnsSchema)),
		updateYnsForm: await superValidate(zod(updateYnsSchema)),
		deleteYnsForm: await superValidate(zod(deleteYnsSchema)),
		yns: await getYns(),
		ynsCount: await getYnsCount()
	};
};

export const actions: Actions = {
	createYnsEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(createYnsSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.from('yearlevels_and_sections_tb').insert(form.data);

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Year Level and Section created successfully' };
	},
	updateYnsEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(updateYnsSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase
			.from('yearlevels_and_sections_tb')
			.update(form.data)
			.eq('id', form.data.id);

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Year Level and Section updated successfully' };
	},
	deleteYnsEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(deleteYnsSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase
			.from('yearlevels_and_sections_tb')
			.delete()
			.eq('id', form.data.id);

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Year Level and Section deleted successfully' };
	}
};
