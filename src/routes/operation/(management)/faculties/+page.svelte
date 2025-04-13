<script lang="ts">
	import CustomTable from '$lib/components/general/custom-table/custom-table.svelte';
	import CreateFaculty from './(components)/(forms)/(create-faculty)/create-faculty.svelte';
	import UpdateFaculty from './(components)/(forms)/(update-faculty)/update-faculty.svelte';
	import DeleteFaculty from './(components)/(forms)/(delete-faculty)/delete-faculty.svelte';
	import { columns } from './(components)/(table)/column';
	import { page } from '$app/state';
	import { DepartmentFilter, type DepartmentDropdown } from '../../+layout.svelte';

	const { data } = $props();

	const departmentsDropdown = $derived(page.data.departmentsDropdown) as DepartmentDropdown;

	const department_id = $derived(page.url.searchParams.get('department_id') ?? undefined);
</script>

<main class="flex flex-col gap-4 p-4">
	<section class="flex flex-wrap items-center justify-between gap-4">
		<CreateFaculty createFacultyForm={data.createFacultyForm} />

		{@render DepartmentFilter({ departmentsDropdown, selected_id: department_id })}
	</section>
	<section>
		<CustomTable {columns} data={data.faculties ?? []} count={data.facultyCount} />
	</section>
</main>

<UpdateFaculty updateFacultyForm={data.updateFacultyForm} />
<DeleteFaculty deleteFacultyForm={data.deleteFacultyForm} />
