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
	interface Props {
		createProgramForm: SuperValidated<CreateProgramSchema>;
	}
</script>

<script lang="ts">
	const { createProgramForm }: Props = $props();

	const form = superForm(createProgramForm, {
		validators: zodClient(createProgramSchema),
		id: crypto.randomUUID(),
		onUpdate: async ({ result }) => {
			const { status, data } = result;

			switch (status) {
				case 200:
					toast.success('Program created successfully');

					reset();

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
							selections={[
								{ id: '1', label: 'CED', value: 'Civil Engineering Department' },
								{ id: '2', label: 'CSE', value: 'Computer Science and Engineering Department' },
								{ id: '3', label: 'CCE', value: 'Civil and Construction Engineering Department' },
								{ id: '4', label: 'CCE', value: 'Civil and Construction Engineering Department' },
								{ id: '5', label: 'CCE', value: 'Civil and Construction Engineering Department' },
								{ id: '6', label: 'CCE', value: 'Civil and Construction Engineering Department' },
								{ id: '7', label: 'CCE', value: 'Civil and Construction Engineering Department' },
								{ id: '8', label: 'CCE', value: 'Civil and Construction Engineering Department' }
							]}
							bind:selected_id={$formData.department_id}
						>
							{#snippet loopChild({ selectedItem })}
								<div class="flex flex-col">
									<span class="text-sm">{selectedItem.label}</span>
									<span class="text-xs text-muted-foreground">{selectedItem.value}</span>
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
