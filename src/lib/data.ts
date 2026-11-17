export type Project = {
	title: string;
	description: string;
	stack: string;
	year: number;
	href?: string;
};

export const projects: Project[] = [
	{
		title: 'Go Finance',
		description: 'Aplikasi pencatatan keuangan pribadi untuk Android dengan sinkronisasi cloud.',
		stack: 'Flutter, Dart',
		year: 2026,
		href: 'https://github.com/Syaarif/Go-Finance-'
	},
	{
		title: 'Smile Photobooth',
		description: 'Aplikasi photobooth untuk acara, dengan fitur pengambilan foto, filter, dan cetak.',
		stack: 'Vite',
		year: 2026,
		href: 'https://github.com/Syaarif/SmilePhotobooth'
	},
	{
		title: 'Student Violation System',
		description: 'Sistem informasi pelanggaran siswa untuk sekolah, dengan fitur manajemen data dan laporan.',
		stack: 'Python',
		year: 2026,
		href: 'https://github.com/Syaarif/STUDENT-VIOLATION-SYSTEM'
	}
];

export const profile = {
	bio: 'Saya suka membangun hal yang berguna dan terlihat rapi. Saat ini belajar SvelteKit dan TypeScript, sambil mengerjakan proyek kecil untuk sekolah dan komunitas.',
	facts: [
		{ label: 'FOKUS', value: 'Antarmuka web & sistem informasi' },
		{ label: 'STACK', value: 'SvelteKit · TypeScript · Tailwind' },
		{ label: 'LOKASI', value: 'Indonesia' },
		{ label: 'STATUS', value: 'Terbuka untuk kolaborasi' }
	],
	skills: ['HTML', 'CSS', 'JavaScript', 'SvelteKit', 'Tailwind', 'Git']
};
