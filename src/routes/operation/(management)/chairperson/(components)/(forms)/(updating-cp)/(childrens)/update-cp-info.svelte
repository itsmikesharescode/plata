<script lang="ts" module>
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { updateChairpersonInfoSchema, type UpdateChairpersonInfoSchema } from '../../schema';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import { untrack } from 'svelte';

	interface Props {
		stateProp: {
			user_id: string | undefined;
			department_id: string | undefined;
			fullname: string | undefined;
			academic_rank: string | undefined;
			employment_status: string | undefined;
			program_id: string | undefined;
		};
		updateChairpersonInfoForm: SuperValidated<UpdateChairpersonInfoSchema>;
	}
</script>

<script lang="ts">
	const { updateChairpersonInfoForm, stateProp }: Props = $props();

	const form = superForm(updateChairpersonInfoForm, {
		validators: zodClient(updateChairpersonInfoSchema),
		id: crypto.randomUUID(),
		onUpdate: async ({ result }) => {
			const { status, data } = result;

			switch (status) {
				case 200:
					toast.success('Chairperson info updated successfully.');
					reset();
					await goto('/operation/chairpersons');

					break;
				case 401:
					toast.error(data.msg);
					break;
			}
		}
	});

	const { form: formData, enhance, submitting, reset } = form;

	$effect(() => {
		untrack(() => {
			if (
				stateProp.academic_rank &&
				stateProp.department_id &&
				stateProp.fullname &&
				stateProp.employment_status &&
				stateProp.program_id &&
				stateProp.user_id
			) {
				$formData.academic_rank = stateProp.academic_rank;
				$formData.department_id = stateProp.department_id;
				$formData.program_id = stateProp.program_id;
				$formData.fullname = stateProp.fullname;
				$formData.employment_status = stateProp.employment_status;
				$formData.user_id = stateProp.user_id;
			}
		});

		return () => {
			console.log('Cleaned from update information');
			reset();
		};
	});
</script>

<form method="POST" use:enhance action="?/updateChairpersonInfoEvent" class="flex flex-col">
	<input name="user_id" type="hidden" value={$formData.user_id} />

	<Form.Field {form} name="department_id">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Department</Form.Label>
				<Input {...props} bind:value={$formData.department_id} placeholder="Department id" />
			{/snippet}
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="fullname">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Fullname</Form.Label>
				<Input {...props} bind:value={$formData.fullname} placeholder="Enter fullname" />
			{/snippet}
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="academic_rank">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Academic Rank</Form.Label>
				<Input {...props} bind:value={$formData.academic_rank} placeholder="Academic rank" />
			{/snippet}
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="employment_status">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Employment Status</Form.Label>
				<Input
					{...props}
					bind:value={$formData.employment_status}
					placeholder="Employment Status"
				/>
			{/snippet}
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>

	<Form.Button disabled={$submitting} class="relative ml-auto">
		<ReqLoader isLoader={$submitting} />
		Update Information
	</Form.Button>
</form>
