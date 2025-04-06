<script lang="ts" module>
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { untrack } from 'svelte';
	import {
		programChairUpdateSchema,
		type ProgramChairUpdateSchema,
		universityPresidentUpdateSchema,
		type UniversityPresidentUpdateSchema,
		universityRegistrarUpdateSchema,
		type UniversityRegistrarUpdateSchema,
		vicePresidentAcademicUpdateSchema,
		type VicePresidentAcademicUpdateSchema
	} from '../schema';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';

	const forms = {
		president: universityPresidentUpdateSchema,
		registrar: universityRegistrarUpdateSchema,
		'program-chair': programChairUpdateSchema,
		'vp-academic': vicePresidentAcademicUpdateSchema
	} as const;

	const endPoints = {
		president: '?/updatePresidentEvent',
		registrar: '?/updateRegistrarEvent',
		'program-chair': '?/updateProgramChairEvent',
		'vp-academic': '?/updateVicePresidentAcademicEvent'
	} as const;

	type SchemaType<K extends keyof typeof forms> = K extends 'president'
		? UniversityPresidentUpdateSchema
		: K extends 'registrar'
			? UniversityRegistrarUpdateSchema
			: K extends 'program-chair'
				? ProgramChairUpdateSchema
				: K extends 'vp-academic'
					? VicePresidentAcademicUpdateSchema
					: never;

	interface Props {
		mode: keyof typeof forms;
		data: SuperValidated<SchemaType<keyof typeof forms>>;
		placeholder: string;
		value: {
			id: string;
			fullname: string;
		};
	}
</script>

<script lang="ts">
	let { mode = 'president', data, value, placeholder }: Props = $props();

	const form = superForm<SchemaType<typeof mode>>(data, {
		id: `${mode}-${crypto.randomUUID()}`,
		validators: zodClient(forms[mode]),
		onUpdate: ({ result, form }) => {
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
</script>

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
