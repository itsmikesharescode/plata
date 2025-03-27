<script lang="ts">
	import LandingBg from '$lib/assets/landing-bg.png';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { loginSchema } from './schema';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	const { data } = $props();

	const form = superForm(data.loginForm, {
		validators: zodClient(loginSchema),
		id: crypto.randomUUID(),
		onUpdate: async ({ result }) => {
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

	const { form: formData, enhance, submitting, reset } = form;
</script>

<main class="relative h-screen overflow-hidden bg-primary p-2">
	<img
		src={LandingBg}
		alt="landingimage"
		class="absolute inset-0 h-full w-full object-cover object-center opacity-50"
	/>

	<section class="relative flex min-h-screen items-center justify-center">
		<div
			class="0 flex w-[320px] flex-col gap-5 rounded-lg bg-secondary/90 p-2 sm:w-[420px] sm:p-4 lg:w-[500px] lg:p-10"
		>
			<div class="flex flex-col">
				<span class="text-center text-4xl font-bold">Log in</span>
				<span class="text-center text-sm">Log in to your account to continue</span>
			</div>

			<form method="POST" use:enhance action="?/loginEvent" class="flex flex-col gap-2">
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email</Form.Label>
							<Input {...props} bind:value={$formData.email} placeholder="Enter your email" />
						{/snippet}
					</Form.Control>

					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Password</Form.Label>
							<Input
								type="password"
								{...props}
								bind:value={$formData.password}
								placeholder="Enter your password"
							/>
						{/snippet}
					</Form.Control>

					<Form.FieldErrors />
				</Form.Field>
				<Form.Button disabled={$submitting} class="relative">
					<ReqLoader isLoader={$submitting} />
					Log in
				</Form.Button>
			</form>
		</div>
	</section>
</main>
