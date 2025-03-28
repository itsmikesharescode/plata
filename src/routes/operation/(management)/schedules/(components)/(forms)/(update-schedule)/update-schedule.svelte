<script lang="ts" module>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { updateScheduleSchema, type UpdateScheduleSchema } from '../schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import { useRowState } from '$lib/states/row-state.svelte';
	import type { ScheduleTable } from '../../(table)/schema';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';

	interface Props {
		updateScheduleForm: SuperValidated<UpdateScheduleSchema>;
	}
</script>

<script lang="ts">
	const { updateScheduleForm }: Props = $props();

	const rowState = useRowState();

	const id = $derived(page.url.searchParams.get('id'));
	const deletionId = $derived(page.url.searchParams.get('deletion_id'));
	const activeRow = $derived(rowState.getActiveRow()) as ScheduleTable | null;

	const form = superForm(updateScheduleForm, {
		validators: zodClient(updateScheduleSchema),
		id: crypto.randomUUID(),
		onUpdate: async ({ result }) => {
			const { status, data } = result;

			switch (status) {
				case 200:
					toast.success('Schedule updated successfully');
					rowState.setActiveRow(null);
					reset();
					await goto('/operation/schedules');
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
				$formData.program_id = activeRow.program_id;
				$formData.year_and_section_id = activeRow.year_and_section_id;
				$formData.semester = activeRow.semester;
				$formData.assigned_subjects = activeRow.assigned_subjects;
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
		<AlertDialog.Header class="p-6 pb-0">
			<AlertDialog.Title>Update Schedule</AlertDialog.Title>
			<AlertDialog.Description>Fill the form below to update the schedule.</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action="?/updateScheduleEvent" use:enhance>
			<input name="id" type="hidden" value={$formData.id} />
			<ScrollArea>
				<section class="max-h-[60dvh] px-6">
					<Form.Field {form} name="department_id">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Department</Form.Label>
								<Input
									{...props}
									bind:value={$formData.department_id}
									placeholder="Department dropdown"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="faculty_id">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Faculty</Form.Label>
								<Input
									{...props}
									bind:value={$formData.faculty_id}
									placeholder="Faculty dropdown"
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
						await goto('/operation/schedules');
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
