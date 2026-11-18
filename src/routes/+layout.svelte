<script lang="ts">
	import './layout.css';
	import 'lenis/dist/lenis.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import Lenis from 'lenis';
	import { onMount } from 'svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	let scrollProgress = $state(0);
	let lenis: Lenis | undefined;
	const pageTitle = $derived(
		page.status >= 400 ? `${page.status} — Portofolio — OOTS 2026` : 'Portofolio — OOTS 2026'
	);

	onNavigate((navigation) => {
		const routeChanged =
			navigation.from != null &&
			navigation.to != null &&
			navigation.from.url.pathname !== navigation.to.url.pathname;

		if (routeChanged && lenis) {
			lenis.scrollTo(0, { immediate: true });
		}

		if (
			typeof document === 'undefined' ||
			typeof document.startViewTransition !== 'function' ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			return;
		}

		const root = document.documentElement;
		root.dataset.pageTransition = 'true';

		return new Promise<void>((resolve) => {
			const transition = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
			const clearPageTransition = () => root.removeAttribute('data-page-transition');
			void transition.finished.then(clearPageTransition, clearPageTransition);
		});
	});

	onMount(() => {
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		const supportsViewTimeline =
			CSS.supports('animation-timeline: view()') &&
			CSS.supports('animation-range: entry 0% entry 30%');
		let revealObserver: IntersectionObserver | undefined;
		let progressFrame = 0;

		function updateRevealMode() {
			revealObserver?.disconnect();
			revealObserver = undefined;

			const sections = document.querySelectorAll<HTMLElement>('.scroll-reveal');
			sections.forEach((section) => {
				section.classList.remove('scroll-reveal-pending', 'scroll-reveal-visible');
			});

			if (reducedMotion.matches || supportsViewTimeline || !('IntersectionObserver' in window)) {
				return;
			}

			revealObserver = new IntersectionObserver(
				(entries, observer) => {
					for (const entry of entries) {
						if (!entry.isIntersecting) continue;
						entry.target.classList.remove('scroll-reveal-pending');
						entry.target.classList.add('scroll-reveal-visible');
						observer.unobserve(entry.target);
					}
				},
				{ threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
			);

			sections.forEach((section) => {
				section.classList.add('scroll-reveal-pending');
				revealObserver?.observe(section);
			});
		}

		function syncLenis() {
			if (reducedMotion.matches) {
				lenis?.destroy();
				lenis = undefined;
				return;
			}

			lenis ??= new Lenis({ autoRaf: true, anchors: false });
		}

		function handleAnchorClick(event: MouseEvent) {
			if (
				!lenis ||
				event.defaultPrevented ||
				event.button !== 0 ||
				event.metaKey ||
				event.ctrlKey ||
				event.shiftKey ||
				event.altKey ||
				!(event.target instanceof Element)
			) {
				return;
			}

			const link = event.target.closest<HTMLAnchorElement>('a[href]');
			if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self'))
				return;

			const destination = new URL(link.href, window.location.href);
			if (
				destination.origin !== window.location.origin ||
				destination.pathname !== window.location.pathname ||
				destination.search !== window.location.search ||
				!destination.hash
			) {
				return;
			}

			const target = document.getElementById(decodeURIComponent(destination.hash.slice(1)));
			if (!target) return;

			event.preventDefault();
			if (destination.hash !== window.location.hash) {
				window.history.pushState(null, '', destination.hash);
			}

			const header = document.querySelector<HTMLElement>('header');
			const offset = -(header?.getBoundingClientRect().bottom ?? 60) - 20;
			lenis.scrollTo(target, { offset });
		}

		function updateProgress() {
			if (progressFrame) return;
			progressFrame = requestAnimationFrame(() => {
				progressFrame = 0;
				const scrollable = document.documentElement.scrollHeight - window.innerHeight;
				scrollProgress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
			});
		}

		syncLenis();
		updateRevealMode();
		updateProgress();
		window.addEventListener('click', handleAnchorClick, true);
		window.addEventListener('scroll', updateProgress, { passive: true });
		window.addEventListener('resize', updateProgress, { passive: true });
		reducedMotion.addEventListener('change', syncLenis);
		reducedMotion.addEventListener('change', updateRevealMode);

		return () => {
			window.removeEventListener('click', handleAnchorClick, true);
			window.removeEventListener('scroll', updateProgress);
			window.removeEventListener('resize', updateProgress);
			reducedMotion.removeEventListener('change', syncLenis);
			reducedMotion.removeEventListener('change', updateRevealMode);
			revealObserver?.disconnect();
			lenis?.destroy();
			if (progressFrame) cancelAnimationFrame(progressFrame);
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{pageTitle}</title>
	<meta
		name="description"
		content="Portofolio Muhammad Syaarif, siswa SMK jurusan PPLG yang membangun antarmuka web dan proyek digital."
	/>
	<meta property="og:title" content={pageTitle} />
	<meta
		property="og:description"
		content="Lihat proyek, pendidikan, dan teknologi yang sedang dipelajari Muhammad Syaarif."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<div class="scroll-progress" style={`--scroll-progress:${scrollProgress}`} aria-hidden="true"></div>

{@render children()}
