import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createFacultySchema,
	deleteFacultySchema,
	updateFacultySchema
} from './(components)/(forms)/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {
		createFacultyForm: await superValidate(zod(createFacultySchema)),
		updateFacultyForm: await superValidate(zod(updateFacultySchema)),
		deleteFacultyForm: await superValidate(zod(deleteFacultySchema))
	};
};

export const actions: Actions = {
	createFacultyEvent: async ({ request }) => {
		const form = await superValidate(request, zod(createFacultySchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	},
	updateFacultyEvent: async ({ request }) => {
		const form = await superValidate(request, zod(updateFacultySchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	},
	deleteFacultyEvent: async ({ request }) => {
		const form = await superValidate(request, zod(deleteFacultySchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	}
};
