<script lang="ts">
	import CustomTable from '$lib/components/general/custom-table/custom-table.svelte';
	import CreateSubject from './(components)/(forms)/(create-subject)/create-subject.svelte';
	import UpdateSubject from './(components)/(forms)/(update-subject)/update-subject.svelte';
	import DeleteSubject from './(components)/(forms)/(delete-subject)/delete-subject.svelte';
	import { columns } from './(components)/(table)/column';

	const { data } = $props();
</script>

<main class="flex flex-col gap-4 p-4">
	<section>
		<CreateSubject createSubForm={data.createSubForm} />
	</section>
	<section>
		<CustomTable
			{columns}
			data={[
				{
					id: crypto.randomUUID(),
					course_name: 'asdasdasd',
					course_code: 'aSD',
					lecture_hours: 1,
					lab_hours: 1,
					unit: 1
				},
				{
					id: crypto.randomUUID(),
					course_name: 'asdasdasd',
					course_code: 'aSD',
					lecture_hours: 1,
					lab_hours: 1,
					unit: 1
				}
			]}
		/>
	</section>
</main>

<UpdateSubject updateSubForm={data.updateSubForm} />
<DeleteSubject deleteSubForm={data.deleteSubForm} />
