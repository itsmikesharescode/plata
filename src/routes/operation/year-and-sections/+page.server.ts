import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createYnsSchema, deleteYnsSchema, updateYnsSchema } from './(components)/(forms)/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {
		createYnsForm: await superValidate(zod(createYnsSchema)),
		updateYnsForm: await superValidate(zod(updateYnsSchema)),
		deleteYnsForm: await superValidate(zod(deleteYnsSchema))
	};
};

export const actions: Actions = {
	createYnsEvent: async ({ request }) => {
		const form = await superValidate(request, zod(createYnsSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	},
	updateYnsEvent: async ({ request }) => {
		const form = await superValidate(request, zod(updateYnsSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	},
	deleteYnsEvent: async ({ request }) => {
		const form = await superValidate(request, zod(deleteYnsSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	}
};
