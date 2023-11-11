import * as adapter from '@astrojs/netlify/netlify-functions.js';
import { renderers } from './renderers.mjs';
import { manifest } from './manifest_51a42f15.mjs';

const _page0  = () => import('./chunks/generic_0ec3eefc.mjs');
const _page1  = () => import('./chunks/index_cb6c2aea.mjs');
const _page2  = () => import('./chunks/resume_f1f2c4a6.mjs');
const _page3  = () => import('./chunks/index_6a408943.mjs');
const _page4  = () => import('./chunks/_.._e37c7b7d.mjs');const pageMap = new Map([["node_modules/astro/dist/assets/endpoint/generic.js", _page0],["src/pages/index.astro", _page1],["src/pages/resume.astro", _page2],["src/pages/blog/index.astro", _page3],["src/pages/blog/[...slug].astro", _page4]]);
const _manifest = Object.assign(manifest, {
	pageMap,
	renderers,
});
const _args = {};

const _exports = adapter.createExports(_manifest, _args);
const handler = _exports['handler'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { handler, pageMap };
