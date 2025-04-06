<script lang="ts" module>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { updateSubSchema, type UpdateSubSchema } from '../schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import { useRowState } from '$lib/states/row-state.svelte';
	import type { SubjectTable } from '../../(table)/schema';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { urlParamReducer } from '$lib/utils';
	import { untrack } from 'svelte';

	interface Props {
		updateSubForm: SuperValidated<UpdateSubSchema>;
	}

	const getSubbyId = async (id: string) => {
		if (!page.data.supabase) return;
		const { data, error } = await page.data.supabase
			.from('subjects_tb')
			.select('*')
			.order('created_at', { ascending: false })
			.eq('id', id)
			.single();

		if (error) return null;

		return data;
	};
</script>

<script lang="ts">
	const { updateSubForm }: Props = $props();

	const rowState = useRowState();

	const id = $derived(page.url.searchParams.get('id'));
	const deletionId = $derived(page.url.searchParams.get('deletion_id'));
	const activeRow = $derived(rowState.getActiveRow()) as SubjectTable | null;

	const form = superForm(updateSubForm, {
		validators: zodClient(updateSubSchema),
		id: crypto.randomUUID(),
		onUpdate: async ({ result }) => {
			const { status, data } = result;

			switch (status) {
				case 200:
					toast.success('Subject updated successfully');
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
					$formData.course_name = activeRow.course_name;
					$formData.course_code = activeRow.course_code;
					$formData.lecture_hours = activeRow.lecture_hours;
					$formData.lab_hours = activeRow.lab_hours;
					$formData.unit = activeRow.unit;
				} else {
					getSubbyId(id).then((sub) => {
						if (sub) {
							$formData.id = sub.id;
							$formData.course_name = sub.course_name;
							$formData.course_code = sub.course_code;
							$formData.lecture_hours = sub.lecture_hours;
							$formData.lab_hours = sub.lab_hours;
							$formData.unit = sub.unit;
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
	<AlertDialog.Content class="flex max-h-[100dvh] flex-col p-0">
		<AlertDialog.Header class="px-6 pt-6">
			<AlertDialog.Title>Update Subject</AlertDialog.Title>
			<AlertDialog.Description>Fill the form below to update the subject.</AlertDialog.Description>
		</AlertDialog.Header>

		<form method="POST" action="?/updateSubEvent" use:enhance>
			<input name="id" type="hidden" value={$formData.id} />

			<ScrollArea>
				<section class="max-h-[60dvh] px-6">
					<Form.Field {form} name="course_name">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Course Name</Form.Label>
								<Input {...props} bind:value={$formData.course_name} placeholder="Course Name" />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="course_code">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Course Code</Form.Label>
								<Input {...props} bind:value={$formData.course_code} placeholder="Course Code" />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<div class="grid grid-cols-3 gap-4">
						<Form.Field {form} name="lecture_hours">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Lecture Hours</Form.Label>
									<Input
										type="number"
										{...props}
										bind:value={$formData.lecture_hours}
										placeholder="Lecture Hours"
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="lab_hours">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Lab Hours</Form.Label>
									<Input
										type="number"
										{...props}
										bind:value={$formData.lab_hours}
										placeholder="Lab Hours"
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="unit">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Unit</Form.Label>
									<Input type="number" {...props} bind:value={$formData.unit} placeholder="Unit" />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
				</section>
			</ScrollArea>
			<AlertDialog.Footer class="mt-2 px-6 pb-6">
				<AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
				<Form.Button disabled={$submitting} class="relative">
					<ReqLoader isLoader={$submitting} />
					Update
				</Form.Button>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
