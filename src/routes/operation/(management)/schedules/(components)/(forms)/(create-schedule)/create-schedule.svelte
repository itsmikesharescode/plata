<script lang="ts" module>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { createScheduleSchema, type CreateScheduleSchema } from '../schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { toast } from 'svelte-sonner';

	interface Props {
		createScheduleForm: SuperValidated<CreateScheduleSchema>;
	}
</script>

<script lang="ts">
	const { createScheduleForm }: Props = $props();

	const form = superForm(createScheduleForm, {
		validators: zodClient(createScheduleSchema),
		id: crypto.randomUUID(),
		onUpdate: async ({ result }) => {
			const { status, data } = result;

			switch (status) {
				case 200:
					toast.success('Schedule created successfully');

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
	<AlertDialog.Trigger class={buttonVariants({ variant: 'default' })}>
		Create Schedule
	</AlertDialog.Trigger>
	<AlertDialog.Content class="flex max-h-[100dvh] flex-col p-0">
		<AlertDialog.Header class="p-6 pb-0">
			<AlertDialog.Title>Create Schedule</AlertDialog.Title>
			<AlertDialog.Description>
				Fill the form below to create a new schedule.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action="?/createScheduleEvent" use:enhance>
			<ScrollArea>
				<section class="max-h-[60dvh] px-6">
					<Form.Field {form} name="department_id">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Department</Form.Label>
								<Input
									{...props}
									bind:value={$formData.department_id}
									placeholder="Department dropdown"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="faculty_id">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Faculty</Form.Label>
								<Input
									{...props}
									bind:value={$formData.faculty_id}
									placeholder="Faculty dropdown"
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
