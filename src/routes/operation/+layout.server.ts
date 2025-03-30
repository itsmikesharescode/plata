import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase } }) => {
	const getAllDepartments = async () => {
		if (!supabase) return null;
		const { data, error } = await supabase.from('departments_tb').select('*').order('created_at');

		if (error) return null;
		return data;
	};

	return {
		departmentsDropdown: await getAllDepartments()
	};
};
