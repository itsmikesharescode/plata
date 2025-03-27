<script lang="ts">
	import CustomTable from '$lib/components/general/custom-table/custom-table.svelte';
	import CreateFaculty from './(components)/(forms)/(create-faculty)/create-faculty.svelte';
	import UpdateFaculty from './(components)/(forms)/(update-faculty)/update-faculty.svelte';
	import DeleteFaculty from './(components)/(forms)/(delete-faculty)/delete-faculty.svelte';
	import { columns } from './(components)/(table)/column';

	const { data } = $props();
</script>

<main class="flex flex-col gap-4 p-4">
	<section>
		<CreateFaculty createFacultyForm={data.createFacultyForm} />
	</section>
	<section>
		<CustomTable
			{columns}
			data={[
				{
					id: crypto.randomUUID(),
					department_id: 'asdasdasd',
					fullname: 'aSD',
					academic_rank: 'asdasdasd',
					status: 'asdasdasd'
				},
				{
					id: crypto.randomUUID(),
					department_id: 'asdasdasd',
					fullname: 'aSD',
					academic_rank: 'asdasdasd',
					status: 'asdasdasd'
				}
			]}
		/>
	</section>
</main>

<UpdateFaculty updateFacultyForm={data.updateFacultyForm} />
<DeleteFaculty deleteFacultyForm={data.deleteFacultyForm} />
