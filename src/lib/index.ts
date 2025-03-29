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
