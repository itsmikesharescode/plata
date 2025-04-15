<script lang="ts" module>
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { updateChairpersonInfoSchema, type UpdateChairpersonInfoSchema } from '../../schema';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import { untrack } from 'svelte';
	import SimplePicker from '$lib/components/general/custom-pickers/simple-picker.svelte';
	import { academicRanks } from '$lib';
	import { urlParamReducer } from '$lib/utils';
	import { page } from '$app/state';
	import type { DepartmentDropdown, ProgramDropdown } from '../../../../../../+layout.svelte';
	import { useRowState } from '$lib/states/row-state.svelte';
	import { v4 as uuidv4 } from 'uuid';
	interface Props {
		stateProp: {
			user_id: string | undefined;
			department_id: string | undefined;
			fullname: string | undefined;
			academic_rank: string | undefined;
			employment_status: string | undefined;
			program_id: string | undefined;
		};
		updateChairpersonInfoForm: SuperValidated<UpdateChairpersonInfoSchema>;
	}
</script>

<script lang="ts">
	const { updateChairpersonInfoForm, stateProp }: Props = $props();
	const rowState = useRowState();

	const departmentsDropdown = $derived(page.data.departmentsDropdown) as DepartmentDropdown;
	const programsDropdown = $derived(page.data.programsDropdown) as ProgramDropdown;

	const form = superForm(updateChairpersonInfoForm, {
		validators: zodClient(updateChairpersonInfoSchema),
		id: uuidv4(),
		onUpdate: async ({ result }) => {
			const { status, data } = result;

			switch (status) {
				case 200:
					toast.success(data.msg);
					reset();
					rowState.setActiveRow(null);
					await goto(`${page.url.pathname}?${urlParamReducer('id', page)}`);

					break;
				case 401:
					toast.error(data.msg);
					break;
			}
		}
	});

	const { form: formData, enhance, submitting, reset } = form;

	$effect(() => {
		untrack(() => {
			if (
				stateProp.academic_rank &&
				stateProp.department_id &&
				stateProp.fullname &&
				stateProp.employment_status &&
				stateProp.program_id &&
				stateProp.user_id
			) {
				$formData.academic_rank = stateProp.academic_rank;
				$formData.department_id = stateProp.department_id;
				$formData.program_id = stateProp.program_id;
				$formData.fullname = stateProp.fullname;
				$formData.employment_status = stateProp.employment_status;
				$formData.user_id = stateProp.user_id;
			}
		});

		return () => {
			reset();
		};
	});
</script>

<form method="POST" use:enhance action="?/updateChairpersonInfoEvent" class="flex flex-col">
	<input name="user_id" type="hidden" value={$formData.user_id} />

	<Form.Field {form} name="department_id">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Department</Form.Label>

				<SimplePicker
					placeholder="Select Department"
					selections={departmentsDropdown?.map((v) => ({
						id: v.id,
						label: v.department_code,
						value: JSON.stringify({
							department_name: v.department_name,
							department_color: v.department_color
						})
					})) ?? []}
					bind:selected_id={$formData.department_id}
				>
					{#snippet loopChild({ selectedItem })}
						<div class="flex items-center gap-2">
							<div
								class="size-5 rounded-full"
								style="background-color: {JSON.parse(selectedItem.value).department_color}"
							></div>
							<div class="flex flex-col">
								<span class="text-sm">{selectedItem.label}</span>
								<span class="text-xs text-muted-foreground">
									{JSON.parse(selectedItem.value).department_name}
								</span>
							</div>
						</div>
					{/snippet}
				</SimplePicker>
				<input name={props.name} type="hidden" value={$formData.department_id} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="program_id">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Program</Form.Label>

				<SimplePicker
					placeholder="Select Program"
					selections={programsDropdown?.map((v) => ({
						id: v.id,
						label: v.program_code,
						value: JSON.stringify({
							program_name: v.program_name,
							department_name: v.departments_tb.department_name
						})
					})) ?? []}
					bind:selected_id={$formData.program_id}
				>
					{#snippet loopChild({ selectedItem })}
						<div class="flex flex-col">
							<span class="text-sm">{selectedItem.label}</span>
							<span class="text-xs text-muted-foreground">
								{JSON.parse(selectedItem.value).department_name}
							</span>
						</div>
					{/snippet}
				</SimplePicker>
				<input name={props.name} type="hidden" value={$formData.program_id} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="academic_rank">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Academic Rank</Form.Label>
				<SimplePicker
					placeholder="Select Academic Rank"
					selections={academicRanks.map((v) => ({
						id: v,
						label: v,
						value: v
					}))}
					bind:selected_id={$formData.academic_rank}
				/>

				<input name={props.name} type="hidden" value={$formData.academic_rank} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="employment_status">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Employment Status</Form.Label>
				<Input
					{...props}
					bind:value={$formData.employment_status}
					placeholder="Chairperson Employment Status"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="fullname">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Fullname</Form.Label>
				<Input {...props} bind:value={$formData.fullname} placeholder="Enter fullname" />
			{/snippet}
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>

	<Form.Button disabled={$submitting} class="relative ml-auto">
		<ReqLoader isLoader={$submitting} />
		Update Information
	</Form.Button>
</form>
