import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { ProgramTable } from './schema.js';
import RowActions from './components/row-actions.svelte';
import { HeaderColumn } from '$lib/components/general/custom-table/components/index.js';
import RowId from './components/row-id.svelte';
import RowDepartment from './components/row-department.svelte';

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
		cell: ({ row }) => renderComponent(RowDepartment<ProgramTable>, { row }),
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'program_name',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ProgramTable, unknown>, {
				column,
				title: 'PROGRAM NAME'
			});
		},
		cell: ({ row }) => {
			const programNameSnippet = createRawSnippet<[string]>((getProgramName) => {
				const programName = getProgramName();
				return {
					render: () => `<div class="w-full">${programName}</div>`
				};
			});

			return renderSnippet(programNameSnippet, row.getValue('program_name'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'program_code',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ProgramTable, unknown>, {
				column,
				title: 'PROGRAM CODE'
			});
		},
		cell: ({ row }) => {
			const codeSnippet = createRawSnippet<[string]>((getCode) => {
				const code = getCode();
				return {
					render: () => `<div class="w-[100px]">${code}</div>`
				};
			});

			return renderSnippet(codeSnippet, row.getValue('program_code'));
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
