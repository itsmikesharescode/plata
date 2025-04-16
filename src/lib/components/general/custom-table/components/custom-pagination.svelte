<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { MediaQuery } from 'svelte/reactivity';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import { page } from '$app/state';
	import { urlParamReducer, urlParamStacker } from '$lib/utils';
	import { goto } from '$app/navigation';

	interface Props {
		count: number;
	}

	const { count }: Props = $props();

	const isDesktop = new MediaQuery('(min-width: 768px)');
	const siblingCount = $derived(isDesktop.current ? 1 : 0);

	let curPage = $derived(Number(page.url.searchParams.get('page') ?? 1));
</script>

<Pagination.Root
	{count}
	perPage={10}
	{siblingCount}
	onPageChange={async (pageValue) => {
		if (pageValue <= 1) {
			await goto(`${page.url.pathname}?${urlParamReducer('page', page)}`);
		} else {
			await goto(urlParamStacker('page', String(pageValue), page));
		}
	}}
	page={curPage}
>
	{#snippet children({ pages, currentPage })}
		<Pagination.Content>
			<Pagination.Item>
				<Pagination.PrevButton>
					<ChevronLeft class="size-4" />
					<span class="hidden sm:block">Previous</span>
				</Pagination.PrevButton>
			</Pagination.Item>
			{#each pages as p (p.key)}
				{#if p.type === 'ellipsis'}
					<Pagination.Item>
						<Pagination.Ellipsis />
					</Pagination.Item>
				{:else}
					<Pagination.Item>
						<Pagination.Link page={p} isActive={curPage === p.value}>
							{p.value}
						</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}
			<Pagination.Item>
				<Pagination.NextButton>
					<span class="hidden sm:block">Next</span>
					<ChevronRight class="size-4" />
				</Pagination.NextButton>
			</Pagination.Item>
		</Pagination.Content>
	{/snippet}
</Pagination.Root>
