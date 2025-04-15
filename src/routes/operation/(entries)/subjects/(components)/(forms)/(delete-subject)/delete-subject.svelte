<script lang="ts" module>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { deleteSubSchema, type DeleteSubSchema } from '../schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { urlParamReducer } from '$lib/utils';
	import { untrack } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';

	interface Props {
		deleteSubForm: SuperValidated<DeleteSubSchema>;
	}
</script>

<script lang="ts">
	const { deleteSubForm }: Props = $props();

	const id = $derived(page.url.searchParams.get('id'));
	const deletionId = $derived(page.url.searchParams.get('deletion_id'));

	const form = superForm(deleteSubForm, {
		validators: zodClient(deleteSubSchema),
		id: uuidv4(),
		onUpdate: async ({ result }) => {
			const { status, data } = result;

			switch (status) {
				case 200:
					toast.success('Subject deleted successfully');
					reset();
					await goto(`${page.url.pathname}?${urlParamReducer('deletion_id', page)}`);
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
			untrack(async () => {
				$formData.id = deletionId;
			});
		}
	});
</script>

<AlertDialog.Root
	open={!!deletionId && !!!id}
	onOpenChange={async () => {
		reset();
		await goto(`${page.url.pathname}?${urlParamReducer('deletion_id', page)}`);
	}}
>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete Subject</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to delete this subject? with id of {deletionId}
			</AlertDialog.Description>
		</AlertDialog.Header>

		<form method="POST" action="?/deleteSubEvent" use:enhance>
			<input name="id" type="hidden" value={$formData.id} />

			<AlertDialog.Footer>
				<AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
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
