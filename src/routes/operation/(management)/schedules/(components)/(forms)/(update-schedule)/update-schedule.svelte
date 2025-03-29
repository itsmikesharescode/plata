<script lang="ts" module>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { updateScheduleSchema, type UpdateScheduleSchema } from '../schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { toast } from 'svelte-sonner';
	import SimplePicker from '$lib/components/general/custom-pickers/simple-picker.svelte';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import {
		sampleClassrooms,
		sampleDepartments,
		sampleFaculties,
		samplePrograms,
		sampleSubjects,
		sampleYearAndSections
	} from '$lib';
	import TimePicker from '$lib/components/general/custom-pickers/time-picker.svelte';
	import { untrack } from 'svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import Plus from 'lucide-svelte/icons/plus';
	import Minus from 'lucide-svelte/icons/minus';
	import RotateCcw from 'lucide-svelte/icons/rotate-ccw';
	import { Button } from '$lib/components/ui/button';
	import { useDebounce } from 'runed';
	import { fade } from 'svelte/transition';
	import { useRowState } from '$lib/states/row-state.svelte';
	import { page } from '$app/state';
	import type { ScheduleTable } from '../../(table)/schema';
	import { goto } from '$app/navigation';
	interface Props {
		updateScheduleForm: SuperValidated<UpdateScheduleSchema>;
	}

	const detectedLecLabUnit = (id: string) => {
		return sampleSubjects.find((v) => v.id === id);
	};

	const detectedClassroom = (id: string) => {
		return sampleClassrooms.find((v) => v.id === id);
	};
</script>

<script lang="ts">
	const { updateScheduleForm }: Props = $props();

	const rowState = useRowState();

	const id = $derived(page.url.searchParams.get('id'));
	const deletionId = $derived(page.url.searchParams.get('deletion_id'));
	const activeRow = $derived(rowState.getActiveRow()) as ScheduleTable | null;

	let buttonState = $state({
		addButtonLoader: false,
		resetButtonLoader: false,
		removeById: ''
	});

	const form = superForm(updateScheduleForm, {
		validators: zodClient(updateScheduleSchema),
		dataType: 'json',
		id: crypto.randomUUID(),
		onUpdate: async ({ result }) => {
			const { status, data } = result;

			switch (status) {
				case 200:
					toast.success('Schedule updated successfully');

					reset();

					break;
				case 401:
					toast.error(data.msg);
					break;
			}
		}
	});

	const { form: formData, enhance, reset, submitting } = form;

	$effect(() => {
		if (id) {
			if (activeRow) {
				untrack(() => {
					$formData.id = crypto.randomUUID(); //activeRow.id;
					$formData.department_id = activeRow.department_id;
					$formData.faculty_id = activeRow.faculty_id;
					$formData.program_id = activeRow.program_id;
					$formData.year_and_section_id = activeRow.year_and_section_id;
					$formData.semester = activeRow.semester;
					$formData.assigned_subjects = activeRow.assigned_subjects;
				});
			} else {
				$formData.assigned_subjects = [
					{
						id: crypto.randomUUID(),
						subject_id: '',
						classroom_id: '',
						start_time: '',
						end_time: '',
						day: ''
					}
				];
			}
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
	open={!!id && !!!deletionId}
	onOpenChange={async () => {
		reset();
		rowState.setActiveRow(null);
		await goto('/operation/schedules');
	}}
>
	<AlertDialog.Content class="flex max-h-[100dvh] max-w-7xl flex-col overflow-hidden p-0">
		<AlertDialog.Header class="p-6 pb-0">
			<AlertDialog.Title>Update Schedule</AlertDialog.Title>
			<AlertDialog.Description>Fill the form below to update the schedule.</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action="?/updateScheduleEvent" use:enhance>
			<input name="id" type="hidden" value={$formData.id} />
			<Resizable.PaneGroup direction="vertical" class="min-h-[70dvh]">
				<Resizable.Pane defaultSize={20} class="flex flex-col">
					<ScrollArea class="mt-5">
						<section class="flex flex-col">
							<div class="grid gap-4 px-6 lg:md:grid-cols-3">
								<!--Department dropdown-->
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
												})) ?? []}
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

								<!--Faculty dropdown-->
								<Form.Field {form} name="faculty_id">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Faculty</Form.Label>

											<SimplePicker
												placeholder="Select Faculty"
												selections={sampleFaculties.map((v) => ({
													id: v.id,
													label: v.fullname,
													value: JSON.stringify({
														department_id: v.department_id,
														academic_rank: v.academic_rank,
														employment_status: v.employment_status
													})
												})) ?? []}
												bind:selected_id={$formData.faculty_id}
											>
												{#snippet loopChild({ selectedItem })}
													<div class="flex flex-col">
														<span class="text-sm">{selectedItem.label}</span>
														<span class="text-xs text-muted-foreground">
															{JSON.parse(selectedItem.value).employment_status} /
															{JSON.parse(selectedItem.value).academic_rank}
														</span>
													</div>
												{/snippet}
											</SimplePicker>
											<input name={props.name} type="hidden" value={$formData.faculty_id} />
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>

								<!--Program dropdown-->
								<Form.Field {form} name="program_id">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Program</Form.Label>

											<SimplePicker
												placeholder="Select Program"
												selections={samplePrograms.map((v) => ({
													id: v.id,
													label: v.program_code,
													value: JSON.stringify({
														department_id: v.department_id,
														program_name: v.program_name
													})
												})) ?? []}
												bind:selected_id={$formData.program_id}
											>
												{#snippet loopChild({ selectedItem })}
													<div class="flex flex-col">
														<span class="text-sm">{selectedItem.label}</span>
														<span class="text-xs text-muted-foreground">
															<!-- {JSON.parse(selectedItem.value).department_id} / -->
															{JSON.parse(selectedItem.value).program_name}
														</span>
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
											<Form.Label>Year Level and Section</Form.Label>

											<SimplePicker
												placeholder="Select Year and Section"
												selections={sampleYearAndSections.map((v) => ({
													id: v.id,
													label: `${v.year_level} - ${v.section}`,
													value: `${v.year_level} - ${v.section}`
												})) ?? []}
												bind:selected_id={$formData.year_and_section_id}
											>
												{#snippet loopChild({ selectedItem })}
													<div class="flex flex-col">
														<span class="text-sm">{selectedItem.label}</span>
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
														id: 'First Semester',
														label: 'First Semester',
														value: 'First Semester'
													},
													{
														id: 'Second Semester',
														label: 'Second Semester',
														value: 'Second Semester'
													},
													{
														id: 'Third Semester',
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

				<Resizable.Pane defaultSize={45} minSize={65} class="flex flex-col bg-secondary">
					<div class="grid grid-cols-2 items-center gap-4 p-6 pb-0">
						<AlertDialog.Header>
							<AlertDialog.Title>Assign Subjects</AlertDialog.Title>
							<AlertDialog.Description>
								Fill the form below to assign teaching to a faculty.
							</AlertDialog.Description>
						</AlertDialog.Header>

						<div class="flex justify-end gap-2">
							<!--Reset subjects button-->
							{#if $formData.assigned_subjects.length > 2}
								<Button
									onclick={() => {
										buttonState.resetButtonLoader = true;

										const delayThis = useDebounce(
											() => {
												const takeFirst = $formData.assigned_subjects[0];
												$formData.assigned_subjects = [takeFirst];

												buttonState.resetButtonLoader = false;
											},
											() => 300
										);

										delayThis();
									}}
									disabled={buttonState.resetButtonLoader}
									size="sm"
									variant="destructive"
									class="relative"
								>
									<ReqLoader isLoader={buttonState.resetButtonLoader} class="bg-destructive" />
									<RotateCcw class="size-4" />
									<span class="hidden md:block">Reset Subjects</span>
								</Button>
							{/if}

							<!--Add subject button-->
							<Button
								onclick={() => {
									buttonState.addButtonLoader = true;

									const delayThis = useDebounce(
										() => {
											$formData.assigned_subjects = [
												...$formData.assigned_subjects,
												{
													id: crypto.randomUUID(),
													subject_id: '',
													classroom_id: '',
													start_time: '',
													end_time: '',
													day: ''
												}
											];

											buttonState.addButtonLoader = false;
										},
										() => 300
									);

									delayThis();
								}}
								disabled={buttonState.addButtonLoader}
								size="sm"
								class="relative"
							>
								<ReqLoader isLoader={buttonState.addButtonLoader} />
								<Plus class="size-4" />
								<span class="hidden md:block">Add Subject</span>
							</Button>
						</div>
					</div>
					<ScrollArea class="mt-5">
						<section class="flex flex-col px-6">
							<div
								class="relative flex flex-col gap-4 overflow-hidden rounded-lg border-2 bg-white p-6"
							>
								{#each $formData.assigned_subjects as _, index (index)}
									<div class="ove flex flex-col gap-4" in:fade>
										<div class="grid grid-cols-2 items-center gap-4">
											<div class="flex flex-wrap items-center gap-2">
												<span class="text-lg font-medium">
													{sampleSubjects.find(
														(v) => v.id === $formData.assigned_subjects[index].subject_id
													)?.course_name}
												</span>

												{#if $formData.assigned_subjects[index].start_time && $formData.assigned_subjects[index].end_time}
													<span class="hidden text-lg text-muted-foreground md:block">
														{new Date(
															$formData.assigned_subjects[index].start_time
														).toLocaleTimeString()}
														-
														{new Date(
															$formData.assigned_subjects[index].end_time
														).toLocaleTimeString()}
													</span>
												{/if}

												{#if $formData.assigned_subjects[index].day}
													<span class="hidden text-lg md:block">
														{$formData.assigned_subjects[index].day}
													</span>
												{/if}
											</div>

											<!--Remove subject button-->
											{#if $formData.assigned_subjects.length > 1}
												<Button
													onclick={() => {
														buttonState.removeById = _.id;

														const delayThis = useDebounce(
															() => {
																const subjects = [...$formData.assigned_subjects];
																subjects.splice(index, 1);
																$formData.assigned_subjects = subjects;

																buttonState.removeById = '';
															},
															() => 300
														);

														delayThis();
													}}
													disabled={buttonState.removeById === _.id}
													variant="destructive"
													size="sm"
													class="relative ml-auto"
												>
													<ReqLoader
														isLoader={buttonState.removeById === _.id}
														class="bg-destructive"
													/>
													<Minus class="size-4" />
													<span class="hidden md:block">Remove Subject</span>
												</Button>
											{/if}
										</div>

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
					Update
				</Form.Button>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
