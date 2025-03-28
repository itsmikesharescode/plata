<script lang="ts">
	import SimplePicker from '$lib/components/general/custom-pickers/simple-picker.svelte';
	import TimePicker from '$lib/components/general/custom-pickers/time-picker.svelte';

	let selected_id = $state('');

	let timeStamp = $state('2025-03-28T21:15:25.000Z');
</script>

<main class="container flex flex-col gap-4 py-10">
	<div class="flex flex-col gap-4 rounded-lg border p-4">
		<span>SimplePicker</span>
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
	</div>

	<div class="flex flex-col gap-4 rounded-lg border p-4">
		<span>Time Picker</span>
		<TimePicker bind:timeStamp />

		{timeStamp}
	</div>
</main>
