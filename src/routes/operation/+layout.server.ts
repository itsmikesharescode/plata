import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase } }) => {
	const getAllDepartments = async () => {
		if (!supabase) return null;
		const { data, error } = await supabase.from('departments_tb').select('*').order('created_at');

		if (error) return null;
		return data;
	};

	const getAllPrograms = async () => {
		if (!supabase) return null;
		const { data, error } = await supabase
			.from('programs_tb')
			.select('*, departments_tb(department_name)')
			.order('created_at');

		if (error) return null;
		return data;
	};

	return {
		departmentsDropdown: await getAllDepartments(),
		programsDropdown: await getAllPrograms()
	};
};
