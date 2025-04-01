import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { HistoryTable } from './schema.js';
import RowActions from './components/row-actions.svelte';
import { HeaderColumn } from '$lib/components/general/custom-table/components/index.js';
import RowId from './components/row-id.svelte';

import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';

export const columns: ColumnDef<HistoryTable>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<HistoryTable, unknown>, {
				column,
				title: 'ID'
			});
		},
		cell: ({ row }) => renderComponent(RowId<HistoryTable>, { row }),
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'tb_location',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<HistoryTable, unknown>, {
				column,
				title: 'LOCATION'
			});
		},
		cell: ({ row }) => {
			const locationSnippet = createRawSnippet<[string]>((getLocation) => {
				const location = getLocation();
				return {
					render: () => `<div class="w-full">${location}</div>`
				};
			});

			return renderSnippet(locationSnippet, row.getValue('tb_location'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'user_id',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<HistoryTable, unknown>, {
				column,
				title: 'FULLNAME'
			});
		},
		cell: ({ row }) => {
			const getUserId = createRawSnippet<[string]>((getUserId) => {
				const userId = getUserId();
				return {
					render: () => `<div class="w-[100px]">${userId}</div>`
				};
			});

			return renderSnippet(getUserId, row.getValue('user_id'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'action_type',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<HistoryTable, unknown>, {
				column,
				title: 'TYPE'
			});
		},
		cell: ({ row }) => {
			const actionSnippet = createRawSnippet<[string]>((getAction) => {
				const action = getAction();
				return {
					render: () => `<div class="w-[100px]">${action}</div>`
				};
			});

			return renderSnippet(actionSnippet, row.getValue('action_type'));
		},
		enableSorting: true,
		enableHiding: true
	}
];
