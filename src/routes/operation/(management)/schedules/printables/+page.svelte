<script lang="ts">
	const { data } = $props();
</script>

{JSON.stringify(data?.schedules, null, 2)}
