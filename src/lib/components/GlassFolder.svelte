<script lang="ts">
	import { Spring } from 'svelte/motion';

	type Photo = { src: string; alt: string };
	type Props = { photos: Photo[]; label?: string };

	let { photos, label = 'GALERI' }: Props = $props();
	let open = $state(false);
	const tilt = new Spring({ x: 0, y: 0 }, { stiffness: 0.16, damping: 0.78, precision: 0.05 });

	const mid = $derived((photos.length - 1) / 2);

	function tiltFromPointer(event: PointerEvent) {
		if (event.pointerType === 'touch' || !matchMedia('(pointer: fine)').matches) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			void tilt.set({ x: 0, y: 0 }, { instant: true });
			return;
		}

		const target = event.currentTarget;
		if (!(target instanceof HTMLElement)) return;
		const bounds = target.getBoundingClientRect();
		const x = (event.clientX - bounds.left) / bounds.width - 0.5;
		const y = (event.clientY - bounds.top) / bounds.height - 0.5;
		tilt.target = { x: -y * 14, y: x * 14 };
	}

	function resetTilt(event?: PointerEvent) {
		if (event?.pointerType === 'touch') return;
		void tilt.set(
			{ x: 0, y: 0 },
			{ instant: matchMedia('(prefers-reduced-motion: reduce)').matches }
		);
	}
</script>

<button
	type="button"
	class="folder"
	class:folder-open={open}
	aria-label="{label}, {photos.length} foto"
	aria-expanded={open}
	onclick={() => (open = !open)}
	onpointermove={tiltFromPointer}
	onpointerleave={resetTilt}
	onpointercancel={resetTilt}
	style={`transform: perspective(900px) rotateX(${tilt.current.x}deg) rotateY(${tilt.current.y}deg);`}
>
	<span class="folder-back"></span>

	{#each photos as photo, i (photo.src)}
		<img src={photo.src} alt={photo.alt} class="folder-photo" style="--i: {i}; --o: {i - mid};" />
	{/each}

	<span class="folder-front">
		<span class="font-mono text-[11px] tracking-[1.1px] text-muted">
			{label} — {String(photos.length).padStart(2, '0')} FOTO — {open ? 'TUTUP' : 'BUKA'}
		</span>
	</span>
</button>

<style>
	.folder {
		position: relative;
		display: block;
		width: 100%;
		max-width: 460px;
		aspect-ratio: 3 / 2;
		padding: 0;
		border: 0;
		background: transparent;
		color: inherit;
		font: inherit;
		text-align: left;
		outline: none;
		transition: none;
		transform-style: preserve-3d;
	}

	.folder:focus-visible {
		outline: 2px solid var(--primary);
		outline-offset: 6px;
	}

	.folder-back {
		position: absolute;
		inset: 14% 0 0 0;
		border: 1px solid var(--line);
		background: var(--surface);
	}

	/* tab folder */
	.folder-back::before {
		position: absolute;
		top: -18px;
		left: -1px;
		width: 38%;
		height: 18px;
		border: 1px solid var(--line);
		border-bottom: 0;
		background: var(--surface);
		content: '';
	}

	.folder-photo {
		position: absolute;
		bottom: 12%;
		left: 50%;
		width: 62%;
		aspect-ratio: 4 / 3;
		border: 1px solid var(--line);
		background: var(--bg);
		object-fit: cover;
		transform: translateX(-50%) translateX(calc(var(--o) * var(--spread, 9%)))
			translateY(calc(var(--rise, 0%) - var(--i) * var(--rise-step, 0%)))
			rotate(calc(var(--o) * var(--fan-angle, 2deg)));
		transition: transform 560ms var(--ease-out-expo);
		transition-delay: calc(var(--i) * 60ms);
	}

	.folder-open {
		--spread: 22%;
		--rise: -26%;
		--rise-step: 3%;
		--fan-angle: 6deg;
	}

	@media (hover: hover) and (pointer: fine) {
		.folder:hover {
			--spread: 22%;
			--rise: -26%;
			--rise-step: 3%;
			--fan-angle: 6deg;
		}
	}

	/* kaca: blur menampilkan foto yang menempel di belakangnya */
	.folder-front {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: flex-end;
		height: 62%;
		min-height: 44px;
		padding: 16px;
		border: 1px solid var(--line);
		background: color-mix(in srgb, var(--bg) 45%, transparent);
		box-shadow: inset 0 1px 0 color-mix(in srgb, white 45%, transparent);
		backdrop-filter: blur(10px) saturate(1.2);
		-webkit-backdrop-filter: blur(10px) saturate(1.2);
		cursor: pointer;
	}

	@media (prefers-reduced-motion: reduce) {
		.folder-photo {
			transition: none;
		}
	}
</style>
