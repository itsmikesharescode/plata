<script lang="ts" module>
	import Clock9 from 'lucide-svelte/icons/clock-9';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Button from '$lib/components/ui/button/button.svelte';

	interface Props {
		timeStamp: string;
		placeholder?: string;
	}

	const timeStruct = {
		hours: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
		minutes: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'],
		seconds: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'],
		ampm: ['AM', 'PM']
	} as const;

	export const convertSelectedTime = (
		hour: string,
		minute: string,
		second: string,
		ampm: string
	) => {
		// Convert 12-hour format to 24-hour format
		if (ampm === 'PM' && hour !== '12') {
			hour = (parseInt(hour) + 12).toString();
		} else if (ampm === 'AM' && hour === '12') {
			hour = '00';
		}

		// Create Date object with current date and selected time
		const date = new Date();
		date.setHours(parseInt(hour), parseInt(minute), parseInt(second), 0);

		return date.toISOString(); // ISO 8601 format with timezone
	};

	export const timestampToSelectedTime = (isoString: string) => {
		const date = new Date(isoString);
		let hours = date.getHours();
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const seconds = date.getSeconds().toString().padStart(2, '0');

		// Convert to 12-hour format
		const ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours || 12; // Convert 0 to 12 for 12-hour format

		return {
			hour: hours.toString().padStart(2, '0'),
			minute: minutes,
			second: seconds,
			ampm: ampm
		};
	};
</script>

<script lang="ts">
	let { timeStamp = $bindable(), placeholder = 'Select Time' }: Props = $props();

	//ahaha idk but svelte allowed this now
	let nTime = $derived.by(() => {
		if (timeStamp) {
			const cStamp = timestampToSelectedTime(timeStamp);

			return cStamp;
		} else {
			return {
				hour: '',
				minute: '00',
				second: '00',
				ampm: 'AM'
			};
		}
	});

	const reAssigner = (key: 'hour' | 'minute' | 'second' | 'ampm', value: string) => {
		nTime[key] = value;
		nTime = {
			...nTime,
			[key]: value
		};
	};

	const checkIfAllValid = $derived(nTime.hour && nTime.minute && nTime.second && nTime.ampm);
</script>

<Popover.Root>
	<Popover.Trigger
		class="flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm font-normal ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
	>
		{#if checkIfAllValid}
			{nTime.hour} : {nTime.minute} : {nTime.second} {nTime.ampm}
		{:else}
			<span class="text-muted-foreground">{placeholder}</span>
		{/if}
		<Clock9 class="size-4" />
	</Popover.Trigger>
	<Popover.Content class="flex w-fit flex-col gap-2">
		<div class="flex flex-col gap-2 md:flex-row md:items-center">
			<div class="grid grid-cols-2 items-center gap-2 md:grid-cols-1">
				<Label>Hour</Label>
				<Select.Root
					onValueChange={() => {
						if (checkIfAllValid) {
							timeStamp = convertSelectedTime(nTime.hour, nTime.minute, nTime.second, nTime.ampm);
						} else {
							reAssigner('hour', '01');
						}
					}}
					allowDeselect
					type="single"
					bind:value={
						() => {
							return nTime.hour;
						},
						(v) => reAssigner('hour', v)
					}
				>
					<Select.Trigger class="w-20">
						{nTime.hour || 'Hour'}
					</Select.Trigger>
					<Select.Content>
						{#each timeStruct.hours as hour}
							<Select.Item value={hour.toString()}>{hour}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div class="grid grid-cols-2 items-center gap-2 md:grid-cols-1">
				<Label>Minute</Label>
				<Select.Root
					disabled={!!!checkIfAllValid}
					onValueChange={() => {
						if (checkIfAllValid) {
							timeStamp = convertSelectedTime(nTime.hour, nTime.minute, nTime.second, nTime.ampm);
						} else {
							reAssigner('minute', '00');
						}
					}}
					allowDeselect
					type="single"
					bind:value={
						() => {
							return nTime.minute;
						},
						(v) => reAssigner('minute', v)
					}
				>
					<Select.Trigger class="w-20">
						{nTime.minute || 'Minute'}
					</Select.Trigger>
					<Select.Content>
						{#each timeStruct.minutes as minute}
							<Select.Item value={minute.toString()}>{minute}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div class="grid grid-cols-2 items-center gap-2 md:grid-cols-1">
				<Label>Seconds</Label>
				<Select.Root
					disabled={!!!checkIfAllValid}
					onValueChange={() => {
						if (checkIfAllValid) {
							timeStamp = convertSelectedTime(nTime.hour, nTime.minute, nTime.second, nTime.ampm);
						} else {
							reAssigner('second', '00');
						}
					}}
					allowDeselect
					type="single"
					bind:value={
						() => {
							return nTime.second;
						},
						(v) => reAssigner('second', v)
					}
				>
					<Select.Trigger class="w-20">
						{nTime.second || 'Second'}
					</Select.Trigger>
					<Select.Content>
						{#each timeStruct.seconds as second}
							<Select.Item value={second.toString()}>{second}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div class="grid grid-cols-2 items-center gap-2 md:grid-cols-1">
				<Label>AM/PM</Label>
				<Select.Root
					disabled={!!!checkIfAllValid}
					onValueChange={() => {
						if (checkIfAllValid) {
							timeStamp = convertSelectedTime(nTime.hour, nTime.minute, nTime.second, nTime.ampm);
						} else {
							reAssigner('ampm', 'AM');
						}
					}}
					type="single"
					bind:value={
						() => {
							return nTime.ampm;
						},
						(v) => reAssigner('ampm', v)
					}
				>
					<Select.Trigger class="w-20">
						{nTime.ampm || 'AM/PM'}
					</Select.Trigger>
					<Select.Content>
						{#each timeStruct.ampm as ampm}
							<Select.Item value={ampm.toString()}>{ampm}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</div>

		<Button size="sm" onclick={() => (timeStamp = '')}>Reset</Button>
	</Popover.Content>
</Popover.Root>
