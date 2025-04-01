<script lang="ts" module>
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { ChairpersonTable } from '../schema';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import Copy from '@lucide/svelte/icons/copy';
	import { handleCopy } from '../../../../../+layout.svelte';
	import { page } from '$app/state';

	const getDepartmentById = async (id: string) => {
		if (!page.data.supabase) return null;
		const { data, error } = await page.data.supabase
			.from('departments_tb')
			.select('*')
			.eq('id', id)
			.single();
		if (error) return null;

		return data;
	};
</script>

<script lang="ts" generics="TData">
	import type { Row } from '@tanstack/table-core';
	import { untrack } from 'svelte';

	let { row }: { row: Row<ChairpersonTable> } = $props();

	let open = $state(false);
	let department = $state<Awaited<ReturnType<typeof getDepartmentById>>>(null);

	$effect(() => {
		if (open) {
			untrack(async () => {
				const data = await getDepartmentById(row.original.department_id);
				if (data) {
					department = data;
				}
			});
		}
	});
</script>

<DropdownMenu.Root bind:open>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="secondary" class="flex data-[state=open]:bg-muted">
				<span class="text-sm font-normal">View</span>
				{#if open}
					<EyeOff class="size-4" />
				{:else}
					<Eye class="size-4" />
				{/if}
				<span class="sr-only">View department</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="flex w-fit flex-col gap-2 p-2" align="start">
		<div class="flex items-center gap-2 rounded-lg border-2 p-2">
			<div
				class="size-7 rounded-full"
				style={`background-color: ${department?.department_color};`}
			></div>
			<div class="flex flex-col">
				<span class="text-base font-medium">{department?.department_code}</span>
				<span class="text-sm text-muted-foreground">{department?.department_name}</span>
			</div>
		</div>

		<DropdownMenu.Item onclick={() => handleCopy(row.original.department_id)}>
			{row.original.department_id}
			<Copy class="ml-auto size-4" />
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
