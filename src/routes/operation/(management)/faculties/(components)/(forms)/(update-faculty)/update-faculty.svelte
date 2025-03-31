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
	import { untrack } from 'svelte';
	import type { DepartmentDropdown } from '../../../../../+layout.svelte';
	import { urlParamReducer } from '$lib/utils';

	interface Props {
		updateFacultyForm: SuperValidated<UpdateFacultySchema>;
	}

	const getFacultybyId = async (id: string) => {
		if (!page.data.supabase) return;
		const { data, error } = await page.data.supabase
			.from('faculties_tb')
			.select('*')
			.order('created_at')
			.eq('id', id)
			.single();

		if (error) return null;

		return data;
	};
</script>

<script lang="ts">
	const { updateFacultyForm }: Props = $props();
	const departmentsDropdown = $derived(page.data.departmentsDropdown) as DepartmentDropdown;
	const rowState = useRowState();

	const id = $derived(page.url.searchParams.get('id'));
	const deletionId = $derived(page.url.searchParams.get('deletion_id'));
	const activeRow = $derived(rowState.getActiveRow()) as FacultyTable | null;

	const form = superForm(updateFacultyForm, {
		validators: zodClient(updateFacultySchema),
		id: crypto.randomUUID(),
		dataType: 'json',
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
					$formData.department_id = activeRow.department_id;
					$formData.fullname = activeRow.fullname;
					$formData.academic_rank = activeRow.academic_rank;
					$formData.employment_status = activeRow.employment_status;
				} else {
					const faculty = await getFacultybyId(id);
					if (faculty) {
						$formData.id = faculty.id;
						$formData.department_id = faculty.department_id;
						$formData.fullname = faculty.fullname;
						$formData.academic_rank = faculty.academic_rank;
						$formData.employment_status = faculty.employment_status;
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

								<SimplePicker
									placeholder="Select Department"
									selections={departmentsDropdown?.map((v) => ({
										id: v.id,
										label: v.department_code,
										value: JSON.stringify({
											department_name: v.department_name,
											department_color: v.department_color
										})
									})) ?? []}
									bind:selected_id={$formData.department_id}
								>
									{#snippet loopChild({ selectedItem })}
										<div class="flex items-center gap-2">
											<div
												class="size-5 rounded-full"
												style="background-color: {JSON.parse(selectedItem.value).department_color}"
											></div>
											<div class="flex flex-col">
												<span class="text-sm">{selectedItem.label}</span>
												<span class="text-xs text-muted-foreground">
													{JSON.parse(selectedItem.value).department_name}
												</span>
											</div>
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
				<AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
				<Form.Button disabled={$submitting} class="relative">
					<ReqLoader isLoader={$submitting} />
					Update
				</Form.Button>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
