<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Spring } from 'svelte/motion';

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

	const magnetic = new Spring({ x: 0, y: 0 }, { stiffness: 0.18, damping: 0.78 });

	function moveMagnetic(event: PointerEvent) {
		const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (
			variant !== 'primary' ||
			disabled ||
			event.pointerType === 'touch' ||
			!matchMedia('(pointer: fine)').matches ||
			reduceMotion
		) {
			if (reduceMotion) resetMagnetic(true);
			return;
		}

		const target = event.currentTarget;
		if (!(target instanceof HTMLElement)) return;
		const bounds = target.getBoundingClientRect();
		const x = (event.clientX - bounds.left - bounds.width / 2) * 0.12;
		const y = (event.clientY - bounds.top - bounds.height / 2) * 0.12;
		const distance = Math.hypot(x, y);
		const scale = distance > 6 ? 6 / distance : 1;
		magnetic.target = { x: x * scale, y: y * scale };
	}

	function resetMagnetic(instant = false) {
		void magnetic.set(
			{ x: 0, y: 0 },
			{
				instant: instant || disabled || matchMedia('(prefers-reduced-motion: reduce)').matches
			}
		);
	}

	function handlePointerLeave() {
		resetMagnetic();
	}

	$effect(() => {
		if (variant !== 'primary' || disabled) {
			void magnetic.set({ x: 0, y: 0 }, { instant: true });
		}
	});

	const magneticStyle = $derived(
		`--magnetic-x:${magnetic.current.x}px; --magnetic-y:${magnetic.current.y}px;`
	);
</script>

{#if href}
	<a
		href={disabled ? undefined : href}
		aria-label={ariaLabel}
		aria-disabled={disabled ? 'true' : undefined}
		tabindex={disabled ? -1 : undefined}
		{onclick}
		onpointermove={moveMagnetic}
		onpointerleave={handlePointerLeave}
		onpointercancel={handlePointerLeave}
		style={magneticStyle}
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
		onpointermove={moveMagnetic}
		onpointerleave={handlePointerLeave}
		onpointercancel={handlePointerLeave}
		style={magneticStyle}
		class="ui-interactive inline-flex min-h-11 items-center justify-center gap-2 border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary {variantClasses[
			variant
		]} {className}"
	>
		{@render children()}
	</button>
{/if}
