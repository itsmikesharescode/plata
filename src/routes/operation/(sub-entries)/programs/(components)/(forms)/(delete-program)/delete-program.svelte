<script lang="ts" module>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { deleteProgramSchema, type DeleteProgramSchema } from '../schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { untrack } from 'svelte';
	import { urlParamReducer } from '$lib/utils';

	//TODO: implement a fetch call if activeRow is null at visit

	interface Props {
		deleteProgramForm: SuperValidated<DeleteProgramSchema>;
	}
</script>

<script lang="ts">
	const { deleteProgramForm }: Props = $props();

	const id = $derived(page.url.searchParams.get('id'));
	const deletionId = $derived(page.url.searchParams.get('deletion_id'));

	const form = superForm(deleteProgramForm, {
		validators: zodClient(deleteProgramSchema),
		id: crypto.randomUUID(),
		onUpdate: async ({ result }) => {
			const { status, data } = result;

			switch (status) {
				case 200:
					toast.success('Program deleted successfully');
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
			untrack(() => {
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
			<AlertDialog.Title>Delete Program</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to delete this program? with id of {deletionId}
			</AlertDialog.Description>
		</AlertDialog.Header>

		<form method="POST" action="?/deleteProgramEvent" use:enhance>
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
