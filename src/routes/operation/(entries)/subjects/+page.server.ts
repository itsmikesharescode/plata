import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createSubSchema, deleteSubSchema, updateSubSchema } from './(components)/(forms)/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {
		createSubForm: await superValidate(zod(createSubSchema)),
		updateSubForm: await superValidate(zod(updateSubSchema)),
		deleteSubForm: await superValidate(zod(deleteSubSchema))
	};
};

export const actions: Actions = {
	createSubEvent: async ({ request }) => {
		const form = await superValidate(request, zod(createSubSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	},
	updateSubEvent: async ({ request }) => {
		const form = await superValidate(request, zod(updateSubSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	},
	deleteSubEvent: async ({ request }) => {
		const form = await superValidate(request, zod(deleteSubSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	}
};
