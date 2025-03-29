export const academicRanks = [
	'College Professor',
	'Professor VI',
	'Professor V',
	'Professor IV',
	'Professor III',
	'Professor II',
	'Professor I',
	'Associate Professor V',
	'Associate Professor IV',
	'Associate Professor III',
	'Associate Professor II',
	'Associate Professor I',
	'Assistant Professor IV',
	'Assistant Professor III',
	'Assistant Professor II',
	'Assistant Professor I',
	'Instructor III',
	'Instructor II',
	'Instructor I'
];

//sample only
export const sampleDepartments = [
	{
		id: crypto.randomUUID(),
		department_name: 'Civil Engineering Department',
		department_code: 'CED',
		department_color: '#000000'
	},
	{
		id: crypto.randomUUID(),
		department_name: 'Computer Science and Engineering Department',
		department_code: 'CSE',
		department_color: '#000000'
	},
	{
		id: crypto.randomUUID(),
		department_name: 'Civil and Construction Engineering Department',
		department_code: 'CCE',
		department_color: '#000000'
	}
];

export const sampleSubjects = [
	{
		id: crypto.randomUUID(),
		course_name: 'Calculus 1',
		code: '',
		course_code: 'CALC1',
		lec_hours: 1,
		lab_hours: 3,
		unit: 4
	},

	{
		id: crypto.randomUUID(),
		course_name: 'Definite Integrals',
		code: '',
		course_code: 'DEFINT',
		lec_hours: 3,
		lab_hours: 0,
		unit: 2
	},

	{
		id: crypto.randomUUID(),
		course_name: 'Differential Equations',
		code: '',
		course_code: 'DIFFEQ',
		lec_hours: 2,
		lab_hours: 0,
		unit: 3
	}
];

export const sampleClassrooms = [
	{
		id: crypto.randomUUID(),
		department_id: crypto.randomUUID(),
		classroom_name: 'Room 1',
		building_name: 'Building 1'
	},
	{
		id: crypto.randomUUID(),
		department_id: crypto.randomUUID(),
		classroom_name: 'Room 2',
		building_name: 'Building 15'
	},
	{
		id: crypto.randomUUID(),
		department_id: crypto.randomUUID(),
		classroom_name: 'Room 3',
		building_name: 'Building 11'
	}
];

export const sampleFaculties = [
	{
		id: crypto.randomUUID(),
		department_id: crypto.randomUUID(),
		fullname: 'John Doe',
		academic_rank: 'Professor I',
		employment_status: 'Regular'
	},
	{
		id: crypto.randomUUID(),
		department_id: crypto.randomUUID(),
		fullname: 'Peter Doe',
		academic_rank: 'Associate Professor II',
		employment_status: 'Regular'
	},
	{
		id: crypto.randomUUID(),
		department_id: crypto.randomUUID(),
		fullname: 'Fey Doe',
		academic_rank: 'Assistant Professor I',
		employment_status: 'Regular'
	}
];

export const samplePrograms = [
	{
		id: crypto.randomUUID(),
		department_id: crypto.randomUUID(),
		program_name: 'Bachelor of Science in Computer Science',
		program_code: 'BSCS'
	},
	{
		id: crypto.randomUUID(),
		department_id: crypto.randomUUID(),
		program_name: 'Bachelor of Science in Information Technology',
		program_code: 'BSIT'
	},
	{
		id: crypto.randomUUID(),
		department_id: crypto.randomUUID(),
		program_name: 'Bachelor of Science in Information Systems',
		program_code: 'BSIS'
	},
	{
		id: crypto.randomUUID(),
		department_id: crypto.randomUUID(),
		program_name: 'Bachelor of Science in Mathematics',
		program_code: 'BSMATH'
	}
];

export const sampleYearAndSections = [
	{
		id: crypto.randomUUID(),
		year_level: '1st Year',
		section: 'IT1E'
	},
	{
		id: crypto.randomUUID(),
		year_level: '1st Year',
		section: 'IT2E'
	},
	{
		id: crypto.randomUUID(),
		year_level: '1st Year',
		section: 'IT3E'
	}
];
