import { writable } from 'svelte/store';

export const svgStore = writable<string[]>([]);

export function addSVG(svg: string) {
	svgStore.update((svgs) => [...svgs, svg]);
}
