<script lang="ts" module>
	import { page } from '$app/state';
</script>

<script lang="ts">
	const user = $derived(page.data.user);
</script>

<header class="flex items-center gap-2">
	<div
		class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
	></div>
	<div class="grid flex-1 text-left text-sm leading-tight">
		<span class="truncate text-sm font-semibold">{user?.user_metadata.fullname}</span>
		<span class="truncate text-xs font-bold text-muted-foreground">
			{user?.user_metadata.role === 'admin' ? 'ADMINISTRATOR' : 'ChairPerson'}
		</span>
	</div>
</header>
