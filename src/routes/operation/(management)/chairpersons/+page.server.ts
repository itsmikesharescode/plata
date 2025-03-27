import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createChairpersonSchema,
	updateChairpersonEmailSchema,
	updateChairpersonInfoSchema,
	updateChairpersonPwdSchema,
	deleteChairpersonSchema
} from './(components)/(forms)/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {
		createChairpersonForm: await superValidate(zod(createChairpersonSchema)),
		updateChairpersonInfoForm: await superValidate(zod(updateChairpersonInfoSchema)),
		updateChairpersonEmailForm: await superValidate(zod(updateChairpersonEmailSchema)),
		updateChairpersonPwdForm: await superValidate(zod(updateChairpersonPwdSchema)),
		deleteChairpersonForm: await superValidate(zod(deleteChairpersonSchema))
	};
};

export const actions: Actions = {
	createChairpersonEvent: async ({ request }) => {
		const form = await superValidate(request, zod(createChairpersonSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	},

	updateChairpersonEmailEvent: async ({ request }) => {
		const form = await superValidate(request, zod(updateChairpersonEmailSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	},

	updateChairpersonInfoEvent: async ({ request }) => {
		const form = await superValidate(request, zod(updateChairpersonInfoSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	},

	updateChairpersonPwdEvent: async ({ request }) => {
		const form = await superValidate(request, zod(updateChairpersonPwdSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	},

	deleteChairpersonEvent: async ({ request }) => {
		const form = await superValidate(request, zod(deleteChairpersonSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	}
};
