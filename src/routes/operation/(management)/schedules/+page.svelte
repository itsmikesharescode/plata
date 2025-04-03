<script lang="ts">
	import CustomTable from '$lib/components/general/custom-table/custom-table.svelte';
	import CreateSchedule from './(components)/(forms)/(create-schedule)/create-schedule.svelte';
	import DeleteSchedule from './(components)/(forms)/(delete-schedule)/delete-schedule.svelte';
	import UpdateSchedule from './(components)/(forms)/(update-schedule)/update-schedule.svelte';
	import { columns } from './(components)/(table)/column';
	import Printing from './(components)/(toolbars)/(printing)/printing.svelte';
	const { data } = $props();

	//TODO: implement update chairperson form
</script>

<main class="flex flex-col gap-4 p-4">
	<section class="flex items-center justify-between gap-4">
		<CreateSchedule createScheduleForm={data.createScheduleForm} />
		<Printing />
	</section>
	<section>
		<CustomTable {columns} data={data.schedules ?? []} />
	</section>
</main>

<UpdateSchedule updateScheduleForm={data.updateScheduleForm} />
<DeleteSchedule deleteScheduleForm={data.deleteScheduleForm} />
