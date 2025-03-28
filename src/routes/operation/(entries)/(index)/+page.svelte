<script lang="ts">
	import CustomTable from '$lib/components/general/custom-table/custom-table.svelte';
	import CreateDepartment from './(components)/(forms)/(create-department)/create-department.svelte';
	import UpdateDepartment from './(components)/(forms)/(update-department)/update-department.svelte';
	import DeleteDepartment from './(components)/(forms)/(delete-department)/delete-department.svelte';
	import { columns } from './(components)/(table)/column';

	const { data } = $props();
</script>

<main class="flex flex-col gap-4 p-4">
	<section>
		<CreateDepartment createDepForm={data.createDepForm} />
	</section>
	<section>
		<CustomTable
			{columns}
			data={[
				{
					id: crypto.randomUUID(),
					department_name: 'asdasdasd',
					department_code: 'aSD',
					department_color: '#000000'
				},
				{
					id: crypto.randomUUID(),
					department_name: 'asdasdasd',
					department_code: 'aSD',
					department_color: '#983230'
				}
			]}
		/>
	</section>
</main>

<UpdateDepartment updateDepForm={data.updateDepForm} />
<DeleteDepartment deleteDepForm={data.deleteDepForm} />
