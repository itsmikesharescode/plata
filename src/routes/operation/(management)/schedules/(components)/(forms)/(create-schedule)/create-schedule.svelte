<script lang="ts" module>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { createScheduleSchema, type CreateScheduleSchema } from '../schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { toast } from 'svelte-sonner';
	import SimplePicker from '$lib/components/general/custom-pickers/simple-picker.svelte';
	import * as Resizable from '$lib/components/ui/resizable/index.js';

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
	<AlertDialog.Content class="flex max-h-[100dvh] max-w-[1200px] flex-col overflow-hidden p-0">
		<AlertDialog.Header class="p-6 pb-0">
			<AlertDialog.Title>Create Schedule</AlertDialog.Title>
			<AlertDialog.Description>
				Fill the form below to create a new schedule.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action="?/createScheduleEvent" use:enhance>
			<Resizable.PaneGroup direction="vertical" class="min-h-[80dvh]">
				<Resizable.Pane defaultSize={20}>
					<div class="grid gap-4 px-6 md:grid-cols-3">
						<Form.Field {form} name="department_id">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Department</Form.Label>

									<SimplePicker
										placeholder="Select Department"
										selections={[
											{ id: '1', label: 'CED', value: 'Civil Engineering Department' },
											{
												id: '2',
												label: 'CSE',
												value: 'Computer Science and Engineering Department'
											},
											{
												id: '3',
												label: 'CCE',
												value: 'Civil and Construction Engineering Department'
											}
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

						<Form.Field {form} name="faculty_id">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Faculty</Form.Label>

									<SimplePicker
										placeholder="Select Department"
										selections={[
											{
												id: '1',
												label: 'Faculty 1',
												value: 'Faculty 1'
											},
											{
												id: '2',
												label: 'Faculty 2',
												value: 'Faculty 2'
											}
										]}
										bind:selected_id={$formData.faculty_id}
									>
										{#snippet loopChild({ selectedItem })}
											<div class="flex flex-col">
												<span class="text-sm">{selectedItem.label}</span>
												<span class="text-xs text-muted-foreground">{selectedItem.value}</span>
											</div>
										{/snippet}
									</SimplePicker>
									<input name={props.name} type="hidden" value={$formData.faculty_id} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="program_id">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Program</Form.Label>

									<SimplePicker
										placeholder="Select Program"
										selections={[
											{
												id: '1',
												label: 'Program 1',
												value: 'Program 1'
											},
											{
												id: '2',
												label: 'Program 2',
												value: 'Program 2'
											}
										]}
										bind:selected_id={$formData.program_id}
									>
										{#snippet loopChild({ selectedItem })}
											<div class="flex flex-col">
												<span class="text-sm">{selectedItem.label}</span>
												<span class="text-xs text-muted-foreground">{selectedItem.value}</span>
											</div>
										{/snippet}
									</SimplePicker>
									<input name={props.name} type="hidden" value={$formData.program_id} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="year_and_section_id">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Year and Section</Form.Label>

									<SimplePicker
										placeholder="Select Year and Section"
										selections={[
											{
												id: '1',
												label: 'CBS2E',
												value: 'CBS2E'
											},
											{
												id: '2',
												label: 'MKL2E',
												value: 'MKL2E'
											}
										]}
										bind:selected_id={$formData.year_and_section_id}
									>
										{#snippet loopChild({ selectedItem })}
											<div class="flex flex-col">
												<span class="text-sm">{selectedItem.label}</span>
												<span class="text-xs text-muted-foreground">{selectedItem.value}</span>
											</div>
										{/snippet}
									</SimplePicker>
									<input name={props.name} type="hidden" value={$formData.year_and_section_id} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="semester">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Semester</Form.Label>

									<SimplePicker
										placeholder="Select Semester"
										selections={[
											{
												id: '1',
												label: 'First Semester',
												value: 'First Semester'
											},
											{
												id: '2',
												label: 'Second Semester',
												value: 'Second Semester'
											},
											{
												id: '3',
												label: 'Third Semester',
												value: 'Third Semester'
											}
										]}
										bind:selected_id={$formData.semester}
									>
										{#snippet loopChild({ selectedItem })}
											<div class="flex flex-col">
												<span class="text-sm">{selectedItem.label}</span>
												<span class="text-xs text-muted-foreground">{selectedItem.value}</span>
											</div>
										{/snippet}
									</SimplePicker>
									<input name={props.name} type="hidden" value={$formData.semester} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
				</Resizable.Pane>
				<Resizable.Handle withHandle class="bg-green-500" />
				<Resizable.Pane defaultSize={70} class="flex flex-col">
					<AlertDialog.Header class="p-6 pb-0">
						<AlertDialog.Title>Assign Teaching Form</AlertDialog.Title>
						<AlertDialog.Description>
							Fill the form below to assign teaching to a faculty.
						</AlertDialog.Description>
					</AlertDialog.Header>
					<ScrollArea class="mt-5">
						<section class="flex flex-col">
							<div class="grid gap-4 overflow-auto px-6 md:grid-cols-3">
								<Form.Field {form} name="department_id">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Department</Form.Label>

											<SimplePicker
												placeholder="Select Department"
												selections={[
													{ id: '1', label: 'CED', value: 'Civil Engineering Department' },
													{
														id: '2',
														label: 'CSE',
														value: 'Computer Science and Engineering Department'
													},
													{
														id: '3',
														label: 'CCE',
														value: 'Civil and Construction Engineering Department'
													}
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

								<Form.Field {form} name="faculty_id">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Faculty</Form.Label>

											<SimplePicker
												placeholder="Select Department"
												selections={[
													{
														id: '1',
														label: 'Faculty 1',
														value: 'Faculty 1'
													},
													{
														id: '2',
														label: 'Faculty 2',
														value: 'Faculty 2'
													}
												]}
												bind:selected_id={$formData.faculty_id}
											>
												{#snippet loopChild({ selectedItem })}
													<div class="flex flex-col">
														<span class="text-sm">{selectedItem.label}</span>
														<span class="text-xs text-muted-foreground">{selectedItem.value}</span>
													</div>
												{/snippet}
											</SimplePicker>
											<input name={props.name} type="hidden" value={$formData.faculty_id} />
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>

								<Form.Field {form} name="program_id">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Program</Form.Label>

											<SimplePicker
												placeholder="Select Program"
												selections={[
													{
														id: '1',
														label: 'Program 1',
														value: 'Program 1'
													},
													{
														id: '2',
														label: 'Program 2',
														value: 'Program 2'
													}
												]}
												bind:selected_id={$formData.program_id}
											>
												{#snippet loopChild({ selectedItem })}
													<div class="flex flex-col">
														<span class="text-sm">{selectedItem.label}</span>
														<span class="text-xs text-muted-foreground">{selectedItem.value}</span>
													</div>
												{/snippet}
											</SimplePicker>
											<input name={props.name} type="hidden" value={$formData.program_id} />
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>

								<Form.Field {form} name="year_and_section_id">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Year and Section</Form.Label>

											<SimplePicker
												placeholder="Select Year and Section"
												selections={[
													{
														id: '1',
														label: 'CBS2E',
														value: 'CBS2E'
													},
													{
														id: '2',
														label: 'MKL2E',
														value: 'MKL2E'
													}
												]}
												bind:selected_id={$formData.year_and_section_id}
											>
												{#snippet loopChild({ selectedItem })}
													<div class="flex flex-col">
														<span class="text-sm">{selectedItem.label}</span>
														<span class="text-xs text-muted-foreground">{selectedItem.value}</span>
													</div>
												{/snippet}
											</SimplePicker>
											<input
												name={props.name}
												type="hidden"
												value={$formData.year_and_section_id}
											/>
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>

								<Form.Field {form} name="semester">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Semester</Form.Label>

											<SimplePicker
												placeholder="Select Semester"
												selections={[
													{
														id: '1',
														label: 'First Semester',
														value: 'First Semester'
													},
													{
														id: '2',
														label: 'Second Semester',
														value: 'Second Semester'
													},
													{
														id: '3',
														label: 'Third Semester',
														value: 'Third Semester'
													}
												]}
												bind:selected_id={$formData.semester}
											>
												{#snippet loopChild({ selectedItem })}
													<div class="flex flex-col">
														<span class="text-sm">{selectedItem.label}</span>
														<span class="text-xs text-muted-foreground">{selectedItem.value}</span>
													</div>
												{/snippet}
											</SimplePicker>
											<input name={props.name} type="hidden" value={$formData.semester} />
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</div>
						</section>
					</ScrollArea>
				</Resizable.Pane>
			</Resizable.PaneGroup>

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
