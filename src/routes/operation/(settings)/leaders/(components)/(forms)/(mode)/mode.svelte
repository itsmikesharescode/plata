<script lang="ts" module>
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { untrack } from 'svelte';
	import { modeSchema, type ModeSchema } from '../schema';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/state';
	import { v4 as uuidv4 } from 'uuid';
	const endPoints = {
		president: '?/updatePresidentEvent',
		registrar: '?/updateRegistrarEvent',
		'program-chair': '?/updateProgramChairEvent',
		'vp-academic': '?/updateVicePresidentAcademicEvent'
	} as const;

	interface Props {
		mode: keyof typeof endPoints;
		data: SuperValidated<ModeSchema>;
		placeholder: string;
		value: {
			id: string;
			fullname: string;
		};
	}
</script>

<script lang="ts">
	let { mode = 'president', data, value, placeholder }: Props = $props();

	const form = superForm(data, {
		id: `${mode}-${uuidv4()}`,
		validators: zodClient(modeSchema),
		onUpdate: ({ result }) => {
			const { status, data } = result;

			switch (status) {
				case 200:
					toast.success(data.msg);
					break;
				case 401:
					toast.error(data.msg);
					break;
			}
		}
	});

	const { form: formData, enhance, submitting } = form;

	$effect(() => {
		untrack(() => {
			$formData.id = value.id;
			$formData.fullname = value.fullname;
		});
	});

	const user = $derived(page.data.user);
</script>

{#if user?.user_metadata.role !== 'admin'}
	<div class="flex flex-col gap-1.5 bg-secondary p-5">
		<Input bind:value={$formData.fullname} disabled />
		<span class="text-sm text-muted-foreground">{placeholder}</span>
	</div>
{:else}
	<form method="POST" action={endPoints[mode]} use:enhance>
		<input name="id" type="hidden" bind:value={$formData.id} />
		<Form.Field {form} name="fullname">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Full Name</Form.Label>
					<div class="grid grid-cols-[1fr_auto] gap-2">
						<Input {...props} bind:value={$formData.fullname} />
						<Form.Button disabled={$submitting} class="relative">
							<ReqLoader isLoader={$submitting} />
							Update
						</Form.Button>
					</div>
				{/snippet}
			</Form.Control>
			<Form.Description>{placeholder}</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
	</form>
{/if}
