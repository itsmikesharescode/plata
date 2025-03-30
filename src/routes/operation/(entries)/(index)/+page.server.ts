import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createDepSchema, deleteDepSchema, updateDepSchema } from './(components)/(forms)/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const getDepartments = async () => {
		const page = url.searchParams.get('page');
		const size = url.searchParams.get('size');
		const limit = size ? Number(size) : 10;

		if (!supabase) return null;

		if (page) {
			const initialRow = (Number(page) - 1) * limit;
			const finalRow = Number(page) * limit;

			const { data, error } = await supabase
				.from('departments_tb')
				.select('*')
				.range(initialRow, finalRow)
				.order('created_at');

			if (error) return null;

			return data;
		} else {
			const { data, error } = await supabase
				.from('departments_tb')
				.select('*')
				.limit(limit)
				.order('created_at');
			if (error) return null;

			return data;
		}
	};

	return {
		createDepForm: await superValidate(zod(createDepSchema)),
		updateDepForm: await superValidate(zod(updateDepSchema)),
		deleteDepForm: await superValidate(zod(deleteDepSchema)),
		departments: await getDepartments()
	};
};

export const actions: Actions = {
	createDepEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(createDepSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.from('departments_tb').insert({
			department_name: form.data.department_name,
			department_code: form.data.department_code,
			department_color: form.data.department_color
		});

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Department created successfully' };
	},
	updateDepEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(updateDepSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase
			.from('departments_tb')
			.update({
				department_name: form.data.department_name,
				department_code: form.data.department_code,
				department_color: form.data.department_color
			})
			.eq('id', form.data.id);

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Department updated successfully' };
	},
	deleteDepEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(deleteDepSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.from('departments_tb').delete().eq('id', form.data.id);

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Department deleted successfully' };
	}
};
