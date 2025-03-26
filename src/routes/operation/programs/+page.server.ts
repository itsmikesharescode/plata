import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createProgramSchema,
	deleteProgramSchema,
	updateProgramSchema
} from './(components)/(forms)/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {
		createProgramForm: await superValidate(zod(createProgramSchema)),
		updateProgramForm: await superValidate(zod(updateProgramSchema)),
		deleteProgramForm: await superValidate(zod(deleteProgramSchema))
	};
};

export const actions: Actions = {
	createProgramEvent: async ({ request }) => {
		const form = await superValidate(request, zod(createProgramSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	},
	updateProgramEvent: async ({ request }) => {
		const form = await superValidate(request, zod(updateProgramSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	},
	deleteProgramEvent: async ({ request }) => {
		const form = await superValidate(request, zod(deleteProgramSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	}
};
