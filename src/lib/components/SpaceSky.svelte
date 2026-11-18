<script lang="ts">
	import { untrack } from 'svelte';

	type Star = { x: number; y: number; size: number; duration: number; delay: number };
	type Cloud = {
		x: number;
		y: number;
		scale: number;
		speed: number;
		sprite: number;
		alpha: number;
	};

	let canvas: HTMLCanvasElement | undefined = $state();
	let tabHidden = $state(false);

	function seeded(index: number, salt: number) {
		const value = Math.sin((index + 1) * 127.1 + salt * 311.7) * 43758.5453;
		return value - Math.floor(value);
	}

	const stars: Star[] = Array.from({ length: 64 }, (_, i) => ({
		x: seeded(i, 1) * 100,
		y: seeded(i, 2) * 100,
		size: 1 + seeded(i, 3) * 1.8,
		duration: 2.4 + seeded(i, 4) * 3.8,
		delay: -seeded(i, 5) * 6.2
	}));

	// ── warna: ubah di sini ──
	const DARK_TOP = '#040b1f';
	const DARK_BOTTOM = '#0a1c3d';
	const LIGHT_TOP = '#b9daf3';
	const LIGHT_BOTTOM = '#ffffff';

	let target = untrack(() =>
		typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 0 : 1
	); // 0 = malam, 1 = siang
	let kick: (() => void) | undefined;

	$effect(() => {
		const root = document.documentElement;
		const syncTheme = () => {
			target = root.classList.contains('dark') ? 0 : 1;
			kick?.();
		};
		const observer = new MutationObserver(syncTheme);
		observer.observe(root, { attributes: true, attributeFilter: ['class'] });
		syncTheme();

		return () => observer.disconnect();
	});

	// awan dibuat sekali sebagai gambar, lalu hanya digeser
	function makeCloud(): HTMLCanvasElement {
		const c = document.createElement('canvas');
		c.width = 360;
		c.height = 160;
		const g = c.getContext('2d')!;
		const n = 5 + Math.floor(Math.random() * 3);
		const puffs = Array.from({ length: n }, (_, i) => ({
			x: 60 + i * (240 / (n - 1)) + (Math.random() * 30 - 15),
			y: 90 - Math.sin((i / (n - 1)) * Math.PI) * 28 + (Math.random() * 14 - 7),
			r: 36 + Math.random() * 26
		}));
		const paint = (dy: number, rgb: string, a: number) => {
			for (const p of puffs) {
				const grad = g.createRadialGradient(p.x, p.y + dy, 0, p.x, p.y + dy, p.r);
				grad.addColorStop(0, `rgba(${rgb},${a})`);
				grad.addColorStop(1, `rgba(${rgb},0)`);
				g.fillStyle = grad;
				g.beginPath();
				g.arc(p.x, p.y + dy, p.r, 0, Math.PI * 2);
				g.fill();
			}
		};
		paint(14, '150,185,225', 0.5); // bayangan biru di bawah awan
		paint(0, '255,255,255', 0.95);
		return c;
	}

	$effect(() => {
		const el = canvas;
		const ctx = el?.getContext('2d');
		if (!el || !ctx) return;

		const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
		let reduce = motionPreference.matches;
		let mix = target;
		let w = 0;
		let h = 0;
		let raf = 0;
		let last = 0;
		let nextShot = 12000 + Math.random() * 8000;
		let darkGrad: CanvasGradient;
		let lightGrad: CanvasGradient;
		const shot = { on: false, x: 0, y: 0, dx: 0, dy: 0, born: 0 };

		const sprites = [makeCloud(), makeCloud(), makeCloud()];
		let clouds: Cloud[] = [];

		function createClouds(count: number) {
			return Array.from({ length: count }, (_, i) => ({
				x: Math.random(),
				y: 0.05 + Math.random() * 0.75,
				scale: 0.7 + Math.random() * 1.1,
				speed: 0.005 + Math.random() * 0.012,
				sprite: i % 3,
				alpha: 0.55 + Math.random() * 0.4
			}));
		}

		function resize() {
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			w = window.innerWidth;
			h = window.innerHeight;
			el!.width = w * dpr;
			el!.height = h * dpr;
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
			darkGrad = ctx!.createLinearGradient(0, 0, 0, h);
			darkGrad.addColorStop(0, DARK_TOP);
			darkGrad.addColorStop(1, DARK_BOTTOM);
			lightGrad = ctx!.createLinearGradient(0, 0, 0, h);
			lightGrad.addColorStop(0, LIGHT_TOP);
			lightGrad.addColorStop(1, LIGHT_BOTTOM);
			const cloudCount = window.matchMedia('(max-width: 639px)').matches ? 3 : 8;
			if (clouds.length !== cloudCount) clouds = createClouds(cloudCount);
			if (reduce) draw(0);
		}

		function draw(t: number) {
			const c = ctx!;
			const e = mix * mix * (3 - 2 * mix); // easing transisi
			c.globalAlpha = 1;

			if (e < 1) {
				c.fillStyle = darkGrad;
				c.fillRect(0, 0, w, h);

				// nebula tipis, bergeser pelan
				const nx = w * 0.75 + Math.sin(t * 0.00004) * 60;
				const ny = h * 0.28;
				const ng = c.createRadialGradient(nx, ny, 0, nx, ny, Math.max(w, h) * 0.5);
				ng.addColorStop(0, 'rgba(28,77,141,0.30)');
				ng.addColorStop(1, 'rgba(28,77,141,0)');
				c.fillStyle = ng;
				c.fillRect(0, 0, w, h);

				// bintang jatuh
				if (shot.on) {
					const age = t - shot.born;
					if (age > 800) {
						shot.on = false;
					} else {
						const dist = age * 0.9;
						const hx = shot.x + shot.dx * dist;
						const hy = shot.y + shot.dy * dist;
						const tx = hx - shot.dx * 140;
						const ty = hy - shot.dy * 140;
						const g = c.createLinearGradient(tx, ty, hx, hy);
						g.addColorStop(0, 'rgba(189,232,245,0)');
						g.addColorStop(1, 'rgba(255,255,255,0.95)');
						c.globalAlpha = Math.sin((age / 800) * Math.PI);
						c.strokeStyle = g;
						c.lineWidth = 1.4;
						c.lineCap = 'round';
						c.beginPath();
						c.moveTo(tx, ty);
						c.lineTo(hx, hy);
						c.stroke();
					}
				}
				c.globalAlpha = 1;
			}

			if (e > 0) {
				c.globalAlpha = e;
				c.fillStyle = lightGrad;
				c.fillRect(0, 0, w, h);

				const k = Math.max(0.6, w / 1440);
				for (const cl of clouds) {
					const img = sprites[cl.sprite];
					const cw = img.width * cl.scale * k;
					const ch = img.height * cl.scale * k;
					const span = w + cw;
					const x = ((cl.x * span + t * cl.speed) % span) - cw;
					c.globalAlpha = e * cl.alpha;
					c.drawImage(img, x, cl.y * h, cw, ch);
				}
				c.globalAlpha = 1;
			}
		}

		function loop(t: number) {
			const dt = last ? Math.min(t - last, 64) : 16;
			last = t;
			mix += Math.sign(target - mix) * Math.min(Math.abs(target - mix), dt / 1100);

			if (!shot.on && t > nextShot && mix < 0.5) {
				const a = ((150 + Math.random() * 20) * Math.PI) / 180;
				Object.assign(shot, {
					on: true,
					x: w * (0.3 + Math.random() * 0.7),
					y: h * Math.random() * 0.35,
					dx: Math.cos(a),
					dy: Math.sin(a),
					born: t
				});
				nextShot = t + 18000 + Math.random() * 22000;
			}

			draw(t);
			raf = requestAnimationFrame(loop);
		}

		function onVisibility() {
			tabHidden = document.hidden;
			cancelAnimationFrame(raf);
			last = 0;
			if (!document.hidden && !reduce) raf = requestAnimationFrame(loop);
		}

		function onMotionPreferenceChange() {
			reduce = motionPreference.matches;
			cancelAnimationFrame(raf);
			last = 0;
			if (reduce) {
				shot.on = false;
				mix = target;
				draw(0);
			} else if (!document.hidden) {
				raf = requestAnimationFrame(loop);
			}
		}

		kick = () => {
			if (reduce) {
				mix = target;
				draw(0);
			}
		};

		resize();
		tabHidden = document.hidden;
		window.addEventListener('resize', resize);
		document.addEventListener('visibilitychange', onVisibility);
		motionPreference.addEventListener('change', onMotionPreferenceChange);
		if (!reduce && !document.hidden) {
			raf = requestAnimationFrame(loop);
		}

		return () => {
			kick = undefined;
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', resize);
			document.removeEventListener('visibilitychange', onVisibility);
			motionPreference.removeEventListener('change', onMotionPreferenceChange);
		};
	});
</script>

<div class="star-field" class:paused={tabHidden} aria-hidden="true">
	{#each stars as star, i (i)}
		<span
			class="sky-star animate-twinkle {i >= 28 ? 'sky-star-desktop' : ''}"
			style={`--x:${star.x}%; --y:${star.y}%; --size:${star.size}px; --duration:${star.duration}s; --delay:${star.delay}s;`}
		></span>
	{/each}
</div>

<canvas
	bind:this={canvas}
	aria-hidden="true"
	class="pointer-events-none fixed inset-0 -z-10 h-full w-full"
></canvas>

<style>
	.star-field {
		position: fixed;
		z-index: -9;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		opacity: 0;
		transition: opacity 500ms var(--ease-out-expo);
	}

	:global(.dark) .star-field {
		opacity: 1;
	}

	.sky-star {
		position: absolute;
		top: var(--y);
		left: var(--x);
		width: var(--size);
		height: var(--size);
		border-radius: 50%;
		background: #bde8f5;
		animation-duration: var(--duration);
		animation-delay: var(--delay);
		animation-play-state: paused;
	}

	:global(.dark) .sky-star {
		animation-play-state: running;
	}

	.star-field.paused .sky-star {
		animation-play-state: paused;
	}

	@media (max-width: 639px) {
		.sky-star-desktop {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.star-field {
			transition: none;
		}

		.sky-star {
			animation: none;
			opacity: 0.7;
			transform: none;
		}
	}
</style>
