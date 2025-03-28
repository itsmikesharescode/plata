import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createScheduleSchema,
	updateScheduleSchema,
	deleteScheduleSchema
} from './(components)/(forms)/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {
		createScheduleForm: await superValidate(zod(createScheduleSchema)),
		updateScheduleForm: await superValidate(zod(updateScheduleSchema)),
		deleteScheduleForm: await superValidate(zod(deleteScheduleSchema))
	};
};

export const actions: Actions = {
	createScheduleEvent: async ({ request }) => {
		const form = await superValidate(request, zod(createScheduleSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	},

	updateScheduleEvent: async ({ request }) => {
		const form = await superValidate(request, zod(updateScheduleSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	},

	deleteScheduleEvent: async ({ request }) => {
		const form = await superValidate(request, zod(deleteScheduleSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	}
};
