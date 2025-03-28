<script lang="ts" module>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { createDepSchema, type CreateDepSchema } from '../schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import { toast } from 'svelte-sonner';

	interface Props {
		createDepForm: SuperValidated<CreateDepSchema>;
	}
</script>

<script lang="ts">
	const { createDepForm }: Props = $props();

	const form = superForm(createDepForm, {
		validators: zodClient(createDepSchema),
		id: crypto.randomUUID(),
		onUpdate: async ({ result }) => {
			const { status, data } = result;

			switch (status) {
				case 200:
					toast.success('Department created successfully');
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
		>Create Department</AlertDialog.Trigger
	>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Create Department</AlertDialog.Title>
			<AlertDialog.Description>
				Fill the form below to create a new department.
			</AlertDialog.Description>
		</AlertDialog.Header>

		<form method="POST" action="?/createDepEvent" use:enhance>
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
					Create
				</Form.Button>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
