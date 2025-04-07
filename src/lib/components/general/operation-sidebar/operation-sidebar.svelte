<script lang="ts" module>
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import type { ComponentProps } from 'svelte';
	import Database from 'lucide-svelte/icons/database';
	import FolderKanban from 'lucide-svelte/icons/folder-kanban';
	import History from 'lucide-svelte/icons/history';
	import Settings from 'lucide-svelte/icons/settings';
	import Header from './components/header.svelte';
	import { page } from '$app/state';

	export const baseRoutes = [
		{
			title: 'Entries',
			icon: Database,
			items: [
				{
					title: 'Departments',
					url: '/operation'
				},
				{
					title: 'Subjects',
					url: '/operation/subjects'
				},
				{
					title: 'Year Levels & Sections',
					url: '/operation/year-levels-and-sections'
				}
			]
		},
		{
			title: 'Sub Entries',
			icon: Database,
			items: [
				{
					title: 'Classrooms',
					url: '/operation/classrooms'
				},
				{
					title: 'Programs',
					url: '/operation/programs'
				}
			]
		},
		{
			title: 'Management',
			icon: FolderKanban,
			items: [
				{
					title: 'Schedules',
					url: '/operation/schedules'
				},
				{
					title: 'Faculties',
					url: '/operation/faculties'
				},
				{
					title: 'Chairperson',
					url: '/operation/chairperson'
				}
			]
		},
		{
			title: 'Settings',
			icon: Settings,
			items: [
				{
					title: 'History',
					url: '/operation/history'
				},
				{
					title: 'Leaders',
					url: '/operation/leaders'
				}
			]
		}
	];
</script>

<script lang="ts">
	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();

	const getRoleRoutes = $derived.by(() => {
		const role = page?.data.user?.user_metadata.role;

		if (role === 'admin') {
			return baseRoutes; // Admin sees all routes
		} else if (role === 'chair') {
			// Exclude Departments and Chairperson routes
			return baseRoutes.map((section) => ({
				...section,
				items: section.items.filter(
					(item) => item.title !== 'Departments' && item.title !== 'Chairperson'
				)
			}));
		} else {
			return [];
		}
	});
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Header>
		<Header />
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Routes</Sidebar.GroupLabel>
			<Sidebar.Menu>
				{#each getRoleRoutes as mainItem (mainItem.title)}
					<Collapsible.Root open={true} class="group/collapsible">
						{#snippet child({ props })}
							<Sidebar.MenuItem {...props}>
								<Collapsible.Trigger>
									{#snippet child({ props })}
										<Sidebar.MenuButton {...props}>
											{#snippet tooltipContent()}
												{mainItem.title}
											{/snippet}
											{#if mainItem.icon}
												<mainItem.icon />
											{/if}
											<span>{mainItem.title}</span>
											<ChevronRight
												class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
											/>
										</Sidebar.MenuButton>
									{/snippet}
								</Collapsible.Trigger>
								<Collapsible.Content>
									{#if mainItem.items}
										<Sidebar.MenuSub>
											{#each mainItem.items as subItem (subItem.title)}
												<Sidebar.MenuSubItem
													class={page.url.pathname === subItem.url ? 'rounded-lg bg-secondary' : ''}
												>
													<Sidebar.MenuSubButton>
														{#snippet child({ props })}
															<a href={subItem.url} {...props}>
																<span>{subItem.title}</span>
															</a>
														{/snippet}
													</Sidebar.MenuSubButton>
												</Sidebar.MenuSubItem>
											{/each}
										</Sidebar.MenuSub>
									{/if}
								</Collapsible.Content>
							</Sidebar.MenuItem>
						{/snippet}
					</Collapsible.Root>
				{/each}
			</Sidebar.Menu>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Rail />
</Sidebar.Root>
