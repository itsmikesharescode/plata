import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createClassroomSchema,
	deleteClassroomSchema,
	updateClassroomSchema
} from './(components)/(forms)/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const getClassrooms = async () => {
		const page = url.searchParams.get('page');
		const size = url.searchParams.get('size');
		const limit = size ? Number(size) : 10;

		if (!supabase) return null;

		if (page) {
			const initialRow = (Number(page) - 1) * limit;
			const finalRow = Number(page) * limit;

			const { data, error } = await supabase
				.from('classrooms_tb')
				.select('*')
				.range(initialRow, finalRow)
				.order('created_at');

			if (error) return null;

			return data;
		} else {
			const { data, error } = await supabase
				.from('classrooms_tb')
				.select('*')
				.limit(limit)
				.order('created_at');
			if (error) return null;

			return data;
		}
	};

	const getClassroomCount = async () => {
		if (!supabase) return 0;
		const { count, error } = await supabase.from('classrooms_tb').select('*', { count: 'exact' });

		if (error) return 0;

		return count ?? 0;
	};

	return {
		createClassroomForm: await superValidate(zod(createClassroomSchema)),
		updateClassroomForm: await superValidate(zod(updateClassroomSchema)),
		deleteClassroomForm: await superValidate(zod(deleteClassroomSchema)),
		classrooms: await getClassrooms(),
		classroomCount: await getClassroomCount()
	};
};

export const actions: Actions = {
	createClassroomEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(createClassroomSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.from('classrooms_tb').insert(form.data);

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Classroom created successfully' };
	},
	updateClassroomEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(updateClassroomSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.from('classrooms_tb').update(form.data).eq('id', form.data.id);

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Classroom updated successfully' };
	},
	deleteClassroomEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(deleteClassroomSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.from('classrooms_tb').delete().eq('id', form.data.id);

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Classroom deleted successfully' };
	}
};
