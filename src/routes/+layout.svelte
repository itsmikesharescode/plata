<script>
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { ModeWatcher } from 'mode-watcher';
	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<!-- <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
	<div class="rounded-lg bg-secondary/50 p-4">
		<span class="text-base font-bold">Not Paid</span>
	</div>
</div> -->

<ModeWatcher defaultMode="dark" />
<Toaster />
{@render children()}
