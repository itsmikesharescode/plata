<script lang="ts" module>
	import type { Database } from '$lib/database.types';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/state';
	import ComboPicker from '$lib/components/general/custom-pickers/combo-picker.svelte';

	export type DepartmentDropdown = Database['public']['Tables']['departments_tb']['Row'][] | null;
	export type FacultyDropdown =
		| (Database['public']['Tables']['faculties_tb']['Row'] & {
				departments_tb: {
					department_name: string;
				};
		  })[]
		| null;
	export type YearLevelsAndSectionsDropdown =
		| Database['public']['Tables']['yearlevels_and_sections_tb']['Row'][]
		| null;
	export type ClassroomDropdown =
		| (Database['public']['Tables']['classrooms_tb']['Row'] & {
				departments_tb: {
					department_name: string;
				};
		  })[]
		| null;
	export type ProgramDropdown =
		| (Database['public']['Tables']['programs_tb']['Row'] & {
				departments_tb: {
					department_name: string;
				};
		  })[]
		| null;
	export type SubjectDropdown = Database['public']['Tables']['subjects_tb']['Row'][] | null;

	export const handleCopy = async (text: string) => {
		await navigator.clipboard
			.writeText(text)
			.then(() => {
				toast.success(`Copied ${text}`);
			})
			.catch((err) => {
				toast.error(err);
			});
	};

	export const handleSchedConflict = async (sched_id: string) => {
		if (!page.data.supabase) return null;
		const { data, error } = await page.data.supabase.rpc('helper_detect_sched_conflict', {
			sched_id
		});
		if (error) return error.message;
		return data;
	};

	export { DepartmentFilter };
</script>

<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import OperationSidebar from '$lib/components/general/operation-sidebar/operation-sidebar.svelte';
	import { initRowState } from '$lib/states/row-state.svelte';
	import Logout from '$lib/components/general/operation-sidebar/components/logout.svelte';
	import Darkmode from '$lib/components/general/darkmode/darkmode.svelte';
	import { goto } from '$app/navigation';
	import { urlParamReducer, urlParamStacker } from '$lib/utils';

	const { children } = $props();

	initRowState();

	const activeUrl = $derived(page.url.pathname);
</script>

{#snippet DepartmentFilter({
	departmentsDropdown,
	selected_id
}: {
	departmentsDropdown: DepartmentDropdown;
	selected_id?: string;
})}
	<div class="grid grid-cols-[auto_auto] items-center gap-4">
		<span class="w-full text-sm font-medium">Filter by:</span>
		<ComboPicker
			selections={departmentsDropdown?.map((v) => ({
				id: v.id,
				label: v.department_code,
				value: JSON.stringify({
					department_name: v.department_name,
					department_color: v.department_color
				})
			})) ?? []}
			{selected_id}
		>
			{#snippet childLoop({ selectedItem })}
				<button
					onclick={async () => {
						const department_id = page.url.searchParams.get('department_id');
						if (department_id === selectedItem.id) {
							await goto(`${page.url.pathname}?${urlParamReducer('department_id', page)}`);
						} else {
							await goto(urlParamStacker('department_id', selectedItem.id, page));
						}
					}}
					aria-label="redirect"
					class="absolute inset-0"
				></button>
				<div class="grid grid-cols-[auto_1fr] items-center gap-2">
					<div
						class="size-5 rounded-full"
						style="background-color: {JSON.parse(selectedItem.value).department_color}"
					></div>
					<div class="flex flex-col">
						<span class="">{selectedItem.label}</span>
						<span class="text-xs text-muted-foreground"
							>{JSON.parse(selectedItem.value).department_name}</span
						>
					</div>
				</div>
			{/snippet}
		</ComboPicker>
	</div>
{/snippet}

{#if page.url.pathname.startsWith('/operation/schedules/printables')}
	{@render children()}
{:else}
	<Sidebar.Provider>
		<OperationSidebar />
		<Sidebar.Inset class="min-w-0">
			<header
				class="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4"
			>
				<div class="flex h-full items-center gap-2">
					<Sidebar.Trigger class="-ml-1" />
					<Separator orientation="vertical" class="mr-2 h-4" />
					<span class="text-muted-foreground"
						>You are at <span class="font-medium text-primary">{activeUrl}</span></span
					>
				</div>

				<div class="flex items-center gap-2">
					<Darkmode />
					<Logout />
				</div>
			</header>
			<div class="flex flex-1 flex-col gap-4">
				{@render children()}
			</div>
		</Sidebar.Inset>
	</Sidebar.Provider>
{/if}
