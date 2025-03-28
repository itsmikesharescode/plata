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
		accessorKey: 'course_name',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<SubjectTable, unknown>, {
				column,
				title: 'COURSE NAME'
			});
		},
		cell: ({ row }) => {
			const courseNameSnippet = createRawSnippet<[string]>((getCourseName) => {
				const courseName = getCourseName();
				return {
					render: () => `<div class="w-full">${courseName}</div>`
				};
			});

			return renderSnippet(courseNameSnippet, row.getValue('course_name'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'course_code',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<SubjectTable, unknown>, {
				column,
				title: 'COURSE CODE'
			});
		},
		cell: ({ row }) => {
			const courseCodeSnippet = createRawSnippet<[string]>((getCourseCode) => {
				const courseCode = getCourseCode();
				return {
					render: () => `<div class="w-[100px]">${courseCode}</div>`
				};
			});

			return renderSnippet(courseCodeSnippet, row.getValue('course_code'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'lecture_hours',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<SubjectTable, unknown>, {
				column,
				title: 'LECTURE HOURS'
			});
		},
		cell: ({ row }) => {
			const lectureHoursSnippet = createRawSnippet<[number]>((getLectureHours) => {
				const lectureHours = getLectureHours();
				return {
					render: () => `<div class="w-full">${lectureHours}</div>`
				};
			});

			return renderSnippet(lectureHoursSnippet, row.getValue('lecture_hours'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'lab_hours',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<SubjectTable, unknown>, {
				column,
				title: 'LAB HOURS'
			});
		},
		cell: ({ row }) => {
			const labHoursSnippet = createRawSnippet<[number]>((getLabHours) => {
				const labHours = getLabHours();
				return {
					render: () => `<div class="w-full">${labHours}</div>`
				};
			});

			return renderSnippet(labHoursSnippet, row.getValue('lab_hours'));
		},
		enableSorting: true,
		enableHiding: true
	},

	{
		accessorKey: 'unit',
		header: ({ column }) => {
			return renderComponent(HeaderColumn<SubjectTable, unknown>, {
				column,
				title: 'UNIT'
			});
		},
		cell: ({ row }) => {
			const unitSnippet = createRawSnippet<[number]>((getUnit) => {
				const unit = getUnit();
				return {
					render: () => `<div class="w-full">${unit}</div>`
				};
			});

			return renderSnippet(unitSnippet, row.getValue('unit'));
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
