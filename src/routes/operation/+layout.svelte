<script lang="ts" module>
	import type { Database } from '$lib/database.types';
	import { toast } from 'svelte-sonner';

	export type DepartmentDropdown = Database['public']['Tables']['departments_tb']['Row'][] | null;
	export type Department = Database['public']['Tables']['departments_tb']['Row'];
	export type ProgramDropdown =
		| (Database['public']['Tables']['programs_tb']['Row'] & {
				departments_tb: {
					department_name: string;
				};
		  })[]
		| null;

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
</script>

<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import OperationSidebar from '$lib/components/general/operation-sidebar/operation-sidebar.svelte';
	import { initRowState } from '$lib/states/row-state.svelte';
	import Logout from '$lib/components/general/operation-sidebar/components/logout.svelte';
	import Darkmode from '$lib/components/general/darkmode/darkmode.svelte';

	const { children } = $props();

	initRowState();
</script>

<Sidebar.Provider>
	<OperationSidebar />
	<Sidebar.Inset class="min-w-0">
		<header
			class="sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4"
		>
			<div class="flex h-full items-center gap-2">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 h-4" />
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
