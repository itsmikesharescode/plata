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

	interface Props {
		createFacultyForm: SuperValidated<CreateFacultySchema>;
	}
</script>

<script lang="ts">
	const { createFacultyForm }: Props = $props();

	const form = superForm(createFacultyForm, {
		validators: zodClient(createFacultySchema),
		id: crypto.randomUUID(),
		onUpdate: async ({ result }) => {
			const { status, data } = result;

			switch (status) {
				case 200:
					toast.success('Faculty created successfully');

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
		>Create Faculty</AlertDialog.Trigger
	>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Create Faculty</AlertDialog.Title>
			<AlertDialog.Description>
				Fill the form below to create a new faculty.
			</AlertDialog.Description>
		</AlertDialog.Header>

		<form method="POST" action="?/createFacultyEvent" use:enhance>
			<Form.Field {form} name="department_id">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Department</Form.Label>
						<Textarea
							{...props}
							bind:value={$formData.department_id}
							placeholder="Department dropdown"
						/>
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

			<Form.Field {form} name="academic_rank">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Academic Rank</Form.Label>
						<Input
							{...props}
							bind:value={$formData.academic_rank}
							placeholder="Faculty Academic Rank"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="status">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Status</Form.Label>
						<Textarea {...props} bind:value={$formData.status} placeholder="Faculty Status" />
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
