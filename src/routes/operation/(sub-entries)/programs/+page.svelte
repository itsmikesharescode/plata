<script lang="ts">
	import CustomTable from '$lib/components/general/custom-table/custom-table.svelte';
	import CreateProgram from './(components)/(forms)/(create-program)/create-program.svelte';
	import UpdateProgram from './(components)/(forms)/(update-program)/update-program.svelte';
	import DeleteProgram from './(components)/(forms)/(delete-program)/delete-program.svelte';
	import { columns } from './(components)/(table)/column';
	import { page } from '$app/state';
	import { DepartmentFilter, type DepartmentDropdown } from '../../+layout.svelte';

	const { data } = $props();

	const departmentsDropdown = $derived(page.data.departmentsDropdown) as DepartmentDropdown;

	const department_id = $derived(page.url.searchParams.get('department_id') ?? undefined);
</script>

<main class="flex flex-col gap-4 p-4">
	<section class="flex flex-wrap items-center justify-between gap-4">
		<CreateProgram createProgramForm={data.createProgramForm} />

		{@render DepartmentFilter({ departmentsDropdown, selected_id: department_id })}
	</section>
	<section>
		<CustomTable {columns} data={data.programs ?? []} count={data.programCount} />
	</section>
</main>

<UpdateProgram updateProgramForm={data.updateProgramForm} />
<DeleteProgram deleteProgramForm={data.deleteProgramForm} />
