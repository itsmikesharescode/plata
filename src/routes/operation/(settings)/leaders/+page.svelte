<script lang="ts">
	import Mode from './(components)/(forms)/(mode)/mode.svelte';
	const { data } = $props();

	//TODO: PERFORM AN UPDATE ENDPOINT
</script>

<div class="flex max-w-sm flex-col gap-4 p-5">
	{#key data.leaders}
		<Mode
			placeholder="University President"
			mode="president"
			data={data.updatePresident}
			value={{
				id: data?.leaders?.[0]?.id ?? '',
				fullname: data?.leaders?.[0]?.univ_president ?? ''
			}}
		/>

		<Mode
			placeholder="University Registrar"
			mode="registrar"
			data={data.updateRegistrar}
			value={{
				id: data?.leaders?.[0]?.id ?? '',
				fullname: data?.leaders?.[0]?.univ_registrar ?? ''
			}}
		/>

		<Mode
			placeholder="Program Chairperson"
			mode="program-chair"
			data={data.updateProgramChair}
			value={{
				id: data?.leaders?.[0]?.id ?? '',
				fullname: data?.leaders?.[0]?.program_chairperson ?? ''
			}}
		/>

		<Mode
			placeholder="Vice President for Academic Affairs"
			mode="vp-academic"
			data={data.updateVicePresidentAcademic}
			value={{
				id: data?.leaders?.[0]?.id ?? '',
				fullname: data?.leaders?.[0]?.vp_academic_affairs ?? ''
			}}
		/>
	{/key}
</div>
