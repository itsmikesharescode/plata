<script lang="ts" module>
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { ScheduleTable } from '../schema';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import { page } from '$app/state';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';

	const getSubjectById = async (id: string) => {
		if (!page.data.supabase) return null;
		const { data, error } = await page.data.supabase
			.from('subjects_tb')
			.select('course_name')
			.eq('id', id)
			.single();

		if (error) return null;

		return data.course_name;
	};
</script>

<script lang="ts" generics="TData">
	import type { Row } from '@tanstack/table-core';
	import { untrack } from 'svelte';

	let { row }: { row: Row<ScheduleTable> } = $props();

	let open = $state(false);
</script>

<DropdownMenu.Root bind:open>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="secondary" class="flex data-[state=open]:bg-muted">
				<span class="text-sm font-normal"> View </span>
				{#if open}
					<EyeOff class="size-4" />
				{:else}
					<Eye class="size-4" />
				{/if}
				<span class="sr-only">View department</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="flex max-w-xl flex-col gap-2 py-5" align="start">
		<ScrollArea>
			<div class="flex max-h-[30dvh] flex-col gap-2 p-4">
				{#each row.original.assigned_subjects as subject}
					<div class="max-w-fit rounded-lg border-2 p-2">
						{#await getSubjectById(subject.subject_id)}
							<Skeleton class="h-[20px] w-[100px] rounded-full" />
						{:then subjectName}
							<span class="text-sm font-medium">{subjectName}</span>
						{/await}

						<span class="text-sm text-muted-foreground">
							{new Date(subject.start_time).toLocaleTimeString('en-US', {
								hour: '2-digit',
								minute: '2-digit',
								second: '2-digit',
								hour12: true
							})} - {new Date(subject.end_time).toLocaleTimeString('en-US', {
								hour: '2-digit',
								minute: '2-digit',
								second: '2-digit',
								hour12: true
							})}
						</span>

						<span class="text-sm font-medium">{subject.day}</span>
					</div>
				{/each}
			</div>
		</ScrollArea>
	</DropdownMenu.Content>
</DropdownMenu.Root>
