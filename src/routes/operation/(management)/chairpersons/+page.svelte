<script lang="ts">
	import CustomTable from '$lib/components/general/custom-table/custom-table.svelte';
	import CreateChairperson from './(components)/(forms)/(create-cp)/create-cp.svelte';
	import DeleteChairperson from './(components)/(forms)/(delete-cp)/delete-cp.svelte';
	import UpdatingCp from './(components)/(forms)/(updating-cp)/updating-cp.svelte';
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
					user_id: crypto.randomUUID(),
					department_id: 'asdasdasd',
					email: 'asdasdasd',
					fullname: 'aSD',
					academic_rank: 'asdasdasd',
					status: 'asdasdasd'
				},
				{
					user_id: crypto.randomUUID(),
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

<UpdatingCp
	updateChairpersonEmailForm={data.updateChairpersonEmailForm}
	updateChairpersonInfoForm={data.updateChairpersonInfoForm}
	updateChairpersonPwdForm={data.updateChairpersonPwdForm}
/>
<DeleteChairperson deleteChairpersonForm={data.deleteChairpersonForm} />
