import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createDepSchema, deleteDepSchema, updateDepSchema } from './(components)/(forms)/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {
		createDepForm: await superValidate(zod(createDepSchema)),
		updateDepForm: await superValidate(zod(updateDepSchema)),
		deleteDepForm: await superValidate(zod(deleteDepSchema))
	};
};

export const actions: Actions = {
	createDepEvent: async ({ request }) => {
		const form = await superValidate(request, zod(createDepSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	},
	updateDepEvent: async ({ request }) => {
		const form = await superValidate(request, zod(updateDepSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	},
	deleteDepEvent: async ({ request }) => {
		const form = await superValidate(request, zod(deleteDepSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	}
};
