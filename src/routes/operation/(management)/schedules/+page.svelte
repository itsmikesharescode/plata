<script lang="ts">
	import CustomTable from '$lib/components/general/custom-table/custom-table.svelte';
	import CreateSchedule from './(components)/(forms)/(create-schedule)/create-schedule.svelte';
	import DeleteSchedule from './(components)/(forms)/(delete-schedule)/delete-schedule.svelte';
	import UpdateSchedule from './(components)/(forms)/(update-schedule)/update-schedule.svelte';
	import { columns } from './(components)/(table)/column';
	import Printing from './(components)/(toolbars)/(printing)/printing.svelte';
	import { initPrintingState } from './(components)/(toolbars)/(printing)/state.svelte';
	import { page } from '$app/state';
	import { DepartmentFilter, type DepartmentDropdown } from '../../+layout.svelte';

	const { data } = $props();

	initPrintingState();

	const departmentsDropdown = $derived(page.data.departmentsDropdown) as DepartmentDropdown;

	const department_id = $derived(page.url.searchParams.get('department_id') ?? undefined);
</script>

<main class="flex flex-col gap-4 p-4">
	<section class="flex flex-wrap items-center justify-between gap-4">
		<div class="">
			<CreateSchedule createScheduleForm={data.createScheduleForm} />
			<Printing />
		</div>

		{@render DepartmentFilter({ departmentsDropdown, selected_id: department_id })}
	</section>
	<section>
		<CustomTable {columns} data={data.schedules ?? []} />
	</section>
</main>

<UpdateSchedule updateScheduleForm={data.updateScheduleForm} />
<DeleteSchedule deleteScheduleForm={data.deleteScheduleForm} />
