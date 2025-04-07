<script lang="ts" module>
	import { page } from '$app/state';
	import { untrack } from 'svelte';

	const getProgram = async (program_id: string) => {
		if (!page.data.supabase) return null;
		const { data, error } = await page.data.supabase
			.from('programs_tb')
			.select('*')
			.eq('id', program_id)
			.single();

		if (error) return null;

		return data;
	};
</script>

<script lang="ts">
	const user = $derived(page.data.user);

	let program = $state<Awaited<ReturnType<typeof getProgram>> | null>(null);

	$effect(() => {
		untrack(() => {
			if (user?.user_metadata.role === 'chair') {
				getProgram(user?.user_metadata.program_id).then((data) => {
					program = data;
				});
			}
		});
	});
</script>

<header class="flex items-center gap-2">
	<img src="../favicon.png" alt="logo" class="size-8" />

	{#if user?.user_metadata.role === 'admin'}
		<div class="grid flex-1 text-left text-sm leading-tight">
			<span class="truncate text-sm font-semibold">ADMIN ({user.user_metadata.fullname})</span>
			<span class="truncate text-xs font-bold text-muted-foreground"> MANAGEMENT </span>
		</div>
	{:else if user?.user_metadata.role === 'chair'}
		<div class="grid flex-1 text-left text-sm leading-tight">
			<span class="truncate text-base font-semibold">{user?.user_metadata.fullname}</span>
			<span class="truncate text-xs font-bold text-muted-foreground">
				({program?.program_code}) {program?.program_name}
			</span>
		</div>
	{/if}
</header>
