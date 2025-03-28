<script lang="ts">
	import SimplePicker from '$lib/components/general/custom-pickers/simple-picker.svelte';

	let selected_id = $state('');
</script>

<main class="container py-10">
	<SimplePicker
		placeholder="Select an age"
		selections={[
			{ id: '1', label: 'Apple', value: 'apple' },
			{ id: '2', label: 'Banana', value: 'banana' },
			{ id: '3', label: 'Orange', value: 'orange' }
		]}
		bind:selected_id
	>
		{#snippet loopChild({ selectedItem })}
			<div class="flex flex-col">
				<span>{selectedItem.label}</span>
				<span class="text-xs text-muted-foreground">{selectedItem.value}</span>
			</div>
		{/snippet}
	</SimplePicker>
</main>
