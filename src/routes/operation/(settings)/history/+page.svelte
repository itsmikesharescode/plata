<script lang="ts">
	import CustomTable from '$lib/components/general/custom-table/custom-table.svelte';
	import { columns } from './(components)/(table)/column';

	const { data } = $props();
</script>

<main class="flex flex-col gap-4 p-4">
	<section>
		<CustomTable
			{columns}
			data={[
				{
					id: crypto.randomUUID(),
					location_name: 'Faculties',
					cp_fullname: 'aSD',
					activity_type: 'DELETE'
				},
				{
					id: crypto.randomUUID(),
					location_name: 'Schedules',
					cp_fullname: 'aSD',
					activity_type: 'UPDATE'
				}
			]}
		/>
	</section>
</main>
