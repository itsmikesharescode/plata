<script lang="ts" module>
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { ScheduleTable } from '../schema';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import Copy from '@lucide/svelte/icons/copy';
	import { handleCopy } from '../../../../../+layout.svelte';
</script>

<script lang="ts" generics="TData">
	import type { Row } from '@tanstack/table-core';

	let { row }: { row: Row<ScheduleTable> } = $props();

	let open = $state(false);
</script>

<DropdownMenu.Root bind:open>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="secondary" class="flex data-[state=open]:bg-muted">
				<span class="text-sm font-normal">
					{row.original.faculties_tb.fullname}
				</span>
				{#if open}
					<EyeOff class="size-4" />
				{:else}
					<Eye class="size-4" />
				{/if}
				<span class="sr-only">View faculty</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="flex w-fit flex-col gap-2 p-2" align="start">
		<div class="flex flex-col gap-2 rounded-lg border-2 p-2">
			<span class="text-sm text-muted-foreground">{row.original.faculties_tb.academic_rank}</span>
			<span class="text-sm text-muted-foreground">
				{row.original.faculties_tb.employment_status}
			</span>

			<DropdownMenu.Item onclick={() => handleCopy(row.original.faculty_id)}>
				{row.original.faculty_id}
				<Copy class="ml-auto size-4" />
			</DropdownMenu.Item>
		</div>

		<div class="flex flex-col items-center gap-2 rounded-lg border-2 p-2">
			<div class="grid w-full grid-cols-[auto,1fr] items-center gap-2">
				<div
					class="size-7 rounded-full"
					style={`background-color: ${row.original.faculties_tb.departments_tb?.department_color};`}
				></div>
				<div class="flex w-full flex-col">
					<span class="text-base font-medium">
						{row.original.faculties_tb.departments_tb?.department_code}
					</span>
					<span class="text-sm text-muted-foreground">
						{row.original.faculties_tb.departments_tb?.department_name}
					</span>
				</div>
			</div>

			<DropdownMenu.Item onclick={() => handleCopy(row.original.department_id)}>
				{row.original.department_id}
				<Copy class="ml-auto size-4" />
			</DropdownMenu.Item>
		</div>
	</DropdownMenu.Content>
</DropdownMenu.Root>
