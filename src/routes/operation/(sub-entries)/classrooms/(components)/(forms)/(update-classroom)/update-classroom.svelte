<script lang="ts" module>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { updateClassroomSchema, type UpdateClassroomSchema } from '../schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import { useRowState } from '$lib/states/row-state.svelte';
	import type { ClassroomTable } from '../../(table)/schema';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import SimplePicker from '$lib/components/general/custom-pickers/simple-picker.svelte';
	import { urlParamReducer } from '$lib/utils';
	import { untrack } from 'svelte';
	import type { DepartmentDropdown } from '../../../../../+layout.svelte';
	interface Props {
		updateClassroomForm: SuperValidated<UpdateClassroomSchema>;
	}

	const getClassroombyId = async (id: string) => {
		if (!page.data.supabase) return;
		const { data, error } = await page.data.supabase
			.from('classrooms_tb')
			.select('*')
			.order('created_at')
			.eq('id', id)
			.single();

		if (error) return null;

		return data;
	};
</script>

<script lang="ts">
	const { updateClassroomForm }: Props = $props();

	const departmentsDropdown = $derived(page.data.departmentsDropdown) as DepartmentDropdown;
	const rowState = useRowState();

	const id = $derived(page.url.searchParams.get('id'));
	const deletionId = $derived(page.url.searchParams.get('deletion_id'));
	const activeRow = $derived(rowState.getActiveRow()) as ClassroomTable | null;

	const form = superForm(updateClassroomForm, {
		validators: zodClient(updateClassroomSchema),
		id: crypto.randomUUID(),
		onUpdate: async ({ result }) => {
			const { status, data } = result;

			switch (status) {
				case 200:
					toast.success('Classroom updated successfully');
					rowState.setActiveRow(null);
					reset();
					await goto(`${page.url.pathname}?${urlParamReducer('id', page)}`);
					break;
				case 401:
					toast.error(data.msg);
					break;
			}
		}
	});

	const { form: formData, enhance, reset, submitting } = form;

	$effect(() => {
		if (id) {
			untrack(async () => {
				if (activeRow) {
					$formData.id = activeRow.id;
					$formData.classroom_name = activeRow.classroom_name;
					$formData.building_name = activeRow.building_name;
					$formData.department_id = activeRow.department_id;
				} else {
					const data = await getClassroombyId(id);
					if (data) {
						$formData.id = data.id;
						$formData.classroom_name = data.classroom_name;
						$formData.building_name = data.building_name;
						$formData.department_id = data.department_id;
					}
				}
			});
		}
	});
</script>

<AlertDialog.Root
	open={!!id && !!!deletionId}
	onOpenChange={async () => {
		reset();
		rowState.setActiveRow(null);
		await goto(`${page.url.pathname}?${urlParamReducer('id', page)}`);
	}}
>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Update Classroom</AlertDialog.Title>
			<AlertDialog.Description>
				Fill the form below to update the classroom.
			</AlertDialog.Description>
		</AlertDialog.Header>

		<form method="POST" action="?/updateClassroomEvent" use:enhance>
			<input name="id" type="hidden" value={$formData.id} />

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
								<div class="flex flex-col">
									<span class="text-sm">{selectedItem.label}</span>
									<span class="text-xs text-muted-foreground">
										{JSON.parse(selectedItem.value).department_name}
									</span>
								</div>
							{/snippet}
						</SimplePicker>
						<input name={props.name} type="hidden" value={$formData.department_id} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="classroom_name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Classroom Name</Form.Label>
						<Input {...props} bind:value={$formData.classroom_name} placeholder="Classroom Name" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="building_name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Building Name</Form.Label>
						<Input {...props} bind:value={$formData.building_name} placeholder="Building Name" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<AlertDialog.Footer>
				<AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
				<Form.Button disabled={$submitting} class="relative">
					<ReqLoader isLoader={$submitting} />
					Update
				</Form.Button>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
