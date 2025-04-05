<script lang="ts" generics="TData">
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import type { Row } from '@tanstack/table-core';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { ScheduleTable } from '../schema';
	import { useRowState } from '$lib/states/row-state.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let { row }: { row: Row<ScheduleTable> } = $props();

	const rowState = useRowState();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<div class="flex w-full justify-end">
				<Button {...props} variant="ghost" class="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
					<Ellipsis />
					<span class="sr-only">Open Schedule Action</span>
				</Button>
			</div>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-fit" align="end">
		<DropdownMenu.Item
			onclick={async () => {
				rowState.setActiveRow(row.original);
				await goto(
					`/operation/schedules/printables/teaching-form?id=${row.original.id}&from=${page.url.href}`
				);
			}}
		>
			Print Teaching Form
		</DropdownMenu.Item>
		<DropdownMenu.Item
			onclick={async () => {
				rowState.setActiveRow(row.original);
				await goto(`?id=${row.original.id}`);
			}}>Edit</DropdownMenu.Item
		>
		<DropdownMenu.Item
			onclick={async () => {
				rowState.setActiveRow(row.original);
				await goto(`?deletion_id=${row.original.id}`);
			}}>Delete</DropdownMenu.Item
		>
	</DropdownMenu.Content>
</DropdownMenu.Root>
