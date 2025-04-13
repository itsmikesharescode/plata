<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import type { Snippet } from 'svelte';

	//TODO: continue implement a dynamic combo picker

	interface Props {
		selections: {
			id: string;
			label: string;
			value: string;
		}[];
		selected_id?: string;
		nameHolder?: string;
		childLoop: Snippet<[{ selectedItem: Props['selections'][number] }]>;
	}

	let {
		selections,
		nameHolder = 'department',
		childLoop,
		selected_id = $bindable()
	}: Props = $props();

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	const selectedValue = $derived(selections.find((f) => f.id === selected_id));

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				variant="outline"
				class="w-full justify-between"
				{...props}
				role="combobox"
				aria-expanded={open}
			>
				{selectedValue?.label || `Select a ${nameHolder}`}
				<ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-full p-0">
		<Command.Root>
			<Command.Input placeholder={`Search ${nameHolder}...`} />
			<Command.List>
				<Command.Empty>No {nameHolder} found.</Command.Empty>
				<Command.Group>
					{#each selections as selection}
						<Command.Item
							value={selection.value}
							onSelect={() => {
								if (selected_id === selection.id) {
									selected_id = '';
								} else {
									selected_id = selection.id;
								}
								closeAndFocusTrigger();
							}}
							class="relative"
						>
							<Check
								class={cn('mr-2 size-4', selected_id !== selection.id && 'text-transparent')}
							/>
							{@render childLoop({ selectedItem: selection })}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
