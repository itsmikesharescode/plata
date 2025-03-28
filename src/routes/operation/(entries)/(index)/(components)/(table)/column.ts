import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { DepartmentTable } from './schema.js';
import RowActions from './components/row-actions.svelte';
import { HeaderColumn } from '$lib/components/general/custom-table/components/index.js';
import RowId from './components/row-id.svelte';

import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';

export const columns: ColumnDef<DepartmentTable>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<DepartmentTable, unknown>, {
				column,
				title: 'ID'
			});
		},
		cell: ({ row }) => renderComponent(RowId<DepartmentTable>, { row }),
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'department_name',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<DepartmentTable, unknown>, {
				column,
				title: 'DEPARTMENT NAME'
			});
		},
		cell: ({ row }) => {
			const nameSnippet = createRawSnippet<[string]>((getName) => {
				const name = getName();
				return {
					render: () => `<div class="w-full">${name}</div>`
				};
			});

			return renderSnippet(nameSnippet, row.getValue('department_name'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'department_code',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<DepartmentTable, unknown>, {
				column,
				title: 'DEPARTMENT CODE'
			});
		},
		cell: ({ row }) => {
			const codeSnippet = createRawSnippet<[string]>((getCode) => {
				const code = getCode();
				return {
					render: () => `<div class="w-[100px]">${code}</div>`
				};
			});

			return renderSnippet(codeSnippet, row.getValue('department_code'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'department_color',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<DepartmentTable, unknown>, {
				column,
				title: 'DEPARTMENT COLOR'
			});
		},
		cell: ({ row }) => {
			const colorSnippet = createRawSnippet<[string]>((getColor) => {
				const color = getColor();
				return {
					render: () =>
						`<div class="size-8 border-primary border-[1px] rounded-full" style="background-color: ${color};"></div>`
				};
			});

			return renderSnippet(colorSnippet, row.getValue('department_color'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		header: ({ column }) => {
			return renderComponent(HeaderColumn<DepartmentTable, unknown>, {
				column,
				title: 'ACTION',
				class: 'flex justify-end'
			});
		},
		id: 'actions',
		cell: ({ row }) => renderComponent(RowActions<DepartmentTable>, { row })
	}
];
