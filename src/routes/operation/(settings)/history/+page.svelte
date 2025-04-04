<script lang="ts" module>
</script>

<script lang="ts">
	import CustomTable from '$lib/components/general/custom-table/custom-table.svelte';
	import { columns } from './(components)/(table)/column';

	const { data } = $props();
</script>

<main class="flex flex-col gap-4 p-4">
	<section>
		<CustomTable {columns} data={data.histories ?? []} count={data.historyCount} />
	</section>
</main>
