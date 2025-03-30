import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { YnsTable } from './schema.js';
import RowActions from './components/row-actions.svelte';
import { HeaderColumn } from '$lib/components/general/custom-table/components/index.js';
import RowId from './components/row-id.svelte';

import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';

export const columns: ColumnDef<YnsTable>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<YnsTable, unknown>, {
				column,
				title: 'ID'
			});
		},
		cell: ({ row }) => renderComponent(RowId<YnsTable>, { row }),
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'year',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<YnsTable, unknown>, {
				column,
				title: 'YEAR'
			});
		},
		cell: ({ row }) => {
			const yearSnippet = createRawSnippet<[string]>((getYear) => {
				const year = getYear();
				return {
					render: () => `<div class="w-full">${year}</div>`
				};
			});

			return renderSnippet(yearSnippet, row.getValue('year'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'section',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<YnsTable, unknown>, {
				column,
				title: 'SECTION'
			});
		},
		cell: ({ row }) => {
			const sectionSnippet = createRawSnippet<[string]>((getSection) => {
				const section = getSection();
				return {
					render: () => `<div class="w-full">${section}</div>`
				};
			});

			return renderSnippet(sectionSnippet, row.getValue('section'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		header: ({ column }) => {
			return renderComponent(HeaderColumn<YnsTable, unknown>, {
				column,
				title: 'ACTION',
				class: 'flex justify-end'
			});
		},
		id: 'actions',
		cell: ({ row }) => renderComponent(RowActions<YnsTable>, { row })
	}
];
