<script lang="ts" module>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { updateScheduleSchema, type UpdateScheduleSchema } from '../schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { toast } from 'svelte-sonner';
	import SimplePicker from '$lib/components/general/custom-pickers/simple-picker.svelte';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
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
	import type {
		ClassroomDropdown,
		DepartmentDropdown,
		FacultyDropdown,
		ProgramDropdown,
		SubjectDropdown,
		YearLevelsAndSectionsDropdown
	} from '../../../../../+layout.svelte';
	import { urlParamReducer } from '$lib/utils';
	import { handleSchedConflict } from '../../../../../+layout.svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { timestampToSelectedTime } from '$lib/components/general/custom-pickers/time-picker.svelte';
	interface Props {
		updateScheduleForm: SuperValidated<UpdateScheduleSchema>;
	}

	const getScheduleById = async (id: string) => {
		if (!page.data.supabase) return;
		const { data, error } = await page.data.supabase
			.from('schedules_tb')
			.select('*')
			.order('created_at', { ascending: false })
			.eq('id', id)
			.single();

		if (error) return null;

		return data;
	};
</script>

<script lang="ts">
	const { updateScheduleForm }: Props = $props();

	const rowState = useRowState();

	const departmentsDropdown = $derived(page.data.departmentsDropdown) as DepartmentDropdown;
	const programsDropdown = $derived(page.data.programsDropdown) as ProgramDropdown;
	const facultiesDropdown = $derived(page.data.facultiesDropdown) as FacultyDropdown;
	const yearLevelsAndSectionsDropdown = $derived(
		page.data.yearLevelsAndSectionsDropdown
	) as YearLevelsAndSectionsDropdown;
	const classroomsDropdown = $derived(page.data.classroomsDropdown) as ClassroomDropdown;
	const subjectsDropdown = $derived(page.data.subjectsDropdown) as SubjectDropdown;

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
		id: uuidv4(),
		onUpdate: async ({ result }) => {
			const { status, data } = result;

			switch (status) {
				case 200:
					toast.success('Schedule updated successfully');
					reset();
					rowState.setActiveRow(null);
					await goto(`${page.url.pathname}?${urlParamReducer('id', page)}`);

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
			untrack(async () => {
				if (activeRow) {
					$formData.id = activeRow.id;
					$formData.department_id = activeRow.department_id;
					$formData.faculty_id = activeRow.faculty_id;
					$formData.program_id = activeRow.program_id;
					$formData.year_and_section_id = activeRow.year_and_section_id;
					$formData.semester = activeRow.semester;
					$formData.assigned_subjects = activeRow.assigned_subjects;
				} else {
					const checkConflict = await handleSchedConflict(id);
					console.log(checkConflict);
					const schedule = await getScheduleById(id);
					if (schedule) {
						$formData.id = schedule.id;
						$formData.department_id = schedule.department_id;
						$formData.faculty_id = schedule.faculty_id;
						$formData.program_id = schedule.program_id;
						$formData.year_and_section_id = schedule.year_and_section_id;
						$formData.semester = schedule.semester;
						$formData.assigned_subjects = schedule.assigned_subjects.map((v) => ({
							...v,
							code: v.code ?? ''
						}));
					}
				}
			});
		}
	});

	const detectedLecLabUnit = (id: string) => {
		return subjectsDropdown?.find((v) => v.id === id);
	};

	const detectedClassroom = (id: string) => {
		return classroomsDropdown?.find((v) => v.id === id);
	};

	let showConflict = $state(false);

	const formatUtcTime = (isoString: string | undefined) => {
		if (!isoString) return '';
		const time = timestampToSelectedTime(isoString);
		return `${time.hour}:${time.minute}:${time.second} ${time.ampm}`;
	};
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
		await goto(`${page.url.pathname}?${urlParamReducer('id', page)}`);
	}}
>
	<AlertDialog.Content class="flex max-h-[100dvh] max-w-7xl flex-col overflow-hidden p-0">
		<div class="absolute">
			{#await handleSchedConflict(id ?? '')}
				<span>Checking for conflicts...</span>
			{:then data}
				{#if data}
					<div class="p-6 pb-0">
						<div class="flex items-center justify-center rounded-lg bg-secondary p-2">
							<span class="text-center text-base font-medium text-destructive dark:text-red-700"
								>{data}</span
							>
						</div>
					</div>
				{/if}
			{/await}
		</div>

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
															style="background-color: {JSON.parse(selectedItem.value)
																.department_color}"
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
												selections={facultiesDropdown?.map((v) => ({
													id: v.id,
													label: v.fullname,
													value: JSON.stringify({
														employment_status: v.employment_status,
														academic_rank: v.academic_rank,
														department_name: v.departments_tb.department_name
													})
												})) ?? []}
												bind:selected_id={$formData.faculty_id}
											>
												{#snippet loopChild({ selectedItem })}
													<div class="flex items-center gap-2">
														<div class="flex flex-col">
															<span class="text-sm">
																{selectedItem.label}
																<span class="text-xs font-medium text-destructive"
																	>({JSON.parse(selectedItem.value).employment_status})</span
																>
															</span>
															<div class="flex flex-col text-xs text-muted-foreground">
																<span>
																	{JSON.parse(selectedItem.value).academic_rank}
																</span>
																<span>
																	{JSON.parse(selectedItem.value).department_name}
																</span>
															</div>
														</div>
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
												selections={programsDropdown?.map((v) => ({
													id: v.id,
													label: v.program_code,
													value: JSON.stringify({
														program_name: v.program_name,
														department_name: v.departments_tb.department_name
													})
												})) ?? []}
												bind:selected_id={$formData.program_id}
											>
												{#snippet loopChild({ selectedItem })}
													<div class="flex flex-col">
														<span class="text-sm">{selectedItem.label}</span>
														<span class="text-xs text-muted-foreground">
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

								<!--Year level and section dropdown-->
								<Form.Field {form} name="year_and_section_id">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Year Level and Section</Form.Label>

											<SimplePicker
												placeholder="Select Year Level and Section"
												selections={yearLevelsAndSectionsDropdown?.map((v) => ({
													id: v.id,
													label: `${v.year} ${v.section}`,
													value: ''
												})) ?? []}
												bind:selected_id={$formData.year_and_section_id}
											/>

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
														id: '1st Term',
														label: '1st Term',
														value: '1st Term'
													},
													{
														id: '2nd Term',
														label: '2nd Term',
														value: '2nd Term'
													},
													{
														id: '3rd Term',
														label: '3rd Term',
														value: '3rd Term'
													}
												]}
												bind:selected_id={$formData.semester}
											/>

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
													id: uuidv4(),
													subject_id: '',
													classroom_id: '',
													start_time: '',
													end_time: '',
													day: '',
													code: ''
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
								class="relative flex flex-col gap-4 overflow-hidden rounded-lg border-2 bg-background p-6"
							>
								{#each $formData.assigned_subjects as _, index (index)}
									<div class="ove flex flex-col gap-4" in:fade>
										<!--Display subject name, start time, end time, and day-->
										<div class="grid grid-cols-2 items-center gap-4">
											<div class="flex flex-wrap items-center gap-2">
												<span class="text-lg font-medium">
													{subjectsDropdown?.find(
														(v) => v.id === $formData.assigned_subjects[index].subject_id
													)?.course_name}
												</span>

												{#if $formData.assigned_subjects[index].start_time && $formData.assigned_subjects[index].end_time}
													<span class="hidden text-lg text-muted-foreground md:block">
														{formatUtcTime($formData.assigned_subjects[index].start_time)}
														-
														{formatUtcTime($formData.assigned_subjects[index].end_time)}
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
															selections={subjectsDropdown?.map((v) => ({
																id: v.id,
																label: v.course_name,
																value: JSON.stringify({
																	course_code: v.course_code,
																	lecture_hours: v.lecture_hours,
																	lab_hours: v.lab_hours,
																	unit: v.unit
																})
															})) ?? []}
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
																			Lecture: {JSON.parse(selectedItem.value).lecture_hours}
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
															selections={classroomsDropdown?.map((v) => ({
																id: v.id,
																label: v.classroom_name,
																value: JSON.stringify({
																	department_name: v.departments_tb.department_name,
																	building_name: v.building_name
																})
															})) ?? []}
															bind:selected_id={$formData.assigned_subjects[index].classroom_id}
														>
															{#snippet loopChild({ selectedItem })}
																<div class="flex flex-col">
																	<div class="flex items-center gap-2">
																		<span class="text-sm">{selectedItem.label}</span>
																	</div>
																	<div class="flex flex-col text-xs text-muted-foreground">
																		<span>
																			Department: {JSON.parse(selectedItem.value).department_name}
																		</span>
																		<span>
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
													?.departments_tb.department_name ?? 'Auto-assigned'
											)}
										</div>

										<div class="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
											{@render readOnlyTemplate(
												'Lecture Hours',
												detectedLecLabUnit($formData.assigned_subjects[index].subject_id)
													?.lecture_hours ?? 'Auto-assigned'
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
																},
																{
																	id: 'MF',
																	label: 'MF',
																	value: 'Monday, Friday'
																},
																{
																	id: 'MW',
																	label: 'MW',
																	value: 'Monday, Wednesday'
																},
																{
																	id: 'SAT-SUN',
																	label: 'SAT-SUN',
																	value: 'Saturday, Sunday'
																},
																{
																	id: 'WF',
																	label: 'WF',
																	value: 'Wednesday, Friday'
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
