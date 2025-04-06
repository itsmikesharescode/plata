<script lang="ts" module>
	import Button from '$lib/components/ui/button/button.svelte';
	import { tick } from 'svelte';
	import Undo2 from '@lucide/svelte/icons/undo-2';
	import PrinterCheck from '@lucide/svelte/icons/printer-check';
	import { setMode, mode } from 'mode-watcher';
	import { page } from '$app/state';

	export const getSubjectCodeTitleUnitLecLabById = async (id: string) => {
		if (!page.data.supabase) return null;
		const { data, error } = await page.data.supabase
			.from('subjects_tb')
			.select('course_code, course_name, unit, lecture_hours, lab_hours')
			.eq('id', id)
			.single();
		return error ? null : data;
	};

	export const getClassroomById = async (id: string) => {
		if (!page.data.supabase) return null;
		const { data, error } = await page.data.supabase
			.from('classrooms_tb')
			.select('classroom_name')
			.eq('id', id)
			.single();
		return error ? null : data?.classroom_name;
	};

	export const calculateTotalUnits = async (subjectIds: string[]) => {
		if (!page.data.supabase) return { total_unit: 0, total_lecture_hours: 0, total_lab_hours: 0 };
		const { data, error } = await page.data.supabase.rpc('helper_compute_sched_count' as any, {
			subject_ids: subjectIds
		});

		if (error) return { total_unit: 0, total_lecture_hours: 0, total_lab_hours: 0 };

		return data;
	};

	export const getYearLevelAndSectionById = async (id: string) => {
		if (!page.data.supabase) return null;
		const { data, error } = await page.data.supabase
			.from('yearlevels_and_sections_tb')
			.select('year, section')
			.eq('id', id)
			.single();
		return error ? null : data;
	};

	export const getLeaders = async () => {
		if (!page.data.supabase) return null;

		const { data, error } = await page.data.supabase.from('leaders_tb').select('*');

		if (error) return null;

		return data;
	};
</script>

<script lang="ts">
	const { children } = $props();

	let isPrinting = $state(false);
	let initialMode = $state<'dark' | 'light' | undefined>(undefined);

	mode.subscribe((m) => {
		initialMode = m;
	});

	const handlePrint = async (): Promise<void> => {
		const initialCopy = initialMode;

		isPrinting = true;

		if (initialMode === 'dark') {
			setMode('light');
		}

		await tick();
		const handleAfterPrint = (): void => {
			isPrinting = false;
			window.removeEventListener('afterprint', handleAfterPrint);
			if (initialCopy === 'dark') {
				setMode('dark');
			}
		};

		window.addEventListener('afterprint', handleAfterPrint);
		print();
	};
</script>

{#if !isPrinting}
	<header class="flex items-center justify-between p-4">
		<a
			href={page.url.searchParams.get('from') ?? '/operation/schedules'}
			class="flex items-center gap-2 underline"
		>
			<Undo2 class="size-7" />
			<span class="text-2xl font-bold">Go back</span>
		</a>

		<Button onclick={handlePrint}>
			<PrinterCheck class="size-4" />
			Print
		</Button>
	</header>
{/if}

{@render children()}
