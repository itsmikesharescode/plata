<script lang="ts">
	import CustomTable from '$lib/components/general/custom-table/custom-table.svelte';
	import CreateYns from './(components)/(forms)/(create-yns)/create-yns.svelte';
	import UpdateYns from './(components)/(forms)/(update-yns)/update-yns.svelte';
	import DeleteYns from './(components)/(forms)/(delete-yns)/delete-yns.svelte';
	import { columns } from './(components)/(table)/column';

	const { data } = $props();
</script>

<main class="flex flex-col gap-4 p-4">
	<section>
		<CreateYns createYnsForm={data.createYnsForm} />
	</section>
	<section>
		<CustomTable
			{columns}
			data={[
				{
					id: crypto.randomUUID(),
					year: 'asdasdasd',
					section: 'aSD'
				},
				{
					id: crypto.randomUUID(),
					year: 'asdasdasd',
					section: 'aSD'
				}
			]}
		/>
	</section>
</main>

<UpdateYns updateYnsForm={data.updateYnsForm} />
<DeleteYns deleteYnsForm={data.deleteYnsForm} />
