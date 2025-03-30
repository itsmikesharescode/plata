<script lang="ts" module>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { createYnsSchema, type CreateYnsSchema } from '../schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import { toast } from 'svelte-sonner';

	interface Props {
		createYnsForm: SuperValidated<CreateYnsSchema>;
	}
</script>

<script lang="ts">
	const { createYnsForm }: Props = $props();

	let open = $state(false);

	const form = superForm(createYnsForm, {
		validators: zodClient(createYnsSchema),
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
		>Create Year and Section</AlertDialog.Trigger
	>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Create Year and Section</AlertDialog.Title>
			<AlertDialog.Description>
				Fill the form below to create a new year and section.
			</AlertDialog.Description>
		</AlertDialog.Header>

		<form method="POST" action="?/createYnsEvent" use:enhance>
			<Form.Field {form} name="year">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Year</Form.Label>
						<Input {...props} bind:value={$formData.year} placeholder="Year" />
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
					Create
				</Form.Button>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
