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
					{row.original.programs_tb.program_code}
				</span>
				{#if open}
					<EyeOff class="size-4" />
				{:else}
					<Eye class="size-4" />
				{/if}
				<span class="sr-only">View program</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="flex w-fit flex-col gap-2 p-2" align="start">
		<div class="flex flex-col gap-2">
			<div class="flex flex-col gap-2">
				<span class="text-sm text-muted-foreground">Program</span>
				<div class="flex items-center gap-2 rounded-lg border-2 p-2">
					<div class="flex flex-col gap-3">
						<div class="flex flex-col">
							<span class="text-base font-medium">{row.original.programs_tb.program_code}</span>
							<span class="text-sm text-muted-foreground"
								>{row.original.programs_tb.program_name}</span
							>
						</div>

						<DropdownMenu.Item onclick={() => handleCopy(row.original.program_id)}>
							{row.original.program_id}
							<Copy class="ml-auto size-4" />
						</DropdownMenu.Item>
					</div>
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<span class="text-sm text-muted-foreground">Department</span>
				<div class="flex flex-col gap-3 rounded-lg border-2 p-2">
					<div class="flex items-center gap-2">
						<div
							class="size-7 rounded-full"
							style={`background-color: ${row.original.programs_tb.departments_tb.department_color};`}
						></div>
						<div class="flex flex-col">
							<span class="text-base font-medium"
								>{row.original.programs_tb.departments_tb.department_code}</span
							>
							<span class="text-sm text-muted-foreground"
								>{row.original.programs_tb.departments_tb.department_name}</span
							>
						</div>
					</div>

					<DropdownMenu.Item onclick={() => handleCopy(row.original.department_id)}>
						{row.original.department_id}
						<Copy class="ml-auto size-4" />
					</DropdownMenu.Item>
				</div>
			</div>
		</div>
	</DropdownMenu.Content>
</DropdownMenu.Root>
