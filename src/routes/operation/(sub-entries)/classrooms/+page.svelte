<script lang="ts">
	import CustomTable from '$lib/components/general/custom-table/custom-table.svelte';
	import CreateClassroom from './(components)/(forms)/(create-classroom)/create-classroom.svelte';
	import UpdateClassroom from './(components)/(forms)/(update-classroom)/update-classroom.svelte';
	import DeleteClassroom from './(components)/(forms)/(delete-classroom)/delete-classroom.svelte';
	import { columns } from './(components)/(table)/column';
	import { page } from '$app/state';
	import { DepartmentFilter, type DepartmentDropdown } from '../../+layout.svelte';

	const { data } = $props();

	const departmentsDropdown = $derived(page.data.departmentsDropdown) as DepartmentDropdown;

	const department_id = $derived(page.url.searchParams.get('department_id') ?? undefined);
</script>

<main class="flex flex-col gap-4 p-4">
	<section class="flex flex-wrap items-center justify-between gap-4">
		<CreateClassroom createClassroomForm={data.createClassroomForm} />

		{@render DepartmentFilter({ departmentsDropdown, selected_id: department_id })}
	</section>
	<section>
		<CustomTable {columns} data={data.classrooms ?? []} count={data.classroomCount ?? 0} />
	</section>
</main>

<UpdateClassroom updateClassroomForm={data.updateClassroomForm} />
<DeleteClassroom deleteClassroomForm={data.deleteClassroomForm} />
