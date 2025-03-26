<script lang="ts" generics="TData">
	import type { Row } from '@tanstack/table-core';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { ClassroomTable } from '../schema';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import Copy from '@lucide/svelte/icons/copy';
	import { toast } from 'svelte-sonner';

	let { row }: { row: Row<ClassroomTable> } = $props();

	let open = $state(false);

	const handleCopy = async () => {
		//implement copy of row.original.id
		await navigator.clipboard
			.writeText(row.original.id)
			.then(() => {
				toast.success(`Copied ${row.original.id}`);
			})
			.catch((err) => {
				toast.error(err);
			});
	};
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
				<span class="sr-only">View classroom id</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-fit" align="start">
		<DropdownMenu.Item onclick={handleCopy}>
			{row.original.id}
			<Copy class="ml-auto size-4" />
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
