<script lang="ts">
	import CustomTable from '$lib/components/general/custom-table/custom-table.svelte';
	import CreateSchedule from './(components)/(forms)/(create-schedule)/create-schedule.svelte';
	import DeleteSchedule from './(components)/(forms)/(delete-schedule)/delete-schedule.svelte';
	import UpdateSchedule from './(components)/(forms)/(update-schedule)/update-schedule.svelte';
	import { columns } from './(components)/(table)/column';
	import Printing from './(components)/(toolbars)/(printing)/printing.svelte';
	import { initPrintingState } from './(components)/(toolbars)/(printing)/state.svelte';
	import SimplePicker from '$lib/components/general/custom-pickers/simple-picker.svelte';
	import { page } from '$app/state';
	import type { DepartmentDropdown } from '../../+layout.svelte';
	import ComboPicker from '$lib/components/general/custom-pickers/combo-picker.svelte';
	const { data } = $props();

	initPrintingState();

	const departmentsDropdown = $derived(page.data.departmentsDropdown) as DepartmentDropdown;

	let selectedDepartmentId = $state('');
</script>

<main class="flex flex-col gap-4 p-4">
	<section class="flex flex-wrap items-center justify-between gap-4">
		<div class="">
			<CreateSchedule createScheduleForm={data.createScheduleForm} />
			<Printing />
		</div>

		<div class="grid grid-cols-[auto_auto] items-center gap-4">
			<span class="w-full text-sm font-medium">Filter by:</span>
			<ComboPicker
				selections={departmentsDropdown?.map((v) => ({
					id: v.id,
					label: v.department_code,
					value: JSON.stringify({
						department_name: v.department_name,
						department_color: v.department_color
					})
				})) ?? []}
			>
				{#snippet childLoop({ selectedItem })}
					<div class="grid grid-cols-[auto_1fr] items-center gap-2">
						<div
							class="size-5 rounded-full"
							style="background-color: {JSON.parse(selectedItem.value).department_color}"
						></div>
						<div class="flex flex-col">
							<span class="">{selectedItem.label}</span>
							<span class="text-xs text-muted-foreground"
								>{JSON.parse(selectedItem.value).department_name}</span
							>
						</div>
					</div>
				{/snippet}
			</ComboPicker>
		</div>
	</section>
	<section>
		<CustomTable {columns} data={data.schedules ?? []} />
	</section>
</main>

<UpdateSchedule updateScheduleForm={data.updateScheduleForm} />
<DeleteSchedule deleteScheduleForm={data.deleteScheduleForm} />
