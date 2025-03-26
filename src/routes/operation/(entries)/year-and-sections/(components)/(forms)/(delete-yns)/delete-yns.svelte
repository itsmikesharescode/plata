<script lang="ts" module>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { deleteYnsSchema, type DeleteYnsSchema } from '../schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import { useRowState } from '$lib/states/row-state.svelte';
	import type { YnsTable } from '../../(table)/schema';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	//TODO: implement a fetch call if activeRow is null at visit

	interface Props {
		deleteYnsForm: SuperValidated<DeleteYnsSchema>;
	}
</script>

<script lang="ts">
	const { deleteYnsForm }: Props = $props();

	const rowState = useRowState();

	const activeRow = $derived(rowState.getActiveRow()) as YnsTable | null;

	const id = $derived(page.url.searchParams.get('id'));
	const deletionId = $derived(page.url.searchParams.get('deletion_id'));

	const form = superForm(deleteYnsForm, {
		validators: zodClient(deleteYnsSchema),
		id: crypto.randomUUID(),
		onUpdate: async ({ result }) => {
			const { status, data } = result;

			switch (status) {
				case 200:
					toast.success('Year and Section deleted successfully');
					rowState.setActiveRow(null);
					reset();
					await goto('/operation/year-and-sections');
					break;
				case 401:
					toast.error(data.msg);
					break;
			}
		}
	});

	const { form: formData, enhance, reset, submitting } = form;

	$effect(() => {
		if (deletionId) {
			if (activeRow) {
				$formData.id = activeRow.id;
			}
		}
	});
</script>

<AlertDialog.Root
	open={!!deletionId && !!!id}
	onOpenChange={() => {
		reset();
		rowState.setActiveRow(null);
	}}
>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete Year and Section</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to delete this year and section? with id of {activeRow?.id}
			</AlertDialog.Description>
		</AlertDialog.Header>

		<form method="POST" action="?/deleteYnsEvent" use:enhance>
			<input name="id" type="hidden" value={$formData.id} />

			<AlertDialog.Footer>
				<AlertDialog.Cancel
					type="button"
					onclick={async () => {
						await goto('/operation/year-and-sections');
					}}
				>
					Cancel
				</AlertDialog.Cancel>
				<Form.Button
					disabled={$submitting}
					class={buttonVariants({ variant: 'destructive', class: 'relative' })}
				>
					<ReqLoader isLoader={$submitting} class="bg-destructive" />
					Delete
				</Form.Button>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
