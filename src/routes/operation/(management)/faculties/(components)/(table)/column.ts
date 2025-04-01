import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { FacultyTable } from './schema.js';
import RowActions from './components/row-actions.svelte';
import { HeaderColumn } from '$lib/components/general/custom-table/components/index.js';
import RowId from './components/row-id.svelte';
import RowDepartment from './components/row-department.svelte';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';

export const columns: ColumnDef<FacultyTable>[] = [
	{
		accessorKey: 'ID',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<FacultyTable, unknown>, {
				column,
				title: 'ID'
			});
		},
		cell: ({ row }) => renderComponent(RowId<FacultyTable>, { row }),
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'department_id',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<FacultyTable, unknown>, {
				column,
				title: 'DEPARTMENT'
			});
		},
		cell: ({ row }) => renderComponent(RowDepartment<FacultyTable>, { row }),
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'fullname',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<FacultyTable, unknown>, {
				column,
				title: 'FULLNAME'
			});
		},
		cell: ({ row }) => {
			const fullnameSnippet = createRawSnippet<[string]>((getFullname) => {
				const fullname = getFullname();
				return {
					render: () => `<div class="w-[100px]">${fullname}</div>`
				};
			});

			return renderSnippet(fullnameSnippet, row.getValue('fullname'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'academic_rank',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<FacultyTable, unknown>, {
				column,
				title: 'ACADEMIC RANK'
			});
		},
		cell: ({ row }) => {
			const academicRankSnippet = createRawSnippet<[string]>((getAcademicRank) => {
				const academicRank = getAcademicRank();
				return {
					render: () => `<div class="w-full">${academicRank}</div>`
				};
			});

			return renderSnippet(academicRankSnippet, row.getValue('academic_rank'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'employment_status',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<FacultyTable, unknown>, {
				column,
				title: 'EMPLOYMENT STATUS'
			});
		},
		cell: ({ row }) => {
			const employmentStatusSnippet = createRawSnippet<[string]>((getEmploymentStatus) => {
				const employmentStatus = getEmploymentStatus();
				return {
					render: () => `<div class="w-full">${employmentStatus}</div>`
				};
			});

			return renderSnippet(employmentStatusSnippet, row.getValue('employment_status'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		header: ({ column }) => {
			return renderComponent(HeaderColumn<FacultyTable, unknown>, {
				column,
				title: 'ACTION',
				class: 'flex justify-end'
			});
		},
		id: 'actions',
		cell: ({ row }) => renderComponent(RowActions<FacultyTable>, { row })
	}
];
