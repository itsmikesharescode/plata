import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { ChairpersonTable } from './schema.js';
import RowActions from './components/row-actions.svelte';
import { HeaderColumn } from '$lib/components/general/custom-table/components/index.js';
import RowId from './components/row-id.svelte';

import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';

export const columns: ColumnDef<ChairpersonTable>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ChairpersonTable, unknown>, {
				column,
				title: 'ID'
			});
		},
		cell: ({ row }) => renderComponent(RowId<ChairpersonTable>, { row }),
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'department_id',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ChairpersonTable, unknown>, {
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
		accessorKey: 'email',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ChairpersonTable, unknown>, {
				column,
				title: 'EMAIL'
			});
		},
		cell: ({ row }) => {
			const emailSnippet = createRawSnippet<[string]>((getEmail) => {
				const email = getEmail();
				return {
					render: () => `<div class="w-full">${email}</div>`
				};
			});

			return renderSnippet(emailSnippet, row.getValue('email'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'fullname',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ChairpersonTable, unknown>, {
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
			return renderComponent(HeaderColumn<ChairpersonTable, unknown>, {
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
		accessorKey: 'status',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ChairpersonTable, unknown>, {
				column,
				title: 'STATUS'
			});
		},
		cell: ({ row }) => {
			const statusSnippet = createRawSnippet<[string]>((getStatus) => {
				const status = getStatus();
				return {
					render: () => `<div class="w-full">${status}</div>`
				};
			});

			return renderSnippet(statusSnippet, row.getValue('status'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ChairpersonTable, unknown>, {
				column,
				title: 'ACTION',
				class: 'flex justify-end'
			});
		},
		id: 'actions',
		cell: ({ row }) => renderComponent(RowActions<ChairpersonTable>, { row })
	}
];
