import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { ProgramTable } from './schema.js';
import RowActions from './components/row-actions.svelte';
import { HeaderColumn } from '$lib/components/general/custom-table/components/index.js';
import RowId from './components/row-id.svelte';

import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';

export const columns: ColumnDef<ProgramTable>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ProgramTable, unknown>, {
				column,
				title: 'ID'
			});
		},
		cell: ({ row }) => renderComponent(RowId<ProgramTable>, { row }),
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'department_id',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ProgramTable, unknown>, {
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
		accessorKey: 'name',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ProgramTable, unknown>, {
				column,
				title: 'NAME'
			});
		},
		cell: ({ row }) => {
			const nameSnippet = createRawSnippet<[string]>((getName) => {
				const name = getName();
				return {
					render: () => `<div class="w-full">${name}</div>`
				};
			});

			return renderSnippet(nameSnippet, row.getValue('name'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'code',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ProgramTable, unknown>, {
				column,
				title: 'CODE'
			});
		},
		cell: ({ row }) => {
			const codeSnippet = createRawSnippet<[string]>((getCode) => {
				const code = getCode();
				return {
					render: () => `<div class="w-[100px]">${code}</div>`
				};
			});

			return renderSnippet(codeSnippet, row.getValue('code'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ProgramTable, unknown>, {
				column,
				title: 'ACTION',
				class: 'flex justify-end'
			});
		},
		id: 'actions',
		cell: ({ row }) => renderComponent(RowActions<ProgramTable>, { row })
	}
];
