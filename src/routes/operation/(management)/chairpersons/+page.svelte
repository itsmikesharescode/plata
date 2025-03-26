<script lang="ts">
	import CustomTable from '$lib/components/general/custom-table/custom-table.svelte';
	import CreateChairperson from './(components)/(forms)/(create-cp)/create-cp.svelte';
	import DeleteChairperson from './(components)/(forms)/(delete-cp)/delete-cp.svelte';
	import { columns } from './(components)/(table)/column';

	const { data } = $props();

	//TODO: implement update chairperson form
</script>

<main class="flex flex-col gap-4 p-4">
	<section>
		<CreateChairperson createChairpersonForm={data.createChairpersonForm} />
	</section>
	<section>
		<CustomTable
			{columns}
			data={[
				{
					id: crypto.randomUUID(),
					department_id: 'asdasdasd',
					email: 'asdasdasd',
					fullname: 'aSD',
					academic_rank: 'asdasdasd',
					status: 'asdasdasd'
				},
				{
					id: crypto.randomUUID(),
					department_id: 'asdasdasd',
					email: 'asdasdasd',
					fullname: 'aSD',
					academic_rank: 'asdasdasd',
					status: 'asdasdasd'
				}
			]}
		/>
	</section>
</main>

<DeleteChairperson deleteChairpersonForm={data.deleteChairpersonForm} />
