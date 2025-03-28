<script lang="ts">
	import CustomTable from '$lib/components/general/custom-table/custom-table.svelte';
	import CreateClassroom from './(components)/(forms)/(create-classroom)/create-classroom.svelte';
	import UpdateClassroom from './(components)/(forms)/(update-classroom)/update-classroom.svelte';
	import DeleteClassroom from './(components)/(forms)/(delete-classroom)/delete-classroom.svelte';
	import { columns } from './(components)/(table)/column';

	const { data } = $props();
</script>

<main class="flex flex-col gap-4 p-4">
	<section>
		<CreateClassroom createClassroomForm={data.createClassroomForm} />
	</section>
	<section>
		<CustomTable
			{columns}
			data={[
				{
					id: crypto.randomUUID(),
					classroom_name: 'asdasdasd',
					building_name: 'aSD',
					department_id: 'asdasdasd'
				},
				{
					id: crypto.randomUUID(),
					classroom_name: 'asdasdasd',
					building_name: 'aSD',
					department_id: 'asdasdasd'
				}
			]}
		/>
	</section>
</main>

<UpdateClassroom updateClassroomForm={data.updateClassroomForm} />
<DeleteClassroom deleteClassroomForm={data.deleteClassroomForm} />
