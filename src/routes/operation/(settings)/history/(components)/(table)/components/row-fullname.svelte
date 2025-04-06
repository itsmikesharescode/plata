<script lang="ts" module>
	import { page } from '$app/state';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	const getUserById = async (id: string) => {
		if (!page.data.supabase) return null;
		const { data, error } = await page.data.supabase
			.from('users_tb')
			.select('user_meta_data')
			.eq('user_id', id)
			.single();

		if (error) return null;

		return data.user_meta_data.fullname;
	};
</script>

<script lang="ts" generics="TData">
	import type { Row } from '@tanstack/table-core';
	import type { HistoryTable } from '../schema';

	let { row }: { row: Row<HistoryTable> } = $props();
</script>

{#await getUserById(row.original.user_id)}
	<Skeleton class="h-[20px] w-[100px] rounded-full bg-primary/50" />
{:then fullname}
	<span>{fullname ?? 'Admin'}</span>
{/await}
