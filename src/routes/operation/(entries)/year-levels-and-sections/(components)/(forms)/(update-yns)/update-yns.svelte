<script lang="ts" module>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { updateYnsSchema, type UpdateYnsSchema } from '../schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import { useRowState } from '$lib/states/row-state.svelte';
	import type { YnsTable } from '../../(table)/schema';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { urlParamReducer } from '$lib/utils';
	import { untrack } from 'svelte';

	interface Props {
		updateYnsForm: SuperValidated<UpdateYnsSchema>;
	}

	const getYnsbyId = async (id: string) => {
		if (!page.data.supabase) return;
		const { data, error } = await page.data.supabase
			.from('yearlevels_and_sections_tb')
			.select('*')
			.order('created_at', { ascending: false })
			.eq('id', id)
			.single();

		if (error) return null;

		return data;
	};
</script>

<script lang="ts">
	const { updateYnsForm }: Props = $props();

	const rowState = useRowState();

	const id = $derived(page.url.searchParams.get('id'));
	const deletionId = $derived(page.url.searchParams.get('deletion_id'));
	const activeRow = $derived(rowState.getActiveRow()) as YnsTable | null;

	const form = superForm(updateYnsForm, {
		validators: zodClient(updateYnsSchema),
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
			untrack(async () => {
				if (activeRow) {
					$formData.id = activeRow.id;
					$formData.year = activeRow.year;
					$formData.section = activeRow.section;
				} else {
					const data = await getYnsbyId(id);
					if (data) {
						$formData.id = data.id;
						$formData.year = data.year;
						$formData.section = data.section;
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
			<AlertDialog.Title>Update Year Level and Section</AlertDialog.Title>
			<AlertDialog.Description
				>Fill the form below to update the year level and section.</AlertDialog.Description
			>
		</AlertDialog.Header>

		<form method="POST" action="?/updateYnsEvent" use:enhance>
			<input name="id" type="hidden" value={$formData.id} />

			<Form.Field {form} name="year">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Year Level</Form.Label>
						<Input type="number" {...props} bind:value={$formData.year} placeholder="Year Level" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="section">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Section</Form.Label>
						<Input {...props} bind:value={$formData.section} placeholder="Section" />
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
