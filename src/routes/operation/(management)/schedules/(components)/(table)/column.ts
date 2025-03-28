import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { ScheduleTable } from './schema.js';
import RowActions from './components/row-actions.svelte';
import { HeaderColumn } from '$lib/components/general/custom-table/components/index.js';
import RowId from './components/row-id.svelte';

import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';

export const columns: ColumnDef<ScheduleTable>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ScheduleTable, unknown>, {
				column,
				title: 'ID'
			});
		},
		cell: ({ row }) => renderComponent(RowId<ScheduleTable>, { row }),
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'department_id',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ScheduleTable, unknown>, {
				column,
				title: 'DEPARTMENT'
			});
		},
		cell: ({ row }) => {
			const departmentSnippet = createRawSnippet<[string]>((getDepartment) => {
				const department = getDepartment();
				return {
					render: () => `<div class="w-full">${department}</div>`
				};
			});

			return renderSnippet(departmentSnippet, row.getValue('department_id'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'program_id',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ScheduleTable, unknown>, {
				column,
				title: 'PROGRAM'
			});
		},
		cell: ({ row }) => {
			const programSnippet = createRawSnippet<[string]>((getProgram) => {
				const program = getProgram();
				return {
					render: () => `<div class="w-full">${program}</div>`
				};
			});

			return renderSnippet(programSnippet, row.getValue('program_id'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'faculty_id',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ScheduleTable, unknown>, {
				column,
				title: 'FULLNAME'
			});
		},
		cell: ({ row }) => {
			const facultySnippet = createRawSnippet<[string]>((getFaculty) => {
				const faculty = getFaculty();
				return {
					render: () => `<div class="w-full">${faculty}</div>`
				};
			});

			return renderSnippet(facultySnippet, row.getValue('faculty_id'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'year_and_section_id',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ScheduleTable, unknown>, {
				column,
				title: 'YEAR AND SECTION'
			});
		},
		cell: ({ row }) => {
			const yearAndSectionSnippet = createRawSnippet<[string]>((getYearAndSection) => {
				const yearAndSection = getYearAndSection();
				return {
					render: () => `<div class="w-[100px]">${yearAndSection}</div>`
				};
			});

			return renderSnippet(yearAndSectionSnippet, row.getValue('year_and_section_id'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'semester',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ScheduleTable, unknown>, {
				column,
				title: 'SEMESTER'
			});
		},
		cell: ({ row }) => {
			const semesterSnippet = createRawSnippet<[string]>((getSemester) => {
				const semester = getSemester();
				return {
					render: () => `<div class="w-full">${semester}</div>`
				};
			});

			return renderSnippet(semesterSnippet, row.getValue('semester'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'assigned_subjects',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ScheduleTable, unknown>, {
				column,
				title: 'ASSIGNED SUBJECTS'
			});
		},
		cell: ({ row }) => {
			const assignedSubjectsSnippet = createRawSnippet<[string]>((getAssignedSubjects) => {
				const assignedSubjects = getAssignedSubjects();
				return {
					render: () => `<div class="w-full">${assignedSubjects}</div>`
				};
			});

			return renderSnippet(assignedSubjectsSnippet, row.getValue('assigned_subjects'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ScheduleTable, unknown>, {
				column,
				title: 'ACTION',
				class: 'flex justify-end'
			});
		},
		id: 'actions',
		cell: ({ row }) => renderComponent(RowActions<ScheduleTable>, { row })
	}
];
