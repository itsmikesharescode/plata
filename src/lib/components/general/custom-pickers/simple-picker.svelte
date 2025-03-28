<script lang="ts" module>
	import * as Select from '$lib/components/ui/select/index.js';
	import type { Snippet } from 'svelte';

	export type Picker = {
		id: string;
		label: string;
		value: string;
	};

	interface Props {
		placeholder?: string;
		selections: Picker[];
		selected_id: string;
		loopChild?: Snippet<[{ selectedItem: Picker }]>;
	}
</script>

<script lang="ts">
	let {
		selections,
		selected_id = $bindable(),
		loopChild,
		placeholder = 'Select an item'
	}: Props = $props();

	const triggerContent = $derived(
		selections.find((item) => item.id === selected_id)?.label ?? placeholder
	);
</script>

<Select.Root type="single" name="favoriteFruit" allowDeselect={true} bind:value={selected_id}>
	<Select.Trigger class="w-full">
		{triggerContent}
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#if loopChild}
				{#each selections as selection (selection.id)}
					<Select.Item value={selection.id} label={selection.label}>
						{@render loopChild({ selectedItem: selection })}
					</Select.Item>
				{/each}
			{:else}
				{#each selections as selection (selection.id)}
					<Select.Item value={selection.id} label={selection.label} />
				{/each}
			{/if}
		</Select.Group>
	</Select.Content>
</Select.Root>
