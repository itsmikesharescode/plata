<script lang="ts" module>
	import { page } from '$app/state';
	const queryPrograms = async (textSearch: string) => {
		if (!page.data.supabase) return null;

		const query = page.data.supabase
			.from('programs_tb')
			.select('*')
			.order('created_at', { ascending: false })
			.limit(30);

		if (textSearch.length) {
			query.like('program_code', `%${textSearch.toUpperCase()}%`);
		}

		const { data, error } = await query;

		return error ? null : data;
	};
</script>

<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { buttonVariants } from '$lib/components/ui/button';
	import Printer from 'lucide-svelte/icons/printer';
	import Button from '$lib/components/ui/button/button.svelte';
	import { tick, untrack } from 'svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Search from 'lucide-svelte/icons/search';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Debounced } from 'runed';

	let open = $state(false);
	let searchValue = $state('');
	let scheduleId = $state('');

	const searchDebounce = new Debounced(() => searchValue, 800);

	$effect(() => {
		if (open) {
			untrack(async () => {});
		}
	});
</script>

<DropdownMenu.Root bind:open>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'default' })}>
		Printables
		<Printer class="ml-auto size-4" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Available Printables</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>Class Schedules</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<div class="flex flex-col gap-2">
							<div class="p-4 pb-0">
								<div class="relative flex items-center gap-2">
									<Input
										type="search"
										placeholder="Search Program Code"
										bind:value={searchValue}
										class="pl-7"
									/>
									<Search class="absolute left-2 size-4" />
								</div>
							</div>

							<div class="flex flex-col gap-2">
								<ScrollArea class="h-[200px] px-4 pb-4">
									{#await queryPrograms(searchDebounce.current)}
										<div class="p-4 text-center text-sm text-muted-foreground">Searching ...</div>
									{:then programs}
										{#if !programs?.length}
											<div class="p-4 text-center text-sm text-muted-foreground">
												No programs found
											</div>
										{/if}

										{#each programs ?? [] as program}
											<a
												href="/operation/schedules/printables?id={program.id}&from={page.url.href}"
											>
												<DropdownMenu.Item>
													<Printer class="size-4" />
													<div class="flex max-w-[200px] flex-col">
														<span>{program.program_code}</span>
														<span class="text-xs text-muted-foreground">
															{program.program_name}
														</span>
													</div>
												</DropdownMenu.Item>
											</a>
										{/each}
									{/await}
								</ScrollArea>
							</div>
						</div>

						<DropdownMenu.Separator />

						<div class="p-4">
							<a href="/operation/schedules/printables?from={page.url.href}">
								<DropdownMenu.Item>
									<Printer class="size-4" />
									All Programs
								</DropdownMenu.Item>
							</a>
						</div>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>

				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>Teaching Form</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent class="flex flex-col gap-2 p-4">
						<div class="flex items-center gap-2">
							<Input bind:value={scheduleId} placeholder="Schedule ID" class="h-9" />
							<Button
								href="/operation/schedules/printables/teaching-form?id={scheduleId}&from={page.url
									.href}"
								size="sm"
							>
								<Printer class="size-4" />
							</Button>
						</div>

						<span class="text-xs text-muted-foreground">
							Enter Schedule ID To Print Teaching Form
						</span>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
			</DropdownMenu.Group>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
