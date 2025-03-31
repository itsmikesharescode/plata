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

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const getUsers = async () => {
		const page = url.searchParams.get('page');
		const size = url.searchParams.get('size');
		const limit = size ? Number(size) : 10;

		if (!supabase) return null;

		if (page) {
			const initialRow = (Number(page) - 1) * limit;
			const finalRow = Number(page) * limit;

			const { data, error } = await supabase
				.from('users_tb')
				.select('*')
				.range(initialRow, finalRow)
				.order('created_at');

			if (error) return null;

			return data;
		} else {
			const { data, error } = await supabase
				.from('users_tb')
				.select('*')
				.limit(limit)
				.order('created_at');
			if (error) return null;

			return data;
		}
	};

	const getUsersCount = async () => {
		if (!supabase) return 0;
		const { count, error } = await supabase.from('users_tb').select('*', { count: 'exact' });

		if (error) return 0;

		return count ?? 0;
	};

	return {
		createChairpersonForm: await superValidate(zod(createChairpersonSchema)),
		updateChairpersonInfoForm: await superValidate(zod(updateChairpersonInfoSchema)),
		updateChairpersonEmailForm: await superValidate(zod(updateChairpersonEmailSchema)),
		updateChairpersonPwdForm: await superValidate(zod(updateChairpersonPwdSchema)),
		deleteChairpersonForm: await superValidate(zod(deleteChairpersonSchema)),
		users: await getUsers(),
		userCount: await getUsersCount()
	};
};

export const actions: Actions = {
	createChairpersonEvent: async ({ request, locals: { supabaseAdmin } }) => {
		const form = await superValidate(request, zod(createChairpersonSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabaseAdmin.auth.admin.createUser({
			email: form.data.email,
			password: form.data.password,
			email_confirm: true,
			user_metadata: {
				role: 'chair',
				department_id: form.data.department_id,
				program_id: form.data.program_id,
				academic_rank: form.data.academic_rank,
				employment_status: form.data.employment_status,
				fullname: form.data.fullname
			}
		});

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Chairperson created successfully' };
	},

	updateChairpersonEmailEvent: async ({ request, locals: { supabaseAdmin } }) => {
		const form = await superValidate(request, zod(updateChairpersonEmailSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabaseAdmin.auth.admin.updateUserById(form.data.user_id, {
			email: form.data.email
		});

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Chairperson email updated successfully' };
	},

	updateChairpersonInfoEvent: async ({ request, locals: { supabaseAdmin } }) => {
		const form = await superValidate(request, zod(updateChairpersonInfoSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabaseAdmin.auth.admin.updateUserById(form.data.user_id, {
			user_metadata: {
				department_id: form.data.department_id,
				program_id: form.data.program_id,
				academic_rank: form.data.academic_rank,
				employment_status: form.data.employment_status,
				fullname: form.data.fullname
			}
		});

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Chairperson info updated successfully' };
	},

	updateChairpersonPwdEvent: async ({ request, locals: { supabaseAdmin } }) => {
		const form = await superValidate(request, zod(updateChairpersonPwdSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabaseAdmin.auth.admin.updateUserById(form.data.user_id, {
			password: form.data.password
		});

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Chairperson password updated successfully' };
	},

	deleteChairpersonEvent: async ({ request, locals: { supabaseAdmin } }) => {
		const form = await superValidate(request, zod(deleteChairpersonSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabaseAdmin.auth.admin.deleteUser(form.data.user_id);

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Chairperson deleted successfully' };
	}
};
