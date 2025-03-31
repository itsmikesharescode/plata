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
			data={data.users?.map((v) => ({
				user_id: v.user_id,
				department_id: v.user_meta_data.department_id,
				program_id: v.user_meta_data.program_id,
				email: v.user_meta_data.email,
				fullname: v.user_meta_data.fullname,
				academic_rank: v.user_meta_data.academic_rank,
				employment_status: v.user_meta_data.employment_status
			})) ?? []}
		/>
	</section>
</main>

<UpdatingCp
	updateChairpersonEmailForm={data.updateChairpersonEmailForm}
	updateChairpersonInfoForm={data.updateChairpersonInfoForm}
	updateChairpersonPwdForm={data.updateChairpersonPwdForm}
/>
<DeleteChairperson deleteChairpersonForm={data.deleteChairpersonForm} />
