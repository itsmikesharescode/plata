<script lang="ts">
	import CustomTable from '$lib/components/general/custom-table/custom-table.svelte';
	import CreateProgram from './(components)/(forms)/(create-program)/create-program.svelte';
	import UpdateProgram from './(components)/(forms)/(update-program)/update-program.svelte';
	import DeleteProgram from './(components)/(forms)/(delete-program)/delete-program.svelte';
	import { columns } from './(components)/(table)/column';

	const { data } = $props();
</script>

<main class="flex flex-col gap-4 p-4">
	<section>
		<CreateProgram createProgramForm={data.createProgramForm} />
	</section>
	<section>
		<CustomTable
			{columns}
			data={[
				{
					id: crypto.randomUUID(),
					program_name: 'asdasdasd',
					program_code: 'aSD',
					department_id: 'asdasdasd'
				},
				{
					id: crypto.randomUUID(),
					program_name: 'asdasdasd',
					program_code: 'aSD',
					department_id: 'asdasdasd'
				}
			]}
		/>
	</section>
</main>

<UpdateProgram updateProgramForm={data.updateProgramForm} />
<DeleteProgram deleteProgramForm={data.deleteProgramForm} />
