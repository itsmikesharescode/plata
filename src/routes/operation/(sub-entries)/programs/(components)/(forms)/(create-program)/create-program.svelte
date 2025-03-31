<script lang="ts" module>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { createProgramSchema, type CreateProgramSchema } from '../schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import { toast } from 'svelte-sonner';
	import SimplePicker from '$lib/components/general/custom-pickers/simple-picker.svelte';
	import { page } from '$app/state';
	import type { DepartmentDropdown } from '../../../../../+layout.svelte';

	interface Props {
		createProgramForm: SuperValidated<CreateProgramSchema>;
	}
</script>

<script lang="ts">
	const { createProgramForm }: Props = $props();
	const departmentsDropdown = $derived(page.data.departmentsDropdown) as DepartmentDropdown;

	let open = $state(false);

	const form = superForm(createProgramForm, {
		validators: zodClient(createProgramSchema),
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
		>Create Program</AlertDialog.Trigger
	>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Create Program</AlertDialog.Title>
			<AlertDialog.Description>
				Fill the form below to create a new program.
			</AlertDialog.Description>
		</AlertDialog.Header>

		<form method="POST" action="?/createProgramEvent" use:enhance>
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

			<Form.Field {form} name="program_name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Program Name</Form.Label>
						<Input {...props} bind:value={$formData.program_name} placeholder="Program Name" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="program_code">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Program Code</Form.Label>
						<Input {...props} bind:value={$formData.program_code} placeholder="Program Code" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<AlertDialog.Footer>
				<AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
				<Form.Button disabled={$submitting} class="relative">
					<ReqLoader isLoader={$submitting} />
					Create
				</Form.Button>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
