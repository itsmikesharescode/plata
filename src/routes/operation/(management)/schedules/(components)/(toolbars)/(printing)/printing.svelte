<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { buttonVariants } from '$lib/components/ui/button';
	import Printer from 'lucide-svelte/icons/printer';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import { tick } from 'svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	const labels = ['BSIT', 'BSCS', 'BSIS2'];

	let open = $state(false);
	let selectedLabel = $state('feature');
	let triggerRef = $state<HTMLButtonElement>(null!);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
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
						<DropdownMenu.Item>
							<Printer class="size-4" />
							All Programs
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<Command.Root value={selectedLabel}>
							<Command.Input autofocus placeholder="Search program..." class="h-9" />
							<Command.List>
								<Command.Empty>No program found.</Command.Empty>
								<Command.Group>
									{#each labels as label (label)}
										<Command.Item
											value={label}
											onSelect={() => {
												selectedLabel = label;
												closeAndFocusTrigger();
											}}
										>
											{label}
										</Command.Item>
									{/each}
								</Command.Group>
							</Command.List>
						</Command.Root>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>

				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>Teaching Form</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent class="p-4">
						<div class="flex items-center gap-2">
							<Input placeholder="Faculty ID" class="h-9" />
							<Button size="sm">
								<Printer class="size-4" />
							</Button>
						</div>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
			</DropdownMenu.Group>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
