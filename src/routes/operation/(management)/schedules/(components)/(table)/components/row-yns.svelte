<script lang="ts" module>
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { ScheduleTable } from '../schema';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import Copy from '@lucide/svelte/icons/copy';
	import { handleCopy } from '../../../../../+layout.svelte';
</script>

<script lang="ts" generics="TData">
	import type { Row } from '@tanstack/table-core';
	import { untrack } from 'svelte';

	let { row }: { row: Row<ScheduleTable> } = $props();
</script>

<span
	>{row.original.yearlevels_and_sections_tb.year}
	{row.original.yearlevels_and_sections_tb.section}</span
>
