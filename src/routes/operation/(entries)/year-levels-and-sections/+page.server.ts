import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createYnsSchema, deleteYnsSchema, updateYnsSchema } from './(components)/(forms)/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const getYns = async () => {
		const page = url.searchParams.get('page');
		const size = url.searchParams.get('size');
		const limit = size ? Number(size) : 10;

		if (!supabase) return null;

		if (page) {
			const initialRow = (Number(page) - 1) * limit;
			const finalRow = Number(page) * limit;

			const { data, error } = await supabase
				.from('yearlevels_and_sections_tb')
				.select('*')
				.range(initialRow, finalRow)
				.order('created_at');

			if (error) return null;

			return data;
		} else {
			const { data, error } = await supabase
				.from('yearlevels_and_sections_tb')
				.select('*')
				.limit(limit)
				.order('created_at');
			if (error) return null;

			return data;
		}
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
