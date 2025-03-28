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
		accessorKey: 'location_name',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<HistoryTable, unknown>, {
				column,
				title: 'LOCATION NAME'
			});
		},
		cell: ({ row }) => {
			const locationSnippet = createRawSnippet<[string]>((getLocation) => {
				const location = getLocation();
				return {
					render: () => `<div class="w-full">${location}</div>`
				};
			});

			return renderSnippet(locationSnippet, row.getValue('location_name'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'cp_fullname',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<HistoryTable, unknown>, {
				column,
				title: 'FULLNAME'
			});
		},
		cell: ({ row }) => {
			const fullnameSnippet = createRawSnippet<[string]>((getFullName) => {
				const fullname = getFullName();
				return {
					render: () => `<div class="w-[100px]">${fullname}</div>`
				};
			});

			return renderSnippet(fullnameSnippet, row.getValue('cp_fullname'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'activity_type',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<HistoryTable, unknown>, {
				column,
				title: 'ACTIVITY TYPE'
			});
		},
		cell: ({ row }) => {
			const activitySnippet = createRawSnippet<[string]>((getActivity) => {
				const activity = getActivity();
				return {
					render: () => `<div class="w-[100px]">${activity}</div>`
				};
			});

			return renderSnippet(activitySnippet, row.getValue('activity_type'));
		},
		enableSorting: true,
		enableHiding: true
	}
];
