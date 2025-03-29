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
	import { sampleClassrooms, sampleDepartments, sampleSubjects } from '$lib';
	import TimePicker from '$lib/components/general/custom-pickers/time-picker.svelte';
	import { untrack } from 'svelte';
	import { Input } from '$lib/components/ui/input/index.js';

	interface Props {
		createScheduleForm: SuperValidated<CreateScheduleSchema>;
	}

	const detectedLecLabUnit = (id: string) => {
		return sampleSubjects.find((v) => v.id === id);
	};

	const detectedClassroom = (id: string) => {
		return sampleClassrooms.find((v) => v.id === id);
	};
</script>

<script lang="ts">
	const { createScheduleForm }: Props = $props();

	const form = superForm(createScheduleForm, {
		validators: zodClient(createScheduleSchema),
		dataType: 'json',
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

	let open = $state(false);

	$effect(() => {
		if (open) {
			untrack(() => {
				$formData.assigned_subjects = [
					{
						subject_id: '',
						classroom_id: '',
						start_time: '',
						end_time: '',
						day: ''
					}
				];
			});
		}
	});
</script>

{#snippet readOnlyTemplate(title: string, description: string | number | undefined)}
	<div class="flex flex-col gap-2">
		<span class="text-sm font-medium">{title}</span>
		<div
			class="flex h-10 w-full overflow-auto rounded-md border border-input bg-background px-3 py-2 text-base text-muted-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
		>
			{description}
		</div>
	</div>
{/snippet}

<AlertDialog.Root
	bind:open
	onOpenChange={() => {
		reset();
	}}
>
	<AlertDialog.Trigger class={buttonVariants({ variant: 'default' })}>
		Create Schedule
	</AlertDialog.Trigger>
	<AlertDialog.Content class="flex max-h-[100dvh] max-w-7xl flex-col overflow-hidden p-0">
		<AlertDialog.Header class="p-6 pb-0">
			<AlertDialog.Title>Create Schedule</AlertDialog.Title>
			<AlertDialog.Description>
				Fill the form below to create a new schedule.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action="?/createScheduleEvent" use:enhance>
			<Resizable.PaneGroup direction="vertical" class="min-h-[70dvh]">
				<Resizable.Pane defaultSize={20} class="flex flex-col">
					<ScrollArea class="mt-5">
						<section class="flex flex-col">
							<div class="grid gap-4 px-6 lg:md:grid-cols-3">
								<Form.Field {form} name="department_id">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Department</Form.Label>

											<SimplePicker
												placeholder="Select Department"
												selections={sampleDepartments.map((v) => ({
													id: v.id,
													label: v.department_code,
													value: JSON.stringify({
														department_name: v.department_name,
														department_color: v.department_color
													})
												}))}
												bind:selected_id={$formData.department_id}
											>
												{#snippet loopChild({ selectedItem })}
													<div class="flex items-center gap-2">
														<div
															style="background-color: {JSON.parse(selectedItem.value)
																.department_color}"
															class="size-4 rounded-full border-[1px]"
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

				<Resizable.Handle withHandle class="bg-green-500" />

				<Resizable.Pane defaultSize={40} minSize={30} class="flex flex-col">
					<AlertDialog.Header class="p-6 pb-0">
						<AlertDialog.Title>Assign Subjects</AlertDialog.Title>
						<AlertDialog.Description>
							Fill the form below to assign teaching to a faculty.
						</AlertDialog.Description>
					</AlertDialog.Header>
					<ScrollArea class="mt-5">
						<section class="flex flex-col px-6">
							<div class="flex flex-col gap-4 overflow-auto rounded-lg border-2 p-6">
								{#each $formData.assigned_subjects as _, index (index)}
									<div class="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
										<!--Subject dropdown-->
										<Form.Field {form} name={`assigned_subjects[${index}].subject_id`}>
											<Form.Control>
												{#snippet children({ props })}
													<Form.Label>Subject</Form.Label>

													<SimplePicker
														placeholder="Select Subject"
														selections={sampleSubjects.map((v) => ({
															id: v.id,
															label: v.course_name,
															value: JSON.stringify({
																course_code: v.course_code,
																lec_hours: v.lec_hours,
																lab_hours: v.lab_hours,
																unit: v.unit,
																code: ''
															})
														}))}
														bind:selected_id={$formData.assigned_subjects[index].subject_id}
													>
														{#snippet loopChild({ selectedItem })}
															<div class="flex flex-col">
																<div class="flex items-center gap-2">
																	<span class="text-sm text-muted-foreground">
																		{JSON.parse(selectedItem.value).course_code}
																	</span>
																	<span class="text-sm">({selectedItem.label})</span>
																</div>
																<div class="flex items-center gap-2">
																	<span class="text-xs text-muted-foreground">
																		Lecture: {JSON.parse(selectedItem.value).lec_hours}
																	</span>
																	<span class="text-xs text-muted-foreground">
																		Lab: {JSON.parse(selectedItem.value).lab_hours}
																	</span>
																	<span class="text-xs text-muted-foreground">
																		Unit: {JSON.parse(selectedItem.value).unit}
																	</span>
																</div>
															</div>
														{/snippet}
													</SimplePicker>
													<input
														name={props.name}
														type="hidden"
														value={$formData.assigned_subjects[index].subject_id}
													/>
												{/snippet}
											</Form.Control>
											<Form.FieldErrors />
										</Form.Field>

										<!--Classroom dropdown-->
										<Form.Field {form} name={`assigned_subjects[${index}].classroom_id`}>
											<Form.Control>
												{#snippet children({ props })}
													<Form.Label>Classroom</Form.Label>

													<SimplePicker
														placeholder="Select Classroom"
														selections={sampleClassrooms.map((v) => ({
															id: v.id,
															label: v.classroom_name,
															value: JSON.stringify({
																department_name: 'Sample dep name',
																building_name: v.building_name
															})
														}))}
														bind:selected_id={$formData.assigned_subjects[index].classroom_id}
													>
														{#snippet loopChild({ selectedItem })}
															<div class="flex flex-col">
																<div class="flex items-center gap-2">
																	<span class="text-sm">{selectedItem.label}</span>
																</div>
																<div class="flex items-center gap-2">
																	<span class="text-xs text-muted-foreground">
																		Department: {JSON.parse(selectedItem.value).department_name}
																	</span>
																	<span class="text-xs text-muted-foreground">
																		Building: {JSON.parse(selectedItem.value).building_name}
																	</span>
																</div>
															</div>
														{/snippet}
													</SimplePicker>
													<input
														name={props.name}
														type="hidden"
														value={$formData.assigned_subjects[index].classroom_id}
													/>
												{/snippet}
											</Form.Control>
											<Form.FieldErrors />
										</Form.Field>

										{@render readOnlyTemplate(
											'Building Name',
											detectedClassroom($formData.assigned_subjects[index].classroom_id)
												?.building_name ?? 'Auto-assigned'
										)}

										{@render readOnlyTemplate(
											'Department Name',
											detectedClassroom($formData.assigned_subjects[index].classroom_id)
												?.department_id ?? 'Auto-assigned'
										)}
									</div>

									<div class="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
										{@render readOnlyTemplate(
											'Lecture Hours',
											detectedLecLabUnit($formData.assigned_subjects[index].subject_id)
												?.lec_hours ?? 'Auto-assigned'
										)}

										{@render readOnlyTemplate(
											'Lab Hours',
											detectedLecLabUnit($formData.assigned_subjects[index].subject_id)
												?.lab_hours ?? 'Auto-assigned'
										)}

										{@render readOnlyTemplate(
											'Unit',
											detectedLecLabUnit($formData.assigned_subjects[index].subject_id)?.unit ??
												'Auto-assigned'
										)}

										{@render readOnlyTemplate(
											'Course Code',
											detectedLecLabUnit($formData.assigned_subjects[index].subject_id)
												?.course_code ?? 'Auto-assigned'
										)}
									</div>

									<div class="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
										<Form.Field {form} name={`assigned_subjects[${index}].start_time`}>
											<Form.Control>
												{#snippet children({ props })}
													<Form.Label>Start Time</Form.Label>
													<TimePicker
														placeholder="Select Start Time"
														bind:timeStamp={$formData.assigned_subjects[index].start_time}
													/>
													<input
														name={props.name}
														type="hidden"
														value={$formData.assigned_subjects[index].start_time}
													/>
												{/snippet}
											</Form.Control>
											<Form.FieldErrors />
										</Form.Field>

										<Form.Field {form} name={`assigned_subjects[${index}].end_time`}>
											<Form.Control>
												{#snippet children({ props })}
													<Form.Label>End Time</Form.Label>
													<TimePicker
														placeholder="Select End Time"
														bind:timeStamp={$formData.assigned_subjects[index].end_time}
													/>
													<input
														name={props.name}
														type="hidden"
														value={$formData.assigned_subjects[index].end_time}
													/>
												{/snippet}
											</Form.Control>
											<Form.FieldErrors />
										</Form.Field>

										<Form.Field {form} name={`assigned_subjects[${index}].day`}>
											<Form.Control>
												{#snippet children({ props })}
													<Form.Label>Days</Form.Label>

													<SimplePicker
														placeholder="Select Days"
														selections={[
															{
																id: 'MWF',
																label: 'MWF',
																value: 'Monday, Wednesday, Friday'
															},
															{
																id: 'TTH',
																label: 'TTH',
																value: 'Tuesday, Thursday'
															}
														]}
														bind:selected_id={$formData.assigned_subjects[index].day}
													>
														{#snippet loopChild({ selectedItem })}
															<div class="flex flex-col">
																<span class="text-sm">{selectedItem.label}</span>
																<span class="text-xs text-muted-foreground"
																	>{selectedItem.value}</span
																>
															</div>
														{/snippet}
													</SimplePicker>
													<input
														name={props.name}
														type="hidden"
														value={$formData.assigned_subjects[index].day}
													/>
												{/snippet}
											</Form.Control>
											<Form.FieldErrors />
										</Form.Field>

										<Form.Field {form} name={`assigned_subjects[${index}].code`}>
											<Form.Control>
												{#snippet children({ props })}
													<Form.Label>Code (Optional)</Form.Label>

													<Input
														placeholder="Enter Code"
														bind:value={$formData.assigned_subjects[index].code}
													/>
													<input
														name={props.name}
														type="hidden"
														value={$formData.assigned_subjects[index].code}
													/>
												{/snippet}
											</Form.Control>
											<Form.FieldErrors />
										</Form.Field>
									</div>
								{/each}
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
