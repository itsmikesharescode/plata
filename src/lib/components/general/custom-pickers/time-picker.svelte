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
	): string => {
		let h = parseInt(hour, 10);
		// Convert 12-hour format to 24-hour format for UTC
		if (ampm === 'PM' && h !== 12) {
			h += 12;
		} else if (ampm === 'AM' && h === 12) {
			// 12 AM is 00 hours
			h = 0;
		}

		const now = new Date(); // Used to get current UTC date components
		// Create a Date object using UTC components for date, and selected time as UTC time
		const utcDate = new Date(
			Date.UTC(
				now.getUTCFullYear(),
				now.getUTCMonth(), // 0-indexed
				now.getUTCDate(),
				h, // The selected hour, interpreted as UTC hour
				parseInt(minute, 10),
				parseInt(second, 10),
				0 // milliseconds
			)
		);

		return utcDate.toISOString(); // ISO 8601 format, e.g., "2025-05-27T10:00:00.000Z"
	};

	export const timestampToSelectedTime = (isoString: string) => {
		const date = new Date(isoString);
		let hours = date.getUTCHours(); // Use UTC hours
		const minutes = date.getUTCMinutes().toString().padStart(2, '0'); // Use UTC minutes
		const seconds = date.getUTCSeconds().toString().padStart(2, '0'); // Use UTC seconds

		// Convert 24-hour UTC time to 12-hour format with AM/PM
		const ampm = hours >= 12 ? 'PM' : 'AM';
		let displayHours = hours % 12;
		displayHours = displayHours || 12; // Convert 0 to 12 (e.g., 00:00 -> 12 AM, 12:00 -> 12 PM)

		return {
			hour: displayHours.toString().padStart(2, '0'),
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
