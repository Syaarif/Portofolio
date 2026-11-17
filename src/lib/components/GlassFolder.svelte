<script lang="ts">
	type Photo = { src: string; alt: string };
	type Props = { photos: Photo[]; label?: string };

	let { photos, label = 'GALERI' }: Props = $props();

	// pusat kipas: foto di tengah hampir lurus, foto di tepi miring
	const mid = $derived((photos.length - 1) / 2);
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class="folder" role="group" aria-label="{label}, {photos.length} foto" tabindex="0">
	<div class="folder-back"></div>

	{#each photos as photo, i (photo.src)}
		<img
			src={photo.src}
			alt={photo.alt}
			class="folder-photo"
			style="--i: {i}; --o: {i - mid};"
		/>
	{/each}

	<div class="folder-front">
		<span class="font-mono text-[11px] tracking-[1.1px] text-muted">
			{label} — {String(photos.length).padStart(2, '0')} FOTO
		</span>
	</div>
</div>

<style>
	.folder {
		position: relative;
		width: 100%;
		max-width: 460px;
		aspect-ratio: 3 / 2;
		outline: none;
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
		transform: translateX(-50%) translateX(calc(var(--o) * 9%)) rotate(calc(var(--o) * 2deg));
		transition: transform 560ms cubic-bezier(0.2, 0.8, 0.2, 1);
		transition-delay: calc(var(--i) * 60ms);
	}

	.folder:is(:hover, :focus) .folder-photo {
		transform: translateX(-50%) translateX(calc(var(--o) * 22%))
			translateY(calc(-26% - var(--i) * 3%)) rotate(calc(var(--o) * 6deg));
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
		padding: 16px;
		border: 1px solid var(--line);
		background: color-mix(in srgb, var(--bg) 45%, transparent);
		box-shadow: inset 0 1px 0 color-mix(in srgb, white 45%, transparent);
		backdrop-filter: blur(10px) saturate(1.2);
		-webkit-backdrop-filter: blur(10px) saturate(1.2);
	}

	@media (prefers-reduced-motion: reduce) {
		.folder-photo {
			transition: none;
		}
	}
</style>
