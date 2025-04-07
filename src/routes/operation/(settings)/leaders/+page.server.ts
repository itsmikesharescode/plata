import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { modeSchema } from './(components)/(forms)/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const getLeaders = async () => {
		if (!supabase) return null;

		const { data, error } = await supabase.from('leaders_tb').select('*');

		if (error) return null;

		return data;
	};

	return {
		leaders: await getLeaders(),
		updateMode: await superValidate(zod(modeSchema))
	};
};

export const actions: Actions = {
	updatePresidentEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(modeSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase
			.from('leaders_tb')
			.update({
				univ_president: form.data.fullname
			})
			.eq('id', form.data.id);

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Successfully updated the University President.' };
	},

	updateRegistrarEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(modeSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase
			.from('leaders_tb')
			.update({
				univ_registrar: form.data.fullname
			})
			.eq('id', form.data.id);

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Successfully updated the University Registrar.' };
	},

	updateProgramChairEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(modeSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase
			.from('leaders_tb')
			.update({
				program_chairperson: form.data.fullname
			})
			.eq('id', form.data.id);

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Successfully updated the Program Chairperson.' };
	},

	updateVicePresidentAcademicEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(modeSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase
			.from('leaders_tb')
			.update({
				vp_academic_affairs: form.data.fullname
			})
			.eq('id', form.data.id);

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Successfully updated the Vice President for Academic Affairs.' };
	}
};
