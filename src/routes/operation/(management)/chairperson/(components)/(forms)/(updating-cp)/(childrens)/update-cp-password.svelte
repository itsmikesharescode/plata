<script lang="ts" module>
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { updateChairpersonPwdSchema, type UpdateChairpersonPwdSchema } from '../../schema';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import { urlParamReducer } from '$lib/utils';
	import { page } from '$app/state';
	import { v4 as uuidv4 } from 'uuid';
	interface Props {
		updateChairpersonPwdForm: SuperValidated<UpdateChairpersonPwdSchema>;
	}
</script>

<script lang="ts">
	const { updateChairpersonPwdForm }: Props = $props();

	const form = superForm(updateChairpersonPwdForm, {
		validators: zodClient(updateChairpersonPwdSchema),
		id: uuidv4(),
		onUpdate: async ({ result }) => {
			const { status, data } = result;

			switch (status) {
				case 200:
					toast.success(data.msg);
					reset();
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
		return () => {
			reset();
		};
	});
</script>

<form method="POST" use:enhance action="?/updateChairpersonEmailEvent" class="flex flex-col">
	<input name="user_id" type="hidden" value={$formData.user_id} />
	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Password</Form.Label>
				<Input
					type="password"
					{...props}
					bind:value={$formData.password}
					placeholder="Enter new password"
				/>
			{/snippet}
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="confirmPassword">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Confirm Password</Form.Label>
				<Input
					type="password"
					{...props}
					bind:value={$formData.confirmPassword}
					placeholder="Confirm new password"
				/>
			{/snippet}
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>

	<Form.Button disabled={$submitting} class="relative ml-auto">
		<ReqLoader isLoader={$submitting} />
		Update Password
	</Form.Button>
</form>
