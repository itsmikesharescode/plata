<script lang="ts" module>
	import {
		getSubjectCodeTitleUnitLecLabById,
		calculateTotalUnits,
		getYearLevelAndSectionById
	} from '../+layout.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
</script>

<script lang="ts">
	const { data } = $props();

	$effect(() => console.log(data.schedule));
</script>

<main class="flex flex-col gap-10 p-4">
	<div class="grid grid-cols-[auto_auto]">
		<enhanced:img src="../(assets)/header-photo.png" class="h-full w-full object-cover" />
		<div class=" flex h-full flex-col items-center justify-center gap-2 bg-white p-5 text-black">
			<span class="text-2xl font-bold">FACULTY TEACHING FORM</span>
		</div>
	</div>

	{#snippet PlaceholderTemplt(title: string, value: string)}
		<div class="grid grid-cols-[auto_1fr] gap-2">
			<span class="text-base">{title}:</span>
			<div class="">
				<span class="text-base font-bold">{value}</span>
				<div class="w-full border-b border-primary"></div>
			</div>
		</div>
	{/snippet}

	{#snippet THead(title: string)}
		<Table.Head class="border-[1px] border-primary text-center font-bold text-primary">
			{title}
		</Table.Head>
	{/snippet}

	{#snippet TRow(title: string)}
		<Table.Cell class="border-[1px] border-primary text-center">{title}</Table.Cell>
	{/snippet}

	{#snippet PersonTemplate(name: string, position: string)}
		<div class="flex flex-col items-center justify-center">
			<span class="text-center text-xs underline">{name}</span>
			<span class="text-center text-xs font-bold">{position}</span>
		</div>
	{/snippet}

	<div class="grid grid-cols-2 gap-4">
		{@render PlaceholderTemplt(
			'Name of Faculty',
			data.schedule?.faculties_tb?.fullname.toUpperCase() ?? ''
		)}
		{@render PlaceholderTemplt('Campus', 'Legawe Campus')}
		{@render PlaceholderTemplt(
			'Academic Rank',
			data.schedule?.faculties_tb?.academic_rank.toUpperCase() ?? ''
		)}
		{@render PlaceholderTemplt(
			'College',
			data.schedule?.departments_tb?.department_name.toUpperCase() ?? ''
		)}
		{@render PlaceholderTemplt(
			'Status',
			data.schedule?.faculties_tb?.employment_status.toUpperCase() ?? ''
		)}
	</div>

	<Table.Root class="text-xs">
		<!-- <Table.Caption>A list of your recent invoices.</Table.Caption> -->
		<Table.Header class="border-[1px] border-primary">
			<Table.Row>
				{@render THead('CODE')}
				{@render THead('YEAR & SECTION')}
				{@render THead('COURSE CODE')}
				{@render THead('COURSE DESCRIPTION')}
				{@render THead('UNITS')}
				{@render THead('LECTURE HOURS')}
				{@render THead('LAB HOURS')}
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.schedule?.assigned_subjects ?? [] as subject}
				<Table.Row>
					{@render TRow(`${subject.code}`)}

					{#await getYearLevelAndSectionById(data.schedule?.year_and_section_id ?? '')}
						{@render TRow('loading ...')}
					{:then yearLevelAndSection}
						{@render TRow(
							`${yearLevelAndSection?.year ?? ''} ${yearLevelAndSection?.section ?? ''}`
						)}
					{/await}

					{#await getSubjectCodeTitleUnitLecLabById(subject.subject_id)}
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
				</Table.Row>
			{/each}

			{#await calculateTotalUnits(data.schedule?.assigned_subjects.map((subject: any) => subject.subject_id) ?? [])}
				<Table.Row class="border-[1px] border-primary">
					<Table.Cell class="border-[1px] border-primary text-center"></Table.Cell>
					<Table.Cell class="border-[1px] border-primary text-center"></Table.Cell>
					<Table.Cell class="border-[1px] border-primary text-center"></Table.Cell>
					<Table.Cell class="border-[1px] border-primary text-center font-bold">
						Total Units
					</Table.Cell>
					<Table.Cell class="border-[1px] border-primary text-center">Loading...</Table.Cell>
					<Table.Cell class="border-[1px] border-primary text-center">Loading...</Table.Cell>
					<Table.Cell class="border-[1px] border-primary text-center">Loading...</Table.Cell>
				</Table.Row>
			{:then totals}
				<Table.Row class="border-[1px] border-primary">
					<Table.Cell class="border-[1px] border-primary text-center"></Table.Cell>
					<Table.Cell class="border-[1px] border-primary text-center"></Table.Cell>
					<Table.Cell class="border-[1px] border-primary text-center"></Table.Cell>
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

	<section class="grid grid-cols-[1fr_2fr_1fr] text-xs font-bold">
		<span>Prepared by:</span>
		<span>Recommending Approval:</span>
		<span>Approved:</span>
	</section>

	<section class="grid grid-cols-4">
		{@render PersonTemplate('ENGR, ZAIRAH JANE G. ORDILLO', 'Program Chairperson')}
		{@render PersonTemplate('JOCELYN A. GUIMPATAN', 'University Registrar')}
		{@render PersonTemplate('MARY P. CACLINI, PhD', 'Vice President for Academic Affairs')}
		{@render PersonTemplate('EVA MARIE CODAMON-DUGYON, PhD', 'University President')}
	</section>
</main>
