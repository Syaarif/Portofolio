<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/Button.svelte';
	import SpaceSky from '$lib/components/SpaceSky.svelte';
</script>

<main
	class="relative isolate flex min-h-dvh items-center justify-center bg-bg px-6 py-16 text-ink"
	aria-labelledby="error-title"
>
	<SpaceSky />

	<div class="relative z-10 w-full max-w-3xl border-y border-line py-10 sm:py-14">
		<p class="font-mono text-[11px] tracking-[1.1px] text-muted">
			STATUS / {page.status}
		</p>
		<h1
			id="error-title"
			class="mt-5 text-[clamp(4rem,18vw,9rem)] leading-[0.88] font-medium tracking-[-0.08em]"
		>
			{page.status}
		</h1>
		<p class="mt-7 max-w-xl text-[17px] leading-[1.6] text-muted">
			{page.status === 404
				? 'Halaman yang kamu cari tidak ditemukan.'
				: 'Terjadi kendala saat memuat halaman ini.'}
		</p>

		<div class="mt-8">
			<Button href="/">
				Kembali ke beranda
				<svg
					class="ui-button-arrow"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M5 12h14M13 6l6 6-6 6" />
				</svg>
			</Button>
		</div>
	</div>
</main>
