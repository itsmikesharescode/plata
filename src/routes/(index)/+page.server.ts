import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from './schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {
		loginForm: await superValidate(zod(loginSchema))
	};
};

export const actions: Actions = {
	loginEvent: async ({ request }) => {
		const form = await superValidate(request, zod(loginSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
	}
};
