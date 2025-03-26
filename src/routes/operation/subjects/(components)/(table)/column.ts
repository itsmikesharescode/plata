import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { SubjectTable } from './schema.js';
import RowActions from './components/row-actions.svelte';
import { HeaderColumn } from '$lib/components/general/custom-table/components/index.js';
import RowId from './components/row-id.svelte';

import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';

export const columns: ColumnDef<SubjectTable>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<SubjectTable, unknown>, {
				column,
				title: 'ID'
			});
		},
		cell: ({ row }) => renderComponent(RowId<SubjectTable>, { row }),
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'name',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<SubjectTable, unknown>, {
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
			return renderComponent(HeaderColumn<SubjectTable, unknown>, {
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
		accessorKey: 'description',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<SubjectTable, unknown>, {
				column,
				title: 'DESCRIPTION'
			});
		},
		cell: ({ row }) => {
			const descriptionSnippet = createRawSnippet<[string]>((getDescription) => {
				const description = getDescription();
				return {
					render: () => `<div class="w-full">${description}</div>`
				};
			});

			return renderSnippet(descriptionSnippet, row.getValue('description'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		header: ({ column }) => {
			return renderComponent(HeaderColumn<SubjectTable, unknown>, {
				column,
				title: 'ACTION',
				class: 'flex justify-end'
			});
		},
		id: 'actions',
		cell: ({ row }) => renderComponent(RowActions<SubjectTable>, { row })
	}
];
