import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createClassroomSchema,
	deleteClassroomSchema,
	updateClassroomSchema
} from './(components)/(forms)/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {
		createClassroomForm: await superValidate(zod(createClassroomSchema)),
		updateClassroomForm: await superValidate(zod(updateClassroomSchema)),
		deleteClassroomForm: await superValidate(zod(deleteClassroomSchema))
	};
};

export const actions: Actions = {
	createClassroomEvent: async ({ request }) => {
		const form = await superValidate(request, zod(createClassroomSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	},
	updateClassroomEvent: async ({ request }) => {
		const form = await superValidate(request, zod(updateClassroomSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	},
	deleteClassroomEvent: async ({ request }) => {
		const form = await superValidate(request, zod(deleteClassroomSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	}
};
