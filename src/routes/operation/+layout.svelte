<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import OperationSidebar from '$lib/components/general/operation-sidebar/operation-sidebar.svelte';
	import { initRowState } from '$lib/states/row-state.svelte';

	const { children } = $props();

	initRowState();
</script>

<Sidebar.Provider>
	<OperationSidebar />
	<Sidebar.Inset class="min-w-0">
		<header class="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
			<Sidebar.Trigger class="-ml-1" />
			<Separator orientation="vertical" class="mr-2 h-4" />
		</header>
		<div class="flex flex-1 flex-col gap-4">
			{@render children()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
