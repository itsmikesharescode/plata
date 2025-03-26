<script lang="ts">
	import { cn } from '$lib/utils';
	import { LoaderCircle } from 'lucide-svelte';
	import type { ClassNameValue } from 'tailwind-merge';

	interface Props {
		isLoader: boolean;
		class?: ClassNameValue;
	}

	const { isLoader, class: className }: Props = $props();
</script>

{#if isLoader}
	<div
		class={cn('absolute inset-0 flex items-center justify-center rounded-lg bg-primary', className)}
	>
		<LoaderCircle class="size-4 animate-spin" />
	</div>
{/if}
