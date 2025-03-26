import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createChairpersonSchema,
	deleteChairpersonSchema,
	updateChairpersonSchema
} from './(components)/(forms)/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {
		createChairpersonForm: await superValidate(zod(createChairpersonSchema)),
		updateChairpersonForm: await superValidate(zod(updateChairpersonSchema)),
		deleteChairpersonForm: await superValidate(zod(deleteChairpersonSchema))
	};
};

export const actions: Actions = {
	createChairpersonEvent: async ({ request }) => {
		const form = await superValidate(request, zod(createChairpersonSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	},
	updateChairpersonEvent: async ({ request }) => {
		const form = await superValidate(request, zod(updateChairpersonSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	},
	deleteChairpersonEvent: async ({ request }) => {
		const form = await superValidate(request, zod(deleteChairpersonSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	}
};
