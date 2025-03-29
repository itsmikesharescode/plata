<script lang="ts" module>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { updateFacultySchema, type UpdateFacultySchema } from '../schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import { useRowState } from '$lib/states/row-state.svelte';
	import type { FacultyTable } from '../../(table)/schema';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import SimplePicker from '$lib/components/general/custom-pickers/simple-picker.svelte';
	import { academicRanks } from '$lib';

	interface Props {
		updateFacultyForm: SuperValidated<UpdateFacultySchema>;
	}
</script>

<script lang="ts">
	const { updateFacultyForm }: Props = $props();

	const rowState = useRowState();

	const id = $derived(page.url.searchParams.get('id'));
	const deletionId = $derived(page.url.searchParams.get('deletion_id'));
	const activeRow = $derived(rowState.getActiveRow()) as FacultyTable | null;

	const form = superForm(updateFacultyForm, {
		validators: zodClient(updateFacultySchema),
		id: crypto.randomUUID(),
		onUpdate: async ({ result }) => {
			const { status, data } = result;

			switch (status) {
				case 200:
					toast.success('Faculty updated successfully');
					rowState.setActiveRow(null);
					reset();
					await goto('/operation/faculties');
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
			if (activeRow) {
				$formData.faculty_id = activeRow.faculty_id;
				$formData.department_id = activeRow.department_id;
				$formData.fullname = activeRow.fullname;
				$formData.academic_rank = activeRow.academic_rank;
				$formData.employment_status = activeRow.employment_status;
			}
		}
	});
</script>

<AlertDialog.Root
	open={!!id && !!!deletionId}
	onOpenChange={() => {
		reset();
		rowState.setActiveRow(null);
	}}
>
	<AlertDialog.Content class="flex max-h-[100dvh] flex-col p-0">
		<AlertDialog.Header class="px-6 pt-6">
			<AlertDialog.Title>Update Faculty</AlertDialog.Title>
			<AlertDialog.Description>Fill the form below to update the faculty.</AlertDialog.Description>
		</AlertDialog.Header>

		<form method="POST" action="?/updateFacultyEvent" use:enhance>
			<input name="faculty_id" type="hidden" value={$formData.faculty_id} />
			<ScrollArea>
				<section class="max-h-[60dvh] px-6">
					<Form.Field {form} name="department_id">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Department</Form.Label>

								<SimplePicker
									placeholder="Select Department"
									selections={[
										{ id: '1', label: 'CED', value: 'Civil Engineering Department' },
										{ id: '2', label: 'CSE', value: 'Computer Science and Engineering Department' },
										{
											id: '3',
											label: 'CCE',
											value: 'Civil and Construction Engineering Department'
										},
										{
											id: '4',
											label: 'CCE',
											value: 'Civil and Construction Engineering Department'
										},
										{
											id: '5',
											label: 'CCE',
											value: 'Civil and Construction Engineering Department'
										},
										{
											id: '6',
											label: 'CCE',
											value: 'Civil and Construction Engineering Department'
										},
										{
											id: '7',
											label: 'CCE',
											value: 'Civil and Construction Engineering Department'
										},
										{
											id: '8',
											label: 'CCE',
											value: 'Civil and Construction Engineering Department'
										}
									]}
									bind:selected_id={$formData.department_id}
								>
									{#snippet loopChild({ selectedItem })}
										<div class="flex flex-col">
											<span class="text-sm">{selectedItem.label}</span>
											<span class="text-xs text-muted-foreground">{selectedItem.value}</span>
										</div>
									{/snippet}
								</SimplePicker>
								<input name={props.name} type="hidden" value={$formData.department_id} />
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

					<Form.Field {form} name="fullname">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Fullname</Form.Label>
								<Input {...props} bind:value={$formData.fullname} placeholder="Faculty Fullname" />
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
									placeholder="Faculty Employment Status"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</section>
			</ScrollArea>

			<AlertDialog.Footer class="mt-2 px-6 pb-6">
				<AlertDialog.Cancel
					type="button"
					onclick={async () => {
						await goto('/operation/faculties');
					}}
				>
					Cancel
				</AlertDialog.Cancel>
				<Form.Button disabled={$submitting} class="relative">
					<ReqLoader isLoader={$submitting} />
					Update
				</Form.Button>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
