import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { ClassroomTable } from './schema.js';
import RowActions from './components/row-actions.svelte';
import { HeaderColumn } from '$lib/components/general/custom-table/components/index.js';
import RowId from './components/row-id.svelte';

import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';

export const columns: ColumnDef<ClassroomTable>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ClassroomTable, unknown>, {
				column,
				title: 'ID'
			});
		},
		cell: ({ row }) => renderComponent(RowId<ClassroomTable>, { row }),
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'department_id',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ClassroomTable, unknown>, {
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
		accessorKey: 'classroom_name',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ClassroomTable, unknown>, {
				column,
				title: 'CLASSROOM NAME'
			});
		},
		cell: ({ row }) => {
			const classroomNameSnippet = createRawSnippet<[string]>((getClassroomName) => {
				const classroomName = getClassroomName();
				return {
					render: () => `<div class="w-full">${classroomName}</div>`
				};
			});

			return renderSnippet(classroomNameSnippet, row.getValue('classroom_name'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'building_name',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ClassroomTable, unknown>, {
				column,
				title: 'BUILDING NAME'
			});
		},
		cell: ({ row }) => {
			const buildingSnippet = createRawSnippet<[string]>((getBuilding) => {
				const building = getBuilding();
				return {
					render: () => `<div class="w-[100px]">${building}</div>`
				};
			});

			return renderSnippet(buildingSnippet, row.getValue('building_name'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		header: ({ column }) => {
			return renderComponent(HeaderColumn<ClassroomTable, unknown>, {
				column,
				title: 'ACTION',
				class: 'flex justify-end'
			});
		},
		id: 'actions',
		cell: ({ row }) => renderComponent(RowActions<ClassroomTable>, { row })
	}
];
