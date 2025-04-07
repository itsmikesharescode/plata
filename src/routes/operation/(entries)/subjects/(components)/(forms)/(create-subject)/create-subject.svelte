<script lang="ts" module>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { createSubSchema, type CreateSubSchema } from '../schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { toast } from 'svelte-sonner';

	interface Props {
		createSubForm: SuperValidated<CreateSubSchema>;
	}
</script>

<script lang="ts">
	const { createSubForm }: Props = $props();

	let open = $state(false);

	const form = superForm(createSubForm, {
		validators: zodClient(createSubSchema),
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
		>Create Subject</AlertDialog.Trigger
	>
	<AlertDialog.Content class="flex max-h-[100dvh] flex-col p-0">
		<AlertDialog.Header class="px-6 pt-6">
			<AlertDialog.Title>Create Subject</AlertDialog.Title>
			<AlertDialog.Description>Fill the form below to create a new subject.</AlertDialog.Description
			>
		</AlertDialog.Header>

		<form method="POST" action="?/createSubEvent" use:enhance>
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
									<Input
										step="0.01"
										type="number"
										{...props}
										bind:value={$formData.unit}
										placeholder="Unit"
									/>
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
					Create
				</Form.Button>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
