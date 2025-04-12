export type UserMeta = {
	role: string;
	department_id: string;
	program_id: string;
	academic_rank: string;
	employment_status: string;
	email: string;
	fullname: string;
};

export type AssignedSubject = {
	id: string;
	code?: string;
	subject_id: string;
	classroom_id: string;
	start_time: string;
	end_time: string;
	day: string;
};

export type HelperComputeSched = {
	total_unit: number;
	total_lecture_hours: number;
	total_lab_hours: number;
};
