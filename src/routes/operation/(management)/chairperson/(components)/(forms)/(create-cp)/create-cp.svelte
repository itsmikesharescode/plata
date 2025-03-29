<script lang="ts" module>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { createChairpersonSchema, type CreateChairpersonSchema } from '../schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import ReqLoader from '$lib/components/general/spinners/req-loader.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { toast } from 'svelte-sonner';
	import SimplePicker from '$lib/components/general/custom-pickers/simple-picker.svelte';
	import { academicRanks } from '$lib';
	interface Props {
		createChairpersonForm: SuperValidated<CreateChairpersonSchema>;
	}
</script>

<script lang="ts">
	const { createChairpersonForm }: Props = $props();

	const form = superForm(createChairpersonForm, {
		validators: zodClient(createChairpersonSchema),
		id: crypto.randomUUID(),
		onUpdate: async ({ result }) => {
			const { status, data } = result;

			switch (status) {
				case 200:
					toast.success('Faculty created successfully');

					reset();

					break;
				case 401:
					toast.error(data.msg);
					break;
			}
		}
	});

	const { form: formData, enhance, reset, submitting } = form;
</script>

<AlertDialog.Root
	onOpenChange={() => {
		reset();
	}}
>
	<AlertDialog.Trigger class={buttonVariants({ variant: 'default' })}
		>Create Chairperson</AlertDialog.Trigger
	>
	<AlertDialog.Content class="flex max-h-[100dvh] flex-col p-0">
		<AlertDialog.Header class="p-6 pb-0">
			<AlertDialog.Title>Create Chairperson</AlertDialog.Title>
			<AlertDialog.Description>
				Fill the form below to create a new chairperson.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action="?/createChairpersonEvent" use:enhance>
			<ScrollArea>
				<section class="max-h-[60dvh] px-6">
					<Form.Field {form} name="department_id">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Department</Form.Label>

								<SimplePicker
									placeholder="Select Department"
									selections={[
										{ id: '1', label: 'CED', value: 'Civil Engineering Department' },
										{ id: '2', label: 'CSE', value: 'Computer Science and Engineering Department' },
										{
											id: '3',
											label: 'CCE',
											value: 'Civil and Construction Engineering Department'
										},
										{
											id: '4',
											label: 'CCE',
											value: 'Civil and Construction Engineering Department'
										},
										{
											id: '5',
											label: 'CCE',
											value: 'Civil and Construction Engineering Department'
										},
										{
											id: '6',
											label: 'CCE',
											value: 'Civil and Construction Engineering Department'
										},
										{
											id: '7',
											label: 'CCE',
											value: 'Civil and Construction Engineering Department'
										},
										{
											id: '8',
											label: 'CCE',
											value: 'Civil and Construction Engineering Department'
										}
									]}
									bind:selected_id={$formData.department_id}
								>
									{#snippet loopChild({ selectedItem })}
										<div class="flex flex-col">
											<span class="text-sm">{selectedItem.label}</span>
											<span class="text-xs text-muted-foreground">{selectedItem.value}</span>
										</div>
									{/snippet}
								</SimplePicker>
								<input name={props.name} type="hidden" value={$formData.department_id} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="academic_rank">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Academic Rank</Form.Label>
								<SimplePicker
									placeholder="Select Academic Rank"
									selections={academicRanks.map((v) => ({
										id: v,
										label: v,
										value: v
									}))}
									bind:selected_id={$formData.academic_rank}
								/>

								<input name={props.name} type="hidden" value={$formData.academic_rank} />
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
									placeholder="Chairperson Employment Status"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="email">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Email</Form.Label>
								<Input {...props} bind:value={$formData.email} placeholder="Chairperson Email" />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="fullname">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Fullname</Form.Label>
								<Input
									{...props}
									bind:value={$formData.fullname}
									placeholder="Chairperson Fullname"
								/>
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
									placeholder="Chairperson Password"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="confirm_password">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Confirm Password</Form.Label>
								<Input
									type="password"
									{...props}
									bind:value={$formData.confirm_password}
									placeholder="Confirm Chairperson Password"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</section>
			</ScrollArea>
			<AlertDialog.Footer class="mt-2 px-6 pb-6">
				<AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
				<Form.Button disabled={$submitting} class="relative">
					<ReqLoader isLoader={$submitting} />
					Create
				</Form.Button>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
