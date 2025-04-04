import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { ScheduleTable } from './schema.js';
import { HeaderColumn } from '$lib/components/general/custom-table/components/index.js';
import {
	RowActions,
	RowDepartment,
	RowFaculty,
	RowId,
	RowProgram,
	RowYns,
	RowAssignedSub
} from './components/index.js';

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
		cell: ({ row }) => renderComponent(RowDepartment<ScheduleTable>, { row }),
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
		cell: ({ row }) => renderComponent(RowProgram<ScheduleTable>, { row }),
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
		cell: ({ row }) => renderComponent(RowFaculty<ScheduleTable>, { row }),
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
		cell: ({ row }) => renderComponent(RowYns<ScheduleTable>, { row }),
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
		cell: ({ row }) => renderComponent(RowAssignedSub<ScheduleTable>, { row }),
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
