<script lang="ts" module>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { createFacultySchema, type CreateFacultySchema } from '../schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { toast } from 'svelte-sonner';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import SimplePicker from '$lib/components/general/custom-pickers/simple-picker.svelte';
	import { academicRanks } from '$lib';
	import { page } from '$app/state';
	import type { DepartmentDropdown } from '../../../../../+layout.svelte';

	interface Props {
		createFacultyForm: SuperValidated<CreateFacultySchema>;
	}
</script>

<script lang="ts">
	const { createFacultyForm }: Props = $props();

	const departmentsDropdown = $derived(page.data.departmentsDropdown) as DepartmentDropdown;

	let open = $state(false);

	const form = superForm(createFacultyForm, {
		validators: zodClient(createFacultySchema),
		id: crypto.randomUUID(),
		onUpdate: async ({ result }) => {
			const { status, data } = result;

			switch (status) {
				case 200:
					toast.success(data.msg);
					reset();
					open = false;

					break;
				case 401:
					toast.error(data.msg);
					break;
			}
		}
	});

	const { form: formData, enhance, reset, submitting } = form;
</script>

<AlertDialog.Root
	bind:open
	onOpenChange={() => {
		reset();
	}}
>
	<AlertDialog.Trigger class={buttonVariants({ variant: 'default' })}
		>Create Faculty</AlertDialog.Trigger
	>
	<AlertDialog.Content class="flex max-h-[100dvh] flex-col p-0">
		<AlertDialog.Header class="px-6 pt-6">
			<AlertDialog.Title>Create Faculty</AlertDialog.Title>
			<AlertDialog.Description>
				Fill the form below to create a new faculty.
			</AlertDialog.Description>
		</AlertDialog.Header>

		<form method="POST" action="?/createFacultyEvent" use:enhance>
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
					Create
				</Form.Button>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
