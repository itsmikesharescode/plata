<script lang="ts" module>
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { updateChairpersonEmailSchema, type UpdateChairpersonEmailSchema } from '../../schema';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import { untrack } from 'svelte';
	import { urlParamReducer } from '$lib/utils';
	import { page } from '$app/state';
	import { useRowState } from '$lib/states/row-state.svelte';
	interface Props {
		stateProp: {
			user_id: string | undefined;
			email: string | undefined;
		};
		updateChairpersonEmailForm: SuperValidated<UpdateChairpersonEmailSchema>;
	}
</script>

<script lang="ts">
	const { updateChairpersonEmailForm, stateProp }: Props = $props();
	const rowState = useRowState();

	const form = superForm(updateChairpersonEmailForm, {
		validators: zodClient(updateChairpersonEmailSchema),
		id: crypto.randomUUID(),
		onUpdate: async ({ result }) => {
			const { status, data } = result;

			switch (status) {
				case 200:
					toast.success(data.msg);
					reset();
					rowState.setActiveRow(null);
					await goto(`${page.url.pathname}?${urlParamReducer('id', page)}`);

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
			if (stateProp.email && stateProp.user_id) {
				$formData.email = stateProp.email;
				$formData.user_id = stateProp.user_id;
			}
		});

		return () => {
			reset();
		};
	});
</script>

<form method="POST" use:enhance action="?/updateChairpersonEmailEvent" class="flex flex-col">
	<input name="user_id" type="hidden" value={$formData.user_id} />
	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Email</Form.Label>
				<Input {...props} bind:value={$formData.email} placeholder="Enter new email" />
			{/snippet}
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>

	<Form.Button disabled={$submitting} class="relative ml-auto">
		<ReqLoader isLoader={$submitting} />
		Update Email
	</Form.Button>
</form>
