<script lang="ts" module>
	import CustomTable from '$lib/components/general/custom-table/custom-table.svelte';
	import CreateDepartment from './(components)/(forms)/(create-department)/create-department.svelte';
	import UpdateDepartment from './(components)/(forms)/(update-department)/update-department.svelte';
	import DeleteDepartment from './(components)/(forms)/(delete-department)/delete-department.svelte';
	import { page } from '$app/state';
</script>

<script lang="ts">
	import { columns } from './(components)/(table)/column';
	import { untrack } from 'svelte';

	const { data } = $props();
</script>

<main class="flex flex-col gap-4 p-4">
	<section>
		<CreateDepartment createDepForm={data.createDepForm} />
	</section>
	<section class="flex flex-col gap-4">
		<CustomTable {columns} data={data.departments ?? []} count={data.departmentCount} />
	</section>
</main>

<UpdateDepartment updateDepForm={data.updateDepForm} />
<DeleteDepartment deleteDepForm={data.deleteDepForm} />
