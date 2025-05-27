<script lang="ts" module>
	import * as Table from '$lib/components/ui/table/index.js';
	import {
		getSubjectCodeTitleUnitLecLabById,
		getClassroomById,
		calculateTotalUnits
	} from './+layout.svelte';
	import { getLeaders } from './+layout.svelte';
	import { timestampToSelectedTime } from '$lib/components/general/custom-pickers/time-picker.svelte';
	const transformSchedulesToFormattedType = (schedules: any): any => {
		const formattedSchedules: any = [];

		// Group schedules by program, year, and section
		const groupedSchedules: Record<string, any> = {};

		schedules.forEach((schedule: any) => {
			const departmentName = schedule.departments_tb.department_name;
			const programName = schedule.programs_tb.program_name;
			const yearLevel = schedule.yearlevels_and_sections_tb.year;
			const section = schedule.yearlevels_and_sections_tb.section;
			const semester = schedule.semester;
			const key = `${programName}-${yearLevel}-${section}`;

			if (!groupedSchedules[key]) {
				groupedSchedules[key] = {
					program: programName,
					department: departmentName,
					year_level: yearLevel,
					section: section,
					semester: semester,
					subjects: []
				};
			}

			// Transform each assigned subject into the required format
			schedule.assigned_subjects.forEach((subject: any) => {
				// Format the schedule time
				const startTime = timestampToSelectedTime(subject.start_time);
				const endTime = timestampToSelectedTime(subject.end_time);
				const scheduleTime = `${subject.day} ${startTime.hour}:${startTime.minute} ${startTime.ampm} - ${endTime.hour}:${endTime.minute} ${endTime.ampm}`;

				// Create the subject display data
				const subjectDisplay: any = {
					code: subject.code || '',
					course_code: subject.subject_id, // Replace with actual field if available
					course_title: subject.subject_id, // Replace with actual field if available
					units: subject.subject_id, // Replace with actual field if available
					lec_hrs: subject.subject_id, // Replace with actual field if available
					lab_hrs: subject.subject_id, // Replace with actual field if available
					instructor: schedule.faculties_tb.fullname,
					schedule: scheduleTime,
					room: subject.classroom_id // Replace with actual field if available
				};

				groupedSchedules[key].subjects.push(subjectDisplay);
			});
		});

		// Convert the grouped object back to an array
		for (const key in groupedSchedules) {
			formattedSchedules.push(groupedSchedules[key]);
		}

		return formattedSchedules;
	};
</script>

<script lang="ts">
	const { data } = $props();

	let formattedSchedules = $derived(
		data.schedules ? transformSchedulesToFormattedType(data.schedules) : []
	);
</script>

<main class="flex flex-col gap-10 p-4">
	{#if !data.schedules?.length}
		<section class="flex flex-col items-center justify-center">
			<span class="text-2xl font-bold text-muted-foreground">No created schedules found</span>
		</section>
	{/if}

	{#each formattedSchedules as schedule, index}
		<section class="flex flex-col gap-10">
			<div class="grid grid-cols-[auto_auto]">
				<enhanced:img src="./(assets)/header-photo.png" class="h-full w-full object-cover" />
				<div
					class=" flex h-full flex-col items-center justify-center gap-2 bg-white p-5 text-black"
				>
					<span class="text-2xl font-bold">CLASS SCHEDULE FORM</span>
					<span class="max-w-xs text-center text-xl">{schedule.department.toUpperCase()}</span>
					<span class="text-lg">{schedule.semester}; Academic Year 2024-2025</span>
				</div>
			</div>

			<div class="flex flex-col text-xs">
				<span>Program: <strong>{schedule.program}</strong></span>
				<span>Year Level: <strong>{schedule.year_level}</strong></span>
				<span>Section: <strong>{schedule.section}</strong></span>
			</div>

			{#snippet THead(title: string)}
				<Table.Head class="border-[1px] border-primary text-center font-bold text-primary"
					>{title}</Table.Head
				>
			{/snippet}

			{#snippet TRow(title: string)}
				<Table.Cell class="border-[1px] border-primary text-center">{title}</Table.Cell>
			{/snippet}

			<!--Fetching snippet-->

			<Table.Root class="text-xs">
				<Table.Header class="border-[1px] border-primary">
					<Table.Row class="border-[1px] border-primary">
						{@render THead('Code')}
						{@render THead('Course Code')}
						{@render THead('CourseTitle')}
						{@render THead('Units')}
						{@render THead('Lec(Hrs)')}
						{@render THead('Lab(Hrs)')}
						{@render THead('Instructor')}
						{@render THead('Schedule')}
						{@render THead('Room')}
					</Table.Row>
				</Table.Header>
				<Table.Body class="border-[1px] border-primary">
					{#each schedule.subjects as subject}
						<Table.Row class="border-[1px] border-primary">
							{@render TRow(subject.code)}

							{#await getSubjectCodeTitleUnitLecLabById(subject.course_code)}
								{@render TRow('loading ...')}
								{@render TRow('loading ...')}
								{@render TRow('loading ...')}
								{@render TRow('loading ...')}
								{@render TRow('loading ...')}
							{:then subjectCodeTitleUnitLecLab}
								{@render TRow(subjectCodeTitleUnitLecLab?.course_code ?? '')}
								{@render TRow(subjectCodeTitleUnitLecLab?.course_name ?? '')}
								{@render TRow(`${subjectCodeTitleUnitLecLab?.unit ?? ''}`)}
								{@render TRow(`${subjectCodeTitleUnitLecLab?.lecture_hours ?? ''}`)}
								{@render TRow(`${subjectCodeTitleUnitLecLab?.lab_hours ?? ''}`)}
							{/await}

							{@render TRow(subject.instructor)}
							{@render TRow(subject.schedule)}

							{#await getClassroomById(subject.room)}
								{@render TRow('loading ...')}
							{:then classroomName}
								{@render TRow(classroomName ?? '')}
							{/await}
						</Table.Row>
					{/each}

					{#await calculateTotalUnits(schedule.subjects.map((subject: any) => subject.course_code))}
						<Table.Row class="border-[1px] border-primary">
							<Table.Cell class=""></Table.Cell>
							<Table.Cell class=""></Table.Cell>
							<Table.Cell class="border-[1px] border-primary text-center font-bold">
								Total Units
							</Table.Cell>
							<Table.Cell class="border-[1px] border-primary text-center">Loading...</Table.Cell>
							<Table.Cell class="border-[1px] border-primary text-center">Loading...</Table.Cell>
							<Table.Cell class="border-[1px] border-primary text-center">Loading...</Table.Cell>
						</Table.Row>
					{:then totals}
						<Table.Row class="border-[1px] border-primary">
							<Table.Cell class=""></Table.Cell>
							<Table.Cell class=""></Table.Cell>
							<Table.Cell class="border-[1px] border-primary text-center font-bold">
								Total Units
							</Table.Cell>
							<Table.Cell class="border-[1px] border-primary text-center"
								>{totals?.total_unit || 0}</Table.Cell
							>
							<Table.Cell class="border-[1px] border-primary text-center"
								>{totals?.total_lecture_hours || 0}</Table.Cell
							>
							<Table.Cell class="border-[1px] border-primary text-center"
								>{totals?.total_lab_hours || 0}</Table.Cell
							>
						</Table.Row>
					{/await}
				</Table.Body>
			</Table.Root>
		</section>

		<section class="grid grid-cols-[1fr_2fr_1fr] text-xs font-bold">
			<span>Prepared by:</span>
			<span>Recommending Approval:</span>
			<span>Approved:</span>
		</section>

		{#snippet PersonTemplate(name: string, position: string)}
			<div class="flex flex-col items-center justify-center">
				<span class="text-center text-xs underline">{name}</span>
				<span class="text-center text-xs font-bold">{position}</span>
			</div>
		{/snippet}

		<section class="grid grid-cols-4">
			{#await getLeaders()}
				{@render PersonTemplate('loading ...', 'loading ...')}
				{@render PersonTemplate('loading ...', 'loading ...')}
				{@render PersonTemplate('loading ...', 'loading ...')}
				{@render PersonTemplate('loading ...', 'loading ...')}
			{:then leaders}
				{#if leaders}
					{@render PersonTemplate(leaders[0].program_chairperson, 'Program Chairperson')}
					{@render PersonTemplate(leaders[0].univ_registrar, 'University Registrar')}
					{@render PersonTemplate(
						leaders[0].vp_academic_affairs,
						'Vice President for Academic Affairs'
					)}
					{@render PersonTemplate(leaders[0].univ_president, 'University President')}
				{/if}
			{/await}
		</section>

		{#if index !== (formattedSchedules?.length ?? 0) - 1}
			<div class="break-after-page"></div>
		{/if}
	{/each}
</main>
