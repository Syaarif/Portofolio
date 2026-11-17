<script lang="ts">
	type Props = {
		normal: string;
		hover: string;
		alt: string;
		class?: string;
		radius?: number; // jari-jari lingkaran di sekitar kursor (px)
	};

	let { normal, hover, alt, class: className = '', radius = 110 }: Props = $props();

	let box: HTMLDivElement | undefined = $state();

	// x, y, r = yang tampil; tx, ty, tr = tujuan
	let x = 0;
	let y = 0;
	let r = 0;
	let tx = 0;
	let ty = 0;
	let tr = 0;
	let raf = 0;

	const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

	function paint() {
		if (!box) return;
		box.style.setProperty('--x', `${x}px`);
		box.style.setProperty('--y', `${y}px`);
		box.style.setProperty('--r', `${r}px`);
		box.style.setProperty('--show', r > 0.5 ? '1' : '0');
	}

	function tick() {
		const snap = reduce();
		x += (tx - x) * (snap ? 1 : 0.2);
		y += (ty - y) * (snap ? 1 : 0.2);
		r += (tr - r) * (snap ? 1 : 0.14);
		if (Math.abs(tx - x) < 0.3 && Math.abs(ty - y) < 0.3 && Math.abs(tr - r) < 0.3) {
			x = tx;
			y = ty;
			r = tr;
			paint();
			raf = 0;
			return;
		}
		paint();
		raf = requestAnimationFrame(tick);
	}

	function run() {
		if (!raf) raf = requestAnimationFrame(tick);
	}

	function point(e: PointerEvent) {
		const b = box!.getBoundingClientRect();
		tx = e.clientX - b.left;
		ty = e.clientY - b.top;
	}

	function enter(e: PointerEvent) {
		point(e);
		x = tx; // lingkaran tumbuh tepat di posisi kursor
		y = ty;
		tr = radius;
		run();
	}

	function move(e: PointerEvent) {
		point(e);
		tr = radius;
		run();
	}

	function leave() {
		tr = 0;
		run();
	}

	// keyboard: fokus membuka seluruh foto hover
	function focus(e: FocusEvent) {
		if (!(e.currentTarget as HTMLElement).matches(':focus-visible')) return;
		const b = box!.getBoundingClientRect();
		tx = b.width / 2;
		ty = b.height / 2;
		tr = Math.hypot(b.width, b.height) / 2 + 4;
		run();
	}

	$effect(() => () => cancelAnimationFrame(raf));
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
	onpointercancel={leave}
	onfocus={focus}
	onblur={leave}
>
	<img src={normal} alt="" class="absolute inset-0 h-full w-full object-cover" />
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
		--x: 0px;
		--y: 0px;
		--r: 0px;
		--show: 0;
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