<script lang="ts" module>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { updateDepSchema, type UpdateDepSchema } from '../schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import { useRowState } from '$lib/states/row-state.svelte';
	import type { DepartmentTable } from '../../(table)/schema';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	interface Props {
		updateDepForm: SuperValidated<UpdateDepSchema>;
	}
</script>

<script lang="ts">
	const { updateDepForm }: Props = $props();

	const rowState = useRowState();

	const id = $derived(page.url.searchParams.get('id'));
	const deletionId = $derived(page.url.searchParams.get('deletion_id'));
	const activeRow = $derived(rowState.getActiveRow()) as DepartmentTable | null;

	const form = superForm(updateDepForm, {
		validators: zodClient(updateDepSchema),
		id: crypto.randomUUID(),
		onUpdate: async ({ result }) => {
			const { status, data } = result;

			switch (status) {
				case 200:
					toast.success('Department updated successfully');
					rowState.setActiveRow(null);
					reset();
					await goto('/operation');
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
				$formData.department_name = activeRow.department_name;
				$formData.department_code = activeRow.department_code;
				$formData.department_color = activeRow.department_color;
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
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Update Department</AlertDialog.Title>
			<AlertDialog.Description>
				Fill the form below to update the department.
			</AlertDialog.Description>
		</AlertDialog.Header>

		<form method="POST" action="?/updateDepEvent" use:enhance>
			<input name="id" type="hidden" value={$formData.id} />

			<Form.Field {form} name="department_name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Department Name</Form.Label>
						<Input
							{...props}
							bind:value={$formData.department_name}
							placeholder="Department Name"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="department_code">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Department Code</Form.Label>
						<Input
							{...props}
							bind:value={$formData.department_code}
							placeholder="Department Code"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="department_color">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Department Color</Form.Label>
						<Input
							type="color"
							{...props}
							bind:value={$formData.department_color}
							placeholder="Department Color"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<AlertDialog.Footer>
				<AlertDialog.Cancel
					type="button"
					onclick={async () => {
						await goto('/operation');
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
