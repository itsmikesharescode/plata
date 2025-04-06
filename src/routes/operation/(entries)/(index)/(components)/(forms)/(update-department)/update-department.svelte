<script lang="ts" module>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
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
	import { untrack } from 'svelte';
	import { urlParamReducer } from '$lib/utils';

	interface Props {
		updateDepForm: SuperValidated<UpdateDepSchema>;
	}

	const getDepbyId = async (id: string) => {
		if (!page.data.supabase) return;
		const { data, error } = await page.data.supabase
			.from('departments_tb')
			.select('*')
			.order('created_at', { ascending: false })
			.eq('id', id)
			.single();

		if (error) return null;

		return data;
	};
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
					toast.success(data.msg);
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
			untrack(() => {
				if (activeRow) {
					$formData.id = activeRow.id;
					$formData.department_name = activeRow.department_name;
					$formData.department_code = activeRow.department_code;
					$formData.department_color = activeRow.department_color;
				} else {
					getDepbyId(id).then((dep) => {
						if (dep) {
							$formData.id = dep.id;
							$formData.department_name = dep.department_name;
							$formData.department_code = dep.department_code;
							$formData.department_color = dep.department_color;
						}
					});
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
				<AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
				<Form.Button disabled={$submitting} class="relative">
					<ReqLoader isLoader={$submitting} />
					Update
				</Form.Button>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
