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
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { toast } from 'svelte-sonner';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';

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
				$formData.id = activeRow.id;
				$formData.department_id = activeRow.department_id;
				$formData.fullname = activeRow.fullname;
				$formData.academic_rank = activeRow.academic_rank;
				$formData.status = activeRow.status;
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

					<Form.Field {form} name="fullname">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Fullname</Form.Label>
								<Input {...props} bind:value={$formData.fullname} placeholder="Faculty Fullname" />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="academic_rank">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Academic Rank</Form.Label>
								<Textarea
									{...props}
									bind:value={$formData.academic_rank}
									placeholder="Faculty Academic Rank"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="status">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Status</Form.Label>
								<Textarea {...props} bind:value={$formData.status} placeholder="Faculty Status" />
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
