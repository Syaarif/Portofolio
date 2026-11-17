<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import NavLink from '$lib/components/NavLink.svelte';
	import ProjectRow from '$lib/components/ProjectRow.svelte';
	import { projects, profile, folderPhotos, education, techStack } from '$lib/data';
	import HoverPhoto from '$lib/components/HoverPhoto.svelte';
	import GlassFolder from '$lib/components/GlassFolder.svelte';
	import Credentials from '$lib/components/Credentials.svelte';
	import SpaceSky from '$lib/components/SpaceSky.svelte';

	type Theme = 'light' | 'dark';
	type Status = 'idle' | 'loading' | 'success' | 'error';

	let theme: Theme = $state('light');
	let status: Status = $state('idle');
	let menuOpen = $state(false);
</script>
<div class="relative isolate min-h-dvh bg-bg text-ink {theme === 'dark' ? 'dark' : ''}">
	<SpaceSky {theme} />

	<header class="sticky top-4 z-50 px-4 sm:px-6">
		<!-- Bentuk Dynamic Island (Pill) -->
		<div
			class="relative mx-auto flex h-[54px] w-full max-w-4xl items-center justify-between rounded-full border border-line bg-bg/80 px-5 shadow-lg shadow-black/5 backdrop-blur-md lg:h-[60px] lg:px-7 dark:shadow-black/30"
		>
			<a
				href="/"
				class="ui-brand-link inline-flex min-h-10 items-center text-[14px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:text-[15px]"
				>Muhammad Syaarif</a
			>

			<div class="flex items-center gap-1.5 lg:gap-6">
				<nav class="hidden items-center gap-6 lg:flex">
					<NavLink href="#proyek">Proyek</NavLink>
					<NavLink href="#tentang">Tentang</NavLink>
					<NavLink href="#kontak">Kontak</NavLink>
					<NavLink href="#galeri">Galeri</NavLink>
					<NavLink href="#pendidikan">Pendidikan</NavLink>
					<NavLink href="#stack">Stack</NavLink>
				</nav>

				<Button
					variant="icon"
					aria-label="Ganti tema"
					onclick={() => (theme = theme === 'dark' ? 'light' : 'dark')}
				>
					<svg
						width="17"
						height="17"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="ui-theme-icon dark:hidden"
					>
						<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
					</svg>
					<svg
						width="17"
						height="17"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						class="ui-theme-icon hidden dark:block"
					>
						<circle cx="12" cy="12" r="4" />
						<path
							d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
						/>
					</svg>
				</Button>

				<Button
					variant="icon"
					aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
					aria-expanded={menuOpen}
					aria-controls="mobile-navigation"
					onclick={() => (menuOpen = !menuOpen)}
					class="lg:hidden"
				>
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					>
						<path d="M4 7h16M4 12h16M4 17h16" />
					</svg>
				</Button>
			</div>

			{#if menuOpen}
				<nav
					id="mobile-navigation"
					aria-label="Navigasi utama"
					class="absolute top-[calc(100%+10px)] right-0 left-0 flex flex-col gap-1 rounded-2xl border border-line bg-bg/95 p-3 shadow-xl backdrop-blur-md lg:hidden"
				>
					<NavLink href="#proyek">Proyek</NavLink>
					<NavLink href="#tentang">Tentang</NavLink>
					<NavLink href="#kontak">Kontak</NavLink>
					<NavLink href="#galeri">Galeri</NavLink>
					<NavLink href="#pendidikan">Pendidikan</NavLink>
					<NavLink href="#stack">Stack</NavLink>
				</nav>
			{/if}
		</div>
	</header>

	<!-- hero -->
	<section class="mx-auto max-w-[1440px] px-6 pt-16 pb-14 lg:px-24 lg:pt-[120px]">
		<h1
			class="text-[62px] leading-[0.88] font-medium tracking-[-1.6px] lg:text-[100px] lg:tracking-[-9px]"
		>
			Muhammad Syaarif
		</h1>

		<div class="mt-7 flex flex-col gap-6">
			<p class="max-w-[560px] text-[17px] leading-[1.6] text-muted lg:text-xl">
				Siswa SMK jurusan RPL. Membangun antarmuka web yang cepat, rapi, dan mudah dipakai.
			</p>

			<div class="flex items-center gap-3">
				<Button href="#proyek">
					Lihat proyek
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
				<Button variant="outline" href="#kontak">Hubungi saya</Button>
			</div>

			<p class="font-mono text-[11px] tracking-[1.1px] text-muted">
				TERSEDIA UNTUK PROYEK BARU — 2026
			</p>
		</div>
	</section>

	<!-- band -->
	<div class="border-t border-line">
		<img
			src={theme === 'dark' ? '/images/band-dark.png' : '/images/band-light.png'}
			alt="band"
			class="h-[220px] w-full object-cover lg:h-[420px]"
		/>

	</div>

	<!-- proyek -->
	<section id="proyek" class="border-t border-line">
		<div class="mx-auto max-w-[1440px] px-6 pt-5 pb-14 lg:px-24 lg:pb-24">
			<p class="font-mono text-[11px] tracking-[1.1px]">PROYEK</p>

			<div class="mt-7 flex flex-col divide-y divide-line lg:mt-10">
				{#each projects as project, i (project.title)}
					<ProjectRow {project} index={i} />
				{/each}
			</div>
		</div>
	</section>

	<!-- tentang -->
	<section id="tentang" class="border-t border-line">
		<div class="mx-auto max-w-[1440px] px-6 pt-5 pb-14 lg:px-24 lg:pb-24">
			<p class="font-mono text-[11px] tracking-[1.1px]">TENTANG</p>

			<div class="mt-7 flex flex-col items-start gap-8 lg:mt-10 lg:flex-row lg:gap-24">
				<HoverPhoto
					normal={theme === 'dark' ? '/images/portrait-dark.png' : '/images/portrait-light.png'}
					hover="/images/portfolio/hover/profile-hover.png"
					alt="Foto profil"
					radius={50}
					class="h-[428px] w-full lg:h-[525px] lg:w-[420px]"
				/>
/>

				<div class="flex w-full flex-col gap-7">
					<p class="max-w-[520px] text-[17px] leading-[1.6] text-muted lg:text-xl">
						{profile.bio}
					</p>

					<div class="flex flex-col divide-y divide-line">
						{#each profile.facts as fact}
							<div class="flex items-center justify-between gap-8 py-4">
								<span class="font-mono text-[11px] tracking-[1.1px] text-muted">
									{fact.label}
								</span>
								<span class="text-[15px]">{fact.value}</span>
							</div>
						{/each}
					</div>

					<div class="flex flex-col gap-3">
						<span class="font-mono text-[11px] tracking-[1.1px] text-muted">KEAHLIAN</span>
						<div class="flex flex-wrap gap-2">
							{#each profile.skills as skill}
								<span
									class="border border-line px-2.5 py-[7px] font-mono text-[11px] tracking-[1.1px] text-muted"
								>
									{skill}
								</span>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Galeri -->
		<section id="galeri" class="border-t border-line">
			<div class="mx-auto max-w-[1440px] px-6 pt-5 pb-14 lg:px-24 lg:pb-24">
				<p class="font-mono text-[11px] tracking-[1.1px]">GALERI</p>
				<div class="mt-7 grid grid-cols-1 gap-16 lg:mt-10 lg:grid-cols-2 lg:gap-24">
					<GlassFolder photos={folderPhotos} label="Certificate" />
					<GlassFolder photos={folderPhotos} label="Project" />
				</div>
			</div>
		</section>
		<Credentials {education} {techStack} />

	<!-- kontak -->
	<section id="kontak" class="border-t border-line">
		<div class="mx-auto max-w-[1440px] px-6 pt-5 pb-14 lg:px-24 lg:pb-24">
			<p class="font-mono text-[11px] tracking-[1.1px]">KONTAK</p>

			<div class="mt-7 flex flex-col gap-8 lg:mt-10 lg:flex-row lg:gap-24">
				<p class="max-w-[420px] text-[17px] leading-[1.6] text-muted lg:text-xl">
					Punya pertanyaan atau ingin bekerja sama? Kirim pesan.
				</p>

				<form
					method="POST"
					action="?/kirim"
					use:enhance={() => {
						status = 'loading';
						return async ({ result, update }) => {
							await update({ reset: result.type === 'success' });
							status = result.type === 'success' ? 'success' : 'error';
						};
					}}
					class="flex w-full flex-col gap-4 lg:w-[440px] lg:shrink-0"
				>
					<label class="flex flex-col gap-2">
						<span class="font-mono text-[11px] tracking-[1.1px] text-muted">NAMA</span>
						<input
							name="nama"
							required
							autocomplete="name"
							placeholder="Nama lengkap kamu"
							class="ui-input h-12 w-full border border-line bg-bg px-3.5 text-[15px] outline-none placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
						/>
					</label>

					<label class="flex flex-col gap-2">
						<span class="font-mono text-[11px] tracking-[1.1px] text-muted">EMAIL</span>
						<input
							name="email"
							type="email"
							required
							autocomplete="email"
							placeholder="nama@email.com"
							class="ui-input h-12 w-full border border-line bg-bg px-3.5 text-[15px] outline-none placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
						/>
					</label>

					<label class="flex flex-col gap-2">
						<span class="font-mono text-[11px] tracking-[1.1px] text-muted">PESAN</span>
						<textarea
							name="pesan"
							required
							rows="5"
							placeholder="Tulis pesan kamu di sini"
							class="ui-input min-h-[120px] w-full border border-line bg-bg px-3.5 py-3 text-[15px] outline-none placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
						></textarea>
					</label>

					<Button type="submit" disabled={status === 'loading'}>
						{#if status === 'loading'}
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								class="animate-spin motion-reduce:animate-none"
							>
								<path d="M12 3a9 9 0 1 0 9 9" />
							</svg>
							Mengirim...
						{:else}
							Kirim pesan
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
						{/if}
					</Button>

					{#if status !== 'idle'}
						<div class="flex items-center gap-3 border border-line px-4 py-3.5">
							{#if status === 'loading'}
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									class="animate-spin text-muted motion-reduce:animate-none"
								>
									<path d="M12 3a9 9 0 1 0 9 9" />
								</svg>
								<span class="text-sm text-muted">Mengirim pesan...</span>
							{:else if status === 'success'}
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="text-success"
								>
									<path d="M20 6 9 17l-5-5" />
								</svg>
								<span class="text-sm text-success">Pesan terkirim. Terima kasih!</span>
							{:else}
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="text-danger"
								>
									<circle cx="12" cy="12" r="9" />
									<path d="M12 8v5M12 16.5v.01" />
								</svg>
								<span class="text-sm text-danger">Gagal mengirim. Coba lagi.</span>
							{/if}
						</div>
					{/if}
				</form>
			</div>
		</div>
	</section>

	<!-- footer -->
	<footer class="border-t border-line">
		<div class="mx-auto flex max-w-[1440px] flex-col gap-10 px-6 py-14 lg:px-24">
			<p
				class="max-w-[640px] text-[34px] leading-[1.05] font-medium tracking-[-0.6px] lg:text-[48px] lg:tracking-[-1.2px]"
			>
				Mari membangun sesuatu.
			</p>

			<div
				class="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6"
			>
				<a
					href="mailto:muhammadsyaarif777@email.com"
					class="ui-interactive ui-mono-link font-mono text-xs tracking-[1.1px] text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
				>
					muhammadsyaarif777@email.com
				</a>
				<div class="flex items-center gap-6">
					<a
						href="#proyek"
						class="ui-interactive ui-mono-link font-mono text-[11px] tracking-[1.1px] text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
						>PROYEK</a
					>
					<a
						href="https://github.com/Syaarif"
						class="ui-interactive ui-mono-link font-mono text-[11px] tracking-[1.1px] text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
						>GITHUB</a
					>
					<a
						href="mailto:muhammadsyaarif777@email.com"
						class="ui-interactive ui-mono-link font-mono text-[11px] tracking-[1.1px] text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
					>
						EMAIL
					</a>
				</div>
			</div>
		</div>
	</footer>
</div>
