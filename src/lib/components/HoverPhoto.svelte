<script lang="ts">
	import { Spring } from 'svelte/motion';

	type Props = {
		normal: string;
		darkNormal?: string;
		hover: string;
		alt: string;
		class?: string;
		radius?: number; // jari-jari lingkaran di sekitar kursor (px)
	};

	let { normal, darkNormal, hover, alt, class: className = '', radius = 110 }: Props = $props();

	let box: HTMLDivElement | undefined = $state();
	let touching = false;
	const cursor = new Spring(
		{ x: 0, y: 0, r: 0 },
		{ stiffness: 0.2, damping: 0.78, precision: 0.1 }
	);

	const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

	function setCursor(x: number, y: number, r: number) {
		const target = { x, y, r };
		if (reduce()) {
			void cursor.set(target, { instant: true });
		} else {
			cursor.target = target;
		}
	}

	function point(e: PointerEvent) {
		const bounds = box!.getBoundingClientRect();
		return { x: e.clientX - bounds.left, y: e.clientY - bounds.top };
	}

	function enter(e: PointerEvent) {
		if (e.pointerType === 'touch' || !matchMedia('(pointer: fine)').matches) return;
		const { x, y } = point(e);
		setCursor(x, y, radius);
	}

	function move(e: PointerEvent) {
		if (e.pointerType === 'touch') {
			if (!touching) return;
		} else if (!matchMedia('(pointer: fine)').matches) {
			return;
		}

		const { x, y } = point(e);
		setCursor(x, y, radius);
	}

	function press(e: PointerEvent) {
		if (e.pointerType !== 'touch') return;
		touching = true;
		box?.setPointerCapture(e.pointerId);
		const { x, y } = point(e);
		setCursor(x, y, radius);
	}

	function release() {
		if (!touching) return;
		touching = false;
		setCursor(cursor.target.x, cursor.target.y, 0);
	}

	function leave(e: PointerEvent) {
		if (e.pointerType === 'touch') {
			release();
			return;
		}
		if (matchMedia('(pointer: fine)').matches) {
			setCursor(cursor.target.x, cursor.target.y, 0);
		}
	}

	function focus(e: FocusEvent) {
		if (!(e.currentTarget as HTMLElement).matches(':focus-visible')) return;
		const bounds = box!.getBoundingClientRect();
		setCursor(bounds.width / 2, bounds.height / 2, Math.hypot(bounds.width, bounds.height) / 2 + 4);
	}
</script>

<!-- tabindex agar efek bisa dibuka dengan keyboard -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	bind:this={box}
	class="hover-photo relative overflow-hidden border border-line {className}"
	role="img"
	aria-label={alt}
	tabindex="0"
	onpointerenter={enter}
	onpointermove={move}
	onpointerleave={leave}
	onpointerdown={press}
	onpointerup={release}
	onpointercancel={leave}
	onlostpointercapture={release}
	onfocus={focus}
	onblur={() => setCursor(cursor.target.x, cursor.target.y, 0)}
	style={`--x:${cursor.current.x}px; --y:${cursor.current.y}px; --r:${cursor.current.r}px; --show:${cursor.current.r > 0.5 ? 1 : 0};`}
>
	{#if darkNormal}
		<img src={normal} alt="" class="absolute inset-0 h-full w-full object-cover dark:hidden" />
		<img
			src={darkNormal}
			alt=""
			class="absolute inset-0 hidden h-full w-full object-cover dark:block"
		/>
	{:else}
		<img src={normal} alt="" class="absolute inset-0 h-full w-full object-cover" />
	{/if}
	<img
		src={hover}
		alt=""
		aria-hidden="true"
		class="hover-layer absolute inset-0 h-full w-full object-cover"
	/>
	<span class="ring" aria-hidden="true"></span>
</div>

<style>
	.hover-photo {
		outline: none;
		touch-action: pan-y;
	}

	.hover-photo:focus-visible {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
	}

	/* gambar hover hanya terlihat di dalam lingkaran sekitar kursor */
	.hover-layer {
		opacity: var(--show);
		-webkit-mask-image: radial-gradient(
			circle at var(--x) var(--y),
			#000 0,
			#000 var(--r),
			transparent calc(var(--r) + 1.5px)
		);
		mask-image: radial-gradient(
			circle at var(--x) var(--y),
			#000 0,
			#000 var(--r),
			transparent calc(var(--r) + 1.5px)
		);
	}

	/* garis tipis di tepi lingkaran (hapus elemen .ring kalau tidak mau) */
	.ring {
		position: absolute;
		top: calc(var(--y) - var(--r));
		left: calc(var(--x) - var(--r));
		width: calc(var(--r) * 2);
		height: calc(var(--r) * 2);
		border: 1px solid color-mix(in srgb, white 55%, transparent);
		border-radius: 50%;
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--primary) 40%, transparent);
		opacity: var(--show);
		pointer-events: none;
	}
</style>
