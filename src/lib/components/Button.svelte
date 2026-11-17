<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'primary' | 'outline' | 'icon';

	type Props = {
		variant?: Variant;
		href?: string;
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		'aria-label'?: string;
		'aria-expanded'?: boolean;
		'aria-controls'?: string;
		onclick?: (event: MouseEvent) => void;
		class?: string;
		children: Snippet;
	};

	let {
		variant = 'primary',
		href,
		disabled = false,
		type = 'button',
		'aria-label': ariaLabel,
		'aria-expanded': ariaExpanded,
		'aria-controls': ariaControls,
		onclick,
		class: className = '',
		children
	}: Props = $props();

	const variantClasses: Record<Variant, string> = {
		primary:
			'h-12 border-transparent bg-primary px-6 text-[15px] font-medium text-on-primary ui-button-primary',
		outline: 'h-12 border-line px-6 text-[15px] text-ink ui-button-outline',
		icon: 'size-11 rounded-full border-line ui-button-icon'
	};
</script>

{#if href}
	<a
		href={disabled ? undefined : href}
		aria-label={ariaLabel}
		aria-disabled={disabled ? 'true' : undefined}
		tabindex={disabled ? -1 : undefined}
		{onclick}
		class="ui-interactive inline-flex min-h-11 items-center justify-center gap-2 border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary {variantClasses[
			variant
		]} {disabled ? 'ui-disabled' : ''} {className}"
	>
		{@render children()}
	</a>
{:else}
	<button
		{type}
		{disabled}
		aria-label={ariaLabel}
		aria-expanded={ariaExpanded}
		aria-controls={ariaControls}
		{onclick}
		class="ui-interactive inline-flex min-h-11 items-center justify-center gap-2 border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary {variantClasses[
			variant
		]} {className}"
	>
		{@render children()}
	</button>
{/if}
