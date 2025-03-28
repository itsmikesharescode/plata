<script lang="ts">
	import CustomTable from '$lib/components/general/custom-table/custom-table.svelte';
	import CreateSchedule from './(components)/(forms)/(create-schedule)/create-schedule.svelte';
	import DeleteSchedule from './(components)/(forms)/(delete-schedule)/delete-schedule.svelte';
	import UpdateSchedule from './(components)/(forms)/(update-schedule)/update-schedule.svelte';
	import { columns } from './(components)/(table)/column';

	const { data } = $props();

	//TODO: implement update chairperson form
</script>

<main class="flex flex-col gap-4 p-4">
	<section>
		<CreateSchedule createScheduleForm={data.createScheduleForm} />
	</section>
	<section>
		<CustomTable
			{columns}
			data={[
				{
					id: crypto.randomUUID(),
					faculty_id: crypto.randomUUID(),
					department_id: 'asdasdasd',
					program_id: 'asdasdasd',
					year_and_section_id: 'asdasdasd',
					semester: 'asdasdasd',
					assigned_subjects: [
						{
							subject_id: 'asdasdasd',
							classroom_id: 'asdasdasd',
							start_time: 'asdasdasd',
							end_time: 'asdasdasd',
							day: 'asdasdasd'
						}
					]
				},
				{
					id: crypto.randomUUID(),
					faculty_id: crypto.randomUUID(),
					department_id: 'asdasdasd',
					program_id: 'asdasdasd',
					year_and_section_id: 'asdasdasd',
					semester: 'asdasdasd',
					assigned_subjects: [
						{
							subject_id: 'asdasdasd',
							classroom_id: 'asdasdasd',
							start_time: 'asdasdasd',
							end_time: 'asdasdasd',
							day: 'asdasdasd'
						}
					]
				}
			]}
		/>
	</section>
</main>

<UpdateSchedule updateScheduleForm={data.updateScheduleForm} />
<DeleteSchedule deleteScheduleForm={data.deleteScheduleForm} />
