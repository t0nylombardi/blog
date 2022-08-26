import * as adapter from '@astrojs/netlify/netlify-functions.js';
import React, { createElement, useState } from 'react';
import ReactDOM from 'react-dom/server';
import { escape } from 'html-escaper';
/* empty css                           *//* empty css                        *//* empty css                         */import VisibilitySensor from 'react-visibility-sensor';
import { useSpring, config, animated } from 'react-spring';
import { jsx, jsxs } from 'react/jsx-runtime';
/* empty css                           */import * as moment from 'moment';
import moment__default from 'moment';
import 'mime';
import 'kleur/colors';
import 'string-width';
import 'path-browserify';
import { compile } from 'path-to-regexp';

/**
 * Astro passes `children` as a string of HTML, so we need
 * a wrapper `div` to render that content as VNodes.
 *
 * As a bonus, we can signal to React that this subtree is
 * entirely static and will never change via `shouldComponentUpdate`.
 */
const StaticHtml = ({ value, name }) => {
	if (!value) return null;
	return createElement('astro-slot', {
		name,
		suppressHydrationWarning: true,
		dangerouslySetInnerHTML: { __html: value },
	});
};

/**
 * This tells React to opt-out of re-rendering this subtree,
 * In addition to being a performance optimization,
 * this also allows other frameworks to attach to `children`.
 *
 * See https://preactjs.com/guide/v8/external-dom-mutations
 */
StaticHtml.shouldComponentUpdate = () => false;

const slotName$1 = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
const reactTypeof = Symbol.for('react.element');

function errorIsComingFromPreactComponent(err) {
	return (
		err.message &&
		(err.message.startsWith("Cannot read property '__H'") ||
			err.message.includes("(reading '__H')"))
	);
}

async function check$1(Component, props, children) {
	// Note: there are packages that do some unholy things to create "components".
	// Checking the $$typeof property catches most of these patterns.
	if (typeof Component === 'object') {
		const $$typeof = Component['$$typeof'];
		return $$typeof && $$typeof.toString().slice('Symbol('.length).startsWith('react');
	}
	if (typeof Component !== 'function') return false;

	if (Component.prototype != null && typeof Component.prototype.render === 'function') {
		return React.Component.isPrototypeOf(Component) || React.PureComponent.isPrototypeOf(Component);
	}

	let error = null;
	let isReactComponent = false;
	function Tester(...args) {
		try {
			const vnode = Component(...args);
			if (vnode && vnode['$$typeof'] === reactTypeof) {
				isReactComponent = true;
			}
		} catch (err) {
			if (!errorIsComingFromPreactComponent(err)) {
				error = err;
			}
		}

		return React.createElement('div');
	}

	await renderToStaticMarkup$1(Tester, props, children, {});

	if (error) {
		throw error;
	}
	return isReactComponent;
}

async function getNodeWritable() {
	let nodeStreamBuiltinModuleName = 'stream';
	let { Writable } = await import(nodeStreamBuiltinModuleName);
	return Writable;
}

async function renderToStaticMarkup$1(Component, props, { default: children, ...slotted }, metadata) {
	delete props['class'];
	const slots = {};
	for (const [key, value] of Object.entries(slotted)) {
		const name = slotName$1(key);
		slots[name] = React.createElement(StaticHtml, { value, name });
	}
	// Note: create newProps to avoid mutating `props` before they are serialized
	const newProps = {
		...props,
		...slots,
		children: children != null ? React.createElement(StaticHtml, { value: children }) : undefined,
	};
	const vnode = React.createElement(Component, newProps);
	let html;
	if (metadata && metadata.hydrate) {
		html = ReactDOM.renderToString(vnode);
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToPipeableStreamAsync(vnode);
		}
	} else {
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToStaticNodeStreamAsync(vnode);
		}
	}
	return { html };
}

async function renderToPipeableStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve, reject) => {
		let error = undefined;
		let stream = ReactDOM.renderToPipeableStream(vnode, {
			onError(err) {
				error = err;
				reject(error);
			},
			onAllReady() {
				stream.pipe(
					new Writable({
						write(chunk, _encoding, callback) {
							html += chunk.toString('utf-8');
							callback();
						},
						destroy() {
							resolve(html);
						},
					})
				);
			},
		});
	});
}

async function renderToStaticNodeStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve) => {
		let stream = ReactDOM.renderToStaticNodeStream(vnode);
		stream.pipe(
			new Writable({
				write(chunk, _encoding, callback) {
					html += chunk.toString('utf-8');
					callback();
				},
				destroy() {
					resolve(html);
				},
			})
		);
	});
}

async function renderToReadableStreamAsync(vnode) {
	const decoder = new TextDecoder();
	const stream = await ReactDOM.renderToReadableStream(vnode);
	let html = '';
	for await (const chunk of stream) {
		html += decoder.decode(chunk);
	}
	return html;
}

const _renderer1 = {
	check: check$1,
	renderToStaticMarkup: renderToStaticMarkup$1,
};

const ASTRO_VERSION = "1.0.6";
function createDeprecatedFetchContentFn() {
  return () => {
    throw new Error("Deprecated: Astro.fetchContent() has been replaced with Astro.glob().");
  };
}
function createAstroGlobFn() {
  const globHandler = (importMetaGlobResult, globValue) => {
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new Error(`Astro.glob(${JSON.stringify(globValue())}) - no matches found.`);
    }
    return Promise.all(allEntries.map((fn) => fn()));
  };
  return globHandler;
}
function createAstro(filePathname, _site, projectRootStr) {
  const site = _site ? new URL(_site) : void 0;
  const referenceURL = new URL(filePathname, `http://localhost`);
  const projectRoot = new URL(projectRootStr);
  return {
    site,
    generator: `Astro v${ASTRO_VERSION}`,
    fetchContent: createDeprecatedFetchContentFn(),
    glob: createAstroGlobFn(),
    resolve(...segments) {
      let resolved = segments.reduce((u, segment) => new URL(segment, u), referenceURL).pathname;
      if (resolved.startsWith(projectRoot.pathname)) {
        resolved = "/" + resolved.slice(projectRoot.pathname.length);
      }
      return resolved;
    }
  };
}

const escapeHTML = escape;
class HTMLString extends String {
}
const markHTMLString = (value) => {
  if (value instanceof HTMLString) {
    return value;
  }
  if (typeof value === "string") {
    return new HTMLString(value);
  }
  return value;
};

class Metadata {
  constructor(filePathname, opts) {
    this.modules = opts.modules;
    this.hoisted = opts.hoisted;
    this.hydratedComponents = opts.hydratedComponents;
    this.clientOnlyComponents = opts.clientOnlyComponents;
    this.hydrationDirectives = opts.hydrationDirectives;
    this.mockURL = new URL(filePathname, "http://example.com");
    this.metadataCache = /* @__PURE__ */ new Map();
  }
  resolvePath(specifier) {
    if (specifier.startsWith(".")) {
      const resolved = new URL(specifier, this.mockURL).pathname;
      if (resolved.startsWith("/@fs") && resolved.endsWith(".jsx")) {
        return resolved.slice(0, resolved.length - 4);
      }
      return resolved;
    }
    return specifier;
  }
  getPath(Component) {
    const metadata = this.getComponentMetadata(Component);
    return (metadata == null ? void 0 : metadata.componentUrl) || null;
  }
  getExport(Component) {
    const metadata = this.getComponentMetadata(Component);
    return (metadata == null ? void 0 : metadata.componentExport) || null;
  }
  getComponentMetadata(Component) {
    if (this.metadataCache.has(Component)) {
      return this.metadataCache.get(Component);
    }
    const metadata = this.findComponentMetadata(Component);
    this.metadataCache.set(Component, metadata);
    return metadata;
  }
  findComponentMetadata(Component) {
    const isCustomElement = typeof Component === "string";
    for (const { module, specifier } of this.modules) {
      const id = this.resolvePath(specifier);
      for (const [key, value] of Object.entries(module)) {
        if (isCustomElement) {
          if (key === "tagName" && Component === value) {
            return {
              componentExport: key,
              componentUrl: id
            };
          }
        } else if (Component === value) {
          return {
            componentExport: key,
            componentUrl: id
          };
        }
      }
    }
    return null;
  }
}
function createMetadata(filePathname, options) {
  return new Metadata(filePathname, options);
}

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7
};
function serializeArray(value) {
  return value.map((v) => convertToSerializedForm(v));
}
function serializeObject(value) {
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v)];
    })
  );
}
function convertToSerializedForm(value) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [PROP_TYPE.Map, JSON.stringify(serializeArray(Array.from(value)))];
    }
    case "[object Set]": {
      return [PROP_TYPE.Set, JSON.stringify(serializeArray(Array.from(value)))];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, JSON.stringify(serializeArray(value))];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value)];
      } else {
        return [PROP_TYPE.Value, value];
      }
    }
  }
}
function serializeProps(props) {
  return JSON.stringify(serializeObject(props));
}

function serializeListValue(value) {
  const hash = {};
  push(value);
  return Object.keys(hash).join(" ");
  function push(item) {
    if (item && typeof item.forEach === "function")
      item.forEach(push);
    else if (item === Object(item))
      Object.keys(item).forEach((name) => {
        if (item[name])
          push(name);
      });
    else {
      item = item === false || item == null ? "" : String(item).trim();
      if (item) {
        item.split(/\s+/).forEach((name) => {
          hash[name] = true;
        });
      }
    }
  }
}

const HydrationDirectivesRaw = ["load", "idle", "media", "visible", "only"];
const HydrationDirectives = new Set(HydrationDirectivesRaw);
const HydrationDirectiveProps = new Set(HydrationDirectivesRaw.map((n) => `client:${n}`));
function extractDirectives(inputProps) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!HydrationDirectives.has(extracted.hydration.directive)) {
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${Array.from(
                HydrationDirectiveProps
              ).join(", ")}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new Error(
              'Error: Media query must be provided for "client:media", similar to client:media="(max-width: 600px)"'
            );
          }
          break;
        }
      }
    } else if (key === "class:list") {
      extracted.props[key.slice(0, -5)] = serializeListValue(value);
    } else {
      extracted.props[key] = value;
    }
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new Error(
      `Unable to resolve a valid export for "${metadata.displayName}"! Please open an issue at https://astro.build/issues!`
    );
  }
  const island = {
    children: "",
    props: {
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = value;
    }
  }
  island.props["component-url"] = await result.resolve(componentUrl);
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(renderer.clientEntrypoint);
    island.props["props"] = escapeHTML(serializeProps(props));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  island.props["before-hydration-url"] = await result.resolve("astro:scripts/before-hydration.js");
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  return island;
}

var idle_prebuilt_default = `(self.Astro=self.Astro||{}).idle=a=>{const e=async()=>{await(await a())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)};`;

var load_prebuilt_default = `(self.Astro=self.Astro||{}).load=a=>{(async()=>await(await a())())()};`;

var media_prebuilt_default = `(self.Astro=self.Astro||{}).media=(s,a)=>{const t=async()=>{await(await s())()};if(a.value){const e=matchMedia(a.value);e.matches?t():e.addEventListener("change",t,{once:!0})}};`;

var only_prebuilt_default = `(self.Astro=self.Astro||{}).only=a=>{(async()=>await(await a())())()};`;

var visible_prebuilt_default = `(self.Astro=self.Astro||{}).visible=(i,c,n)=>{const r=async()=>{await(await i())()};let s=new IntersectionObserver(e=>{for(const t of e)if(!!t.isIntersecting){s.disconnect(),r();break}});for(let e=0;e<n.children.length;e++){const t=n.children[e];s.observe(t)}};`;

var astro_island_prebuilt_default = `var a;{const l={0:t=>t,1:t=>JSON.parse(t,n),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(JSON.parse(t,n)),5:t=>new Set(JSON.parse(t,n)),6:t=>BigInt(t),7:t=>new URL(t)},n=(t,r)=>{if(t===""||!Array.isArray(r))return r;const[s,i]=r;return s in l?l[s](i):void 0};customElements.get("astro-island")||customElements.define("astro-island",(a=class extends HTMLElement{constructor(){super(...arguments);this.hydrate=()=>{if(!this.hydrator||this.parentElement?.closest("astro-island[ssr]"))return;const r=this.querySelectorAll("astro-slot"),s={},i=this.querySelectorAll("template[data-astro-template]");for(const e of i)!e.closest(this.tagName)?.isSameNode(this)||(s[e.getAttribute("data-astro-template")||"default"]=e.innerHTML,e.remove());for(const e of r)!e.closest(this.tagName)?.isSameNode(this)||(s[e.getAttribute("name")||"default"]=e.innerHTML);const o=this.hasAttribute("props")?JSON.parse(this.getAttribute("props"),n):{};this.hydrator(this)(this.Component,o,s,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),window.removeEventListener("astro:hydrate",this.hydrate),window.dispatchEvent(new CustomEvent("astro:hydrate"))}}connectedCallback(){!this.hasAttribute("await-children")||this.firstChild?this.childrenConnectedCallback():new MutationObserver((r,s)=>{s.disconnect(),this.childrenConnectedCallback()}).observe(this,{childList:!0})}async childrenConnectedCallback(){window.addEventListener("astro:hydrate",this.hydrate),await import(this.getAttribute("before-hydration-url"));const r=JSON.parse(this.getAttribute("opts"));Astro[this.getAttribute("client")](async()=>{const s=this.getAttribute("renderer-url"),[i,{default:o}]=await Promise.all([import(this.getAttribute("component-url")),s?import(s):()=>()=>{}]),e=this.getAttribute("component-export")||"default";if(!e.includes("."))this.Component=i[e];else{this.Component=i;for(const c of e.split("."))this.Component=this.Component[c]}return this.hydrator=o,this.hydrate},r,this)}attributeChangedCallback(){this.hydrator&&this.hydrate()}},a.observedAttributes=["props"],a))}`;

function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
const hydrationScripts = {
  idle: idle_prebuilt_default,
  load: load_prebuilt_default,
  only: only_prebuilt_default,
  media: media_prebuilt_default,
  visible: visible_prebuilt_default
};
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(directive) {
  if (!(directive in hydrationScripts)) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  const directiveScriptText = hydrationScripts[directive];
  return directiveScriptText;
}
function getPrescripts(type, directive) {
  switch (type) {
    case "both":
      return `<style>astro-island,astro-slot{display:contents}</style><script>${getDirectiveScriptText(directive) + astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(directive)}<\/script>`;
  }
  return "";
}

const Fragment = Symbol.for("astro:fragment");
const Renderer = Symbol.for("astro:renderer");
function stringifyChunk(result, chunk) {
  switch (chunk.type) {
    case "directive": {
      const { hydration } = chunk;
      let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
      let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
      let prescriptType = needsHydrationScript ? "both" : needsDirectiveScript ? "directive" : null;
      if (prescriptType) {
        let prescripts = getPrescripts(prescriptType, hydration.directive);
        return markHTMLString(prescripts);
      } else {
        return "";
      }
    }
    default: {
      return chunk.toString();
    }
  }
}

function validateComponentProps(props, displayName) {
  var _a;
  if (((_a = (Object.assign({"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true},{_:process.env._,}))) == null ? void 0 : _a.DEV) && props != null) {
    for (const prop of Object.keys(props)) {
      if (HydrationDirectiveProps.has(prop)) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
class AstroComponent {
  constructor(htmlParts, expressions) {
    this.htmlParts = htmlParts;
    this.expressions = expressions;
  }
  get [Symbol.toStringTag]() {
    return "AstroComponent";
  }
  async *[Symbol.asyncIterator]() {
    const { htmlParts, expressions } = this;
    for (let i = 0; i < htmlParts.length; i++) {
      const html = htmlParts[i];
      const expression = expressions[i];
      yield markHTMLString(html);
      yield* renderChild(expression);
    }
  }
}
function isAstroComponent(obj) {
  return typeof obj === "object" && Object.prototype.toString.call(obj) === "[object AstroComponent]";
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : !!obj.isAstroComponentFactory;
}
async function* renderAstroComponent(component) {
  for await (const value of component) {
    if (value || value === 0) {
      for await (const chunk of renderChild(value)) {
        switch (chunk.type) {
          case "directive": {
            yield chunk;
            break;
          }
          default: {
            yield markHTMLString(chunk);
            break;
          }
        }
      }
    }
  }
}
async function renderToString(result, componentFactory, props, children) {
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    const response = Component;
    throw response;
  }
  let html = "";
  for await (const chunk of renderAstroComponent(Component)) {
    html += stringifyChunk(result, chunk);
  }
  return html;
}
async function renderToIterable(result, componentFactory, displayName, props, children) {
  validateComponentProps(props, displayName);
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    console.warn(
      `Returning a Response is only supported inside of page components. Consider refactoring this logic into something like a function that can be used in the page.`
    );
    const response = Component;
    throw response;
  }
  return renderAstroComponent(Component);
}
async function renderTemplate(htmlParts, ...expressions) {
  return new AstroComponent(htmlParts, expressions);
}

async function* renderChild(child) {
  child = await child;
  if (child instanceof HTMLString) {
    yield child;
  } else if (Array.isArray(child)) {
    for (const value of child) {
      yield markHTMLString(await renderChild(value));
    }
  } else if (typeof child === "function") {
    yield* renderChild(child());
  } else if (typeof child === "string") {
    yield markHTMLString(escapeHTML(child));
  } else if (!child && child !== 0) ; else if (child instanceof AstroComponent || Object.prototype.toString.call(child) === "[object AstroComponent]") {
    yield* renderAstroComponent(child);
  } else if (typeof child === "object" && Symbol.asyncIterator in child) {
    yield* child;
  } else {
    yield child;
  }
}
async function renderSlot(result, slotted, fallback) {
  if (slotted) {
    let iterator = renderChild(slotted);
    let content = "";
    for await (const chunk of iterator) {
      if (chunk.type === "directive") {
        content += stringifyChunk(result, chunk);
      } else {
        content += chunk;
      }
    }
    return markHTMLString(content);
  }
  return fallback;
}

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0)
    return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}

const voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
const htmlBooleanAttributes = /^(allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i;
const htmlEnumAttributes = /^(contenteditable|draggable|spellcheck|value)$/i;
const svgEnumAttributes = /^(autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i;
const STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
const toIdent = (k) => k.trim().replace(/(?:(?<!^)\b\w|\s+|[^\w]+)/g, (match, index) => {
  if (/[^\w]|\s/.test(match))
    return "";
  return index === 0 ? match : match.toUpperCase();
});
const toAttributeString = (value, shouldEscape = true) => shouldEscape ? String(value).replace(/&/g, "&#38;").replace(/"/g, "&#34;") : value;
const kebab = (k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
const toStyleString = (obj) => Object.entries(obj).map(([k, v]) => `${kebab(k)}:${v}`).join(";");
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `let ${toIdent(key)} = ${JSON.stringify(value)};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function addAttribute(value, key, shouldEscape = true) {
  if (value == null) {
    return "";
  }
  if (value === false) {
    if (htmlEnumAttributes.test(key) || svgEnumAttributes.test(key)) {
      return markHTMLString(` ${key}="false"`);
    }
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(serializeListValue(value));
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString) && typeof value === "object") {
    return markHTMLString(` ${key}="${toStyleString(value)}"`);
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (value === true && (key.startsWith("data-") || htmlBooleanAttributes.test(key))) {
    return markHTMLString(` ${key}`);
  } else {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function renderElement$1(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape)} />`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape)}>${children}</${name}>`;
}

function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlot(result, slots == null ? void 0 : slots.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName)
    return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}

const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
function guessRenderers(componentUrl) {
  const extname = componentUrl == null ? void 0 : componentUrl.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact"];
    default:
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/vue", "@astrojs/svelte"];
  }
}
function getComponentType(Component) {
  if (Component === Fragment) {
    return "fragment";
  }
  if (Component && typeof Component === "object" && Component["astro:html"]) {
    return "html";
  }
  if (isAstroComponentFactory(Component)) {
    return "astro-factory";
  }
  return "unknown";
}
async function renderComponent(result, displayName, Component, _props, slots = {}) {
  var _a;
  Component = await Component;
  switch (getComponentType(Component)) {
    case "fragment": {
      const children2 = await renderSlot(result, slots == null ? void 0 : slots.default);
      if (children2 == null) {
        return children2;
      }
      return markHTMLString(children2);
    }
    case "html": {
      const children2 = {};
      if (slots) {
        await Promise.all(
          Object.entries(slots).map(
            ([key, value]) => renderSlot(result, value).then((output) => {
              children2[key] = output;
            })
          )
        );
      }
      const html2 = Component.render({ slots: children2 });
      return markHTMLString(html2);
    }
    case "astro-factory": {
      async function* renderAstroComponentInline() {
        let iterable = await renderToIterable(result, Component, displayName, _props, slots);
        yield* iterable;
      }
      return renderAstroComponentInline();
    }
  }
  if (!Component && !_props["client:only"]) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers } = result._metadata;
  const metadata = { displayName };
  const { hydration, isPage, props } = extractDirectives(_props);
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  if (Array.isArray(renderers) && renderers.length === 0 && typeof Component !== "string" && !componentIsHTMLElement(Component)) {
    const message = `Unable to render ${metadata.displayName}!

There are no \`integrations\` set in your \`astro.config.mjs\` file.
Did you mean to add ${formatList(probableRendererNames.map((r) => "`" + r + "`"))}?`;
    throw new Error(message);
  }
  const children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlot(result, value).then((output) => {
          children[key] = output;
        })
      )
    );
  }
  let renderer;
  if (metadata.hydrate !== "only") {
    if (Component && Component[Renderer]) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ?? (error = e);
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = renderHTMLElement(result, Component, _props, slots);
      return output;
    }
  } else {
    if (metadata.hydrateArgs) {
      const passedName = metadata.hydrateArgs;
      const rendererName = rendererAliases.has(passedName) ? rendererAliases.get(passedName) : passedName;
      renderer = renderers.find(
        ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
      );
    }
    if (!renderer && renderers.length === 1) {
      renderer = renderers[0];
    }
    if (!renderer) {
      const extname = (_a = metadata.componentUrl) == null ? void 0 : _a.split(".").pop();
      renderer = renderers.filter(
        ({ name }) => name === `@astrojs/${extname}` || name === extname
      )[0];
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      throw new Error(`Unable to render ${metadata.displayName}!

Using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.
Did you mean to pass <${metadata.displayName} client:only="${probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")}" />
`);
    } else if (typeof Component !== "string") {
      const matchingRenderers = renderers.filter((r) => probableRendererNames.includes(r.name));
      const plural = renderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new Error(`Unable to render ${metadata.displayName}!

There ${plural ? "are" : "is"} ${renderers.length} renderer${plural ? "s" : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were" : "it was not"} able to server-side render ${metadata.displayName}.

Did you mean to enable ${formatList(probableRendererNames.map((r) => "`" + r + "`"))}?`);
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          props,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlot(result, slots == null ? void 0 : slots.fallback);
    } else {
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        props,
        children,
        metadata
      ));
    }
  }
  if (renderer && !renderer.clientEntrypoint && renderer.name !== "@astrojs/lit" && metadata.hydrate) {
    throw new Error(
      `${metadata.displayName} component has a \`client:${metadata.hydrate}\` directive, but no client entrypoint was provided by ${renderer.name}!`
    );
  }
  if (!html && typeof Component === "string") {
    const childSlots = Object.values(children).join("");
    const iterable = renderAstroComponent(
      await renderTemplate`<${Component}${internalSpreadAttributes(props)}${markHTMLString(
        childSlots === "" && voidElementNames.test(Component) ? `/>` : `>${childSlots}</${Component}>`
      )}`
    );
    html = "";
    for await (const chunk of iterable) {
      html += chunk;
    }
  }
  if (!hydration) {
    if (isPage || (renderer == null ? void 0 : renderer.name) === "astro:jsx") {
      return html;
    }
    return markHTMLString(html.replace(/\<\/?astro-slot\>/g, ""));
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        if (!html.includes(key === "default" ? `<astro-slot>` : `<astro-slot name="${key}">`)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
  }
  async function* renderAll() {
    yield { type: "directive", hydration, result };
    yield markHTMLString(renderElement$1("astro-island", island, false));
  }
  return renderAll();
}

const uniqueElements = (item, index, all) => {
  const props = JSON.stringify(item.props);
  const children = item.children;
  return index === all.findIndex((i) => JSON.stringify(i.props) === props && i.children == children);
};
const alreadyHeadRenderedResults = /* @__PURE__ */ new WeakSet();
function renderHead(result) {
  alreadyHeadRenderedResults.add(result);
  const styles = Array.from(result.styles).filter(uniqueElements).map((style) => renderElement$1("style", style));
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script, i) => {
    return renderElement$1("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement$1("link", link, false));
  return markHTMLString(links.join("\n") + styles.join("\n") + scripts.join("\n"));
}
async function* maybeRenderHead(result) {
  if (alreadyHeadRenderedResults.has(result)) {
    return;
  }
  yield renderHead(result);
}

typeof process === "object" && Object.prototype.toString.call(process) === "[object process]";

new TextEncoder();

function createComponent(cb) {
  cb.isAstroComponentFactory = true;
  return cb;
}
function spreadAttributes(values, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true);
  }
  return markHTMLString(output);
}

const AstroJSX = "astro:jsx";
const Empty = Symbol("empty");
const toSlotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function transformSlots(vnode) {
  if (typeof vnode.type === "string")
    return vnode;
  const slots = {};
  if (isVNode(vnode.props.children)) {
    const child = vnode.props.children;
    if (!isVNode(child))
      return;
    if (!("slot" in child.props))
      return;
    const name = toSlotName(child.props.slot);
    slots[name] = [child];
    slots[name]["$$slot"] = true;
    delete child.props.slot;
    delete vnode.props.children;
  }
  if (Array.isArray(vnode.props.children)) {
    vnode.props.children = vnode.props.children.map((child) => {
      if (!isVNode(child))
        return child;
      if (!("slot" in child.props))
        return child;
      const name = toSlotName(child.props.slot);
      if (Array.isArray(slots[name])) {
        slots[name].push(child);
      } else {
        slots[name] = [child];
        slots[name]["$$slot"] = true;
      }
      delete child.props.slot;
      return Empty;
    }).filter((v) => v !== Empty);
  }
  Object.assign(vnode.props, slots);
}
function markRawChildren(child) {
  if (typeof child === "string")
    return markHTMLString(child);
  if (Array.isArray(child))
    return child.map((c) => markRawChildren(c));
  return child;
}
function transformSetDirectives(vnode) {
  if (!("set:html" in vnode.props || "set:text" in vnode.props))
    return;
  if ("set:html" in vnode.props) {
    const children = markRawChildren(vnode.props["set:html"]);
    delete vnode.props["set:html"];
    Object.assign(vnode.props, { children });
    return;
  }
  if ("set:text" in vnode.props) {
    const children = vnode.props["set:text"];
    delete vnode.props["set:text"];
    Object.assign(vnode.props, { children });
    return;
  }
}
function createVNode(type, props) {
  const vnode = {
    [AstroJSX]: true,
    type,
    props: props ?? {}
  };
  transformSetDirectives(vnode);
  transformSlots(vnode);
  return vnode;
}

const ClientOnlyPlaceholder = "astro-client-only";
const skipAstroJSXCheck = /* @__PURE__ */ new WeakSet();
let originalConsoleError;
let consoleFilterRefs = 0;
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode):
      return markHTMLString(
        (await Promise.all(vnode.map((v) => renderJSX(result, v)))).join("")
      );
  }
  if (isVNode(vnode)) {
    switch (true) {
      case vnode.type === Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case vnode.type.isAstroComponentFactory: {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        return markHTMLString(await renderToString(result, vnode.type, props, slots));
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.type["astro:renderer"]) {
        skipAstroJSXCheck.add(vnode.type);
      }
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function" && !skipAstroJSXCheck.has(vnode.type)) {
        useConsoleFilter();
        try {
          const output2 = await vnode.type(vnode.props ?? {});
          if (output2 && output2[AstroJSX]) {
            return await renderJSX(result, output2);
          } else if (!output2) {
            return await renderJSX(result, output2);
          }
        } catch (e) {
          skipAstroJSXCheck.add(vnode.type);
        } finally {
          finishUsingConsoleFilter();
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0)
              return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponent(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponent(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      if (typeof output !== "string" && Symbol.asyncIterator in output) {
        let body = "";
        for await (const chunk of output) {
          let html = stringifyChunk(result, chunk);
          body += html;
        }
        return markHTMLString(body);
      } else {
        return markHTMLString(output);
      }
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, children)}</${tag}>`
    )}`
  );
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch (error) {
    }
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && typeof msg === "string") {
    const isKnownReactHookError = msg.includes("Warning: Invalid hook call.") && msg.includes("https://reactjs.org/link/invalid-hook-call");
    if (isKnownReactHookError)
      return;
  }
}

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
async function check(Component, props, { default: children = null, ...slotted } = {}) {
  if (typeof Component !== "function")
    return false;
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  try {
    const result = await Component({ ...props, ...slots, children });
    return result[AstroJSX];
  } catch (e) {
  }
  return false;
}
async function renderToStaticMarkup(Component, props = {}, { default: children = null, ...slotted } = {}) {
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  const { result } = this;
  const html = await renderJSX(result, createVNode(Component, { ...props, ...slots, children }));
  return { html };
}
var server_default = {
  check,
  renderToStaticMarkup
};

const $$metadata$4 = createMetadata("/@fs/Users/t0nylombardi/dev/t0nylombardi/astroBlog/src/layouts/BaseLayout.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$5 = createAstro("/@fs/Users/t0nylombardi/dev/t0nylombardi/astroBlog/src/layouts/BaseLayout.astro", "", "file:///Users/t0nylombardi/dev/t0nylombardi/astroBlog/");
const $$BaseLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width">
		<link rel="icon" type="image/x-icon" href="/favicon.ico">
		<meta name="generator"${addAttribute(Astro2.generator, "content")}>
		<title>${title}</title>
	${renderHead($$result)}</head>
	<body>
		${renderSlot($$result, $$slots["default"])}
	</body></html>`;
});

const $$file$4 = "/Users/t0nylombardi/dev/t0nylombardi/astroBlog/src/layouts/BaseLayout.astro";
const $$url$4 = undefined;

const $$module1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$4,
	default: $$BaseLayout,
	file: $$file$4,
	url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$3 = createMetadata("/@fs/Users/t0nylombardi/dev/t0nylombardi/astroBlog/src/components/Card.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$4 = createAstro("/@fs/Users/t0nylombardi/dev/t0nylombardi/astroBlog/src/components/Card.astro", "", "file:///Users/t0nylombardi/dev/t0nylombardi/astroBlog/");
const $$Card = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Card;
  const { href, title, body } = Astro2.props;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<li class="link-card astro-6IXEBBIR">
	<a${addAttribute(href, "href")} class="astro-6IXEBBIR">
		<h2 class="astro-6IXEBBIR">
			${title}
			<span class="astro-6IXEBBIR">&rarr;</span>
		</h2>
		<p class="astro-6IXEBBIR">
			${body}
		</p>
	</a>
</li>
`;
});

const $$file$3 = "/Users/t0nylombardi/dev/t0nylombardi/astroBlog/src/components/Card.astro";
const $$url$3 = undefined;

const $$module2$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$3,
	default: $$Card,
	file: $$file$3,
	url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$2 = createMetadata("/@fs/Users/t0nylombardi/dev/t0nylombardi/astroBlog/src/pages/index.astro", { modules: [{ module: $$module1, specifier: "../layouts/BaseLayout.astro", assert: {} }, { module: $$module2$1, specifier: "../components/Card.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$3 = createAstro("/@fs/Users/t0nylombardi/dev/t0nylombardi/astroBlog/src/pages/index.astro", "", "file:///Users/t0nylombardi/dev/t0nylombardi/astroBlog/");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${maybeRenderHead($$result)}<section class="relative bg-white">
	<img class="absolute inset-0 object-[75%] sm:object-[25%] object-cover w-full h-full opacity-25 sm:opacity-100" src="https://images.unsplash.com/photo-1453950357290-38ae7a99541f" alt="Couple on a bed with a dog">

	<div class="hidden sm:block sm:inset-0 sm:absolute sm:bg-gradient-to-r sm:from-white sm:to-transparent">
	</div>

	<div class="relative max-w-screen-xl px-4 py-32 mx-auto lg:h-screen lg:items-center lg:flex">
		<div class="max-w-x2l text-center sm:text-left">
			<h1 class="text-6xl font-extrabold sm:text-6xl">
				Anthony Lombardi
			</h1>
			<h2>
				<strong class="text-2xl sm:text-2xl font-bold text-rose-700 sm:block">
					Father &#8226; Consultant &#8226; Mentor &#8226; FullStack
					Engineer
				</strong>
			</h2>

			<p class="max-w-lg mt-4 sm:leading-relaxed sm:text-xl"></p>

			<div class="flex flex-wrap gap-4 mt-8 text-center">
				<a class="block w-full px-12 py-3 text-sm font-medium text-white rounded shadow bg-rose-600 sm:w-auto active:bg-rose-500 hover:bg-rose-700 focus:outline-none focus:ring" href="/blog">
					BLOG
				</a>

				<a class="block w-full px-12 py-3 text-sm font-medium bg-white rounded shadow text-rose-600 sm:w-auto hover:text-rose-700 active:text-rose-500 focus:outline-none focus:ring" href="/resume">
					RESUME
				</a>
			</div>
		</div>
	</div>
</section>`;
});

const $$file$2 = "/Users/t0nylombardi/dev/t0nylombardi/astroBlog/src/pages/index.astro";
const $$url$2 = "";

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$2,
	default: $$Index,
	file: $$file$2,
	url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const skillsWeb = [[95, "Ruby"], [95, "Ruby on Rails"], [90, "React"], [85, "Javascript"], [80, "Typescript"], [70, "SQL"], [50, "NodeJS"], [95, "Html/Css"], [30, "Go"], [30, "Python"]];
const SkillProgress = ({
  percent,
  skillname
}) => {
  const [isInView, setIsInView] = useState(false);
  const onVisibilityChange = (isInView2) => setIsInView(isInView2);
  const progressSpringStyleProps = useSpring({
    width: isInView ? `${percent}%` : `${percent}%`,
    config: config.molasses
  });
  return /* @__PURE__ */ jsx(VisibilitySensor, {
    onChange: onVisibilityChange,
    children: /* @__PURE__ */ jsx("div", {
      children: /* @__PURE__ */ jsxs("div", {
        className: "relative pt-1",
        children: [/* @__PURE__ */ jsx("div", {
          children: skillname
        }), /* @__PURE__ */ jsx("div", {
          className: "progressbar",
          children: /* @__PURE__ */ jsx(animated.div, {
            className: "progressbarprg",
            style: progressSpringStyleProps
          })
        }), /* @__PURE__ */ jsx("style", {
          children: `
            .progressbar {
              width: 100%;
              height: 12px;
              background-color: #f5f5f5;
              border-radius: 10px;
              margin: 10px 0;
            }
            .progressbarprg {
              height: 100%;
              color: white;
              line-height: 18px;
              text-align: center;
              width: 0%;
              border-radius: 10px;
              background-color: #b9301c;
            }
          `
        })]
      })
    })
  });
};
const SkillList = () => {
  return /* @__PURE__ */ jsx("div", {
    children: skillsWeb.map((name, index) => {
      {
        console.log(name[0]);
      }
      return /* @__PURE__ */ jsx(SkillProgress, {
        percent: name[0],
        skillname: name[1]
      }, index);
    })
  });
};

const $$module2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: SkillList
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$1 = createMetadata("/@fs/Users/t0nylombardi/dev/t0nylombardi/astroBlog/src/pages/resume.astro", { modules: [{ module: $$module1, specifier: "../layouts/BaseLayout.astro", assert: {} }, { module: $$module2, specifier: "../components/skills/skills.jsx", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$2 = createAstro("/@fs/Users/t0nylombardi/dev/t0nylombardi/astroBlog/src/pages/resume.astro", "", "file:///Users/t0nylombardi/dev/t0nylombardi/astroBlog/");
const $$Resume = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Resume;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`

${maybeRenderHead($$result)}<div class="md:container md:mx-auto astro-D33RRYWJ">
    <div class="resume astro-D33RRYWJ">
        <div class="resume-header astro-D33RRYWJ">
            <h1 class=" astro-D33RRYWJ">ANTHONY LOMBARDI</h1>
            <h3 class="text-2xl text-blog-red astro-D33RRYWJ">
                Father &#8226; Consultant &#8226; Mentor &#8226; FullStack
                Engineer
            </h3>
        </div>
        <div class="resume-body-wrapper border-t-2 border-gray-c7 astro-D33RRYWJ">
            <div class="flex flex-row astro-D33RRYWJ">
                <div class="flex-initial skills-hobbies border-r-2 border-gray-c7 astro-D33RRYWJ">
                    <div class="skills astro-D33RRYWJ">
                        <h1 class="astro-D33RRYWJ">SKILLS</h1>
                        <hr class="astro-D33RRYWJ">
                        <div class="py-4 astro-D33RRYWJ">
                            ${renderComponent($$result, "SkillList", SkillList, { "class": "astro-D33RRYWJ" })}
                        </div>
                    </div>

                    <div class="hobbies astro-D33RRYWJ">
                        <h1 class="astro-D33RRYWJ">HOBBIES</h1>
                        <hr class="astro-D33RRYWJ">
                        <p class="astro-D33RRYWJ">
                            Building guitars && Woodworking , Playing Guitar,
                            Cooking, Spending Time with my two Children, and
                            Exploring the Outdoors.
                        </p>
                    </div>
                </div>
                <div class="flex-auto w-full resume-main astro-D33RRYWJ">
                    <div class="profile astro-D33RRYWJ">
                        <h1 class="astro-D33RRYWJ">PROFILE</h1>
                        <hr class="astro-D33RRYWJ">
                        <p class="border-b-2 border-gray-c7 astro-D33RRYWJ">
                            Meticulous & motivated Full Stack Developer with 10+
                            years of hands-on experience in: IT, Ruby on Rails,
                            E-Commerce, Project Management, Development, and
                            Consulting through the Full Software Life Cycle.
                        </p>
                    </div>
                    <div class="employment-history border-b-2 border-gray-c7 astro-D33RRYWJ">
                        <h1 class="astro-D33RRYWJ">EMPLOYMENT HISTORY</h1>
                        <hr class="astro-D33RRYWJ">
                        
                        <div class="employment mb-4 astro-D33RRYWJ">
                            <div class="grid grid-cols-4 astro-D33RRYWJ">
                                <div class="col-span-3 text-left font-bold text-blog-red astro-D33RRYWJ">
                                    Senior Software Engineer, Avail/Realtor.com
                                </div>
                                <div class="text-right astro-D33RRYWJ">New York City</div>
                            </div>
                            <p class="employment-date astro-D33RRYWJ">
                                June 2021 &hyphen; August 2022
                            </p>
                            <div class="highlights astro-D33RRYWJ">
                                <ul class="list-inside list-disc astro-D33RRYWJ">
                                    <li class="astro-D33RRYWJ">
                                        Built applications using Ruby on Rails
                                        for the backend and React on the
                                        frontend.
                                    </li>

                                    <li class="astro-D33RRYWJ">
                                        Designed and implemented planning and
                                        execution of taking a momolyth to
                                        microservices.
                                    </li>

                                    <li class="astro-D33RRYWJ">
                                        Implemented microservices for listing
                                        currated data in listing apartments.
                                    </li>

                                    <li class="astro-D33RRYWJ">Deployed better Logging for apis</li>

                                    <li class="astro-D33RRYWJ">
                                        Facilitated root cause analysis of
                                        common system issues to meet customer
                                        needs.
                                    </li>

                                    <li class="astro-D33RRYWJ">
                                        Monitored systems for defects and
                                        employed bug resolution
                                    </li>

                                    <li class="astro-D33RRYWJ">
                                        Built and Facilitated code quality
                                        checks by using CI/CD to analyze PRs.
                                    </li>

                                    <li class="astro-D33RRYWJ">
                                        Mentored teammates with code issues.
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="employment mb-4 astro-D33RRYWJ">
                            <div class="grid grid-cols-4 astro-D33RRYWJ">
                                <div class="col-span-3 text-left font-bold text-blog-red astro-D33RRYWJ">
                                    Software Engineer, LendKey Technologies
                                </div>
                                <div class="text-right astro-D33RRYWJ">New York City</div>
                            </div>
                            <p class="employment-date astro-D33RRYWJ">
                                Oct 2017 &hyphen; Jun 2020
                            </p>
                            <div class="highlights astro-D33RRYWJ">
                                <ul class="list-inside list-disc astro-D33RRYWJ">
                                    <li class="astro-D33RRYWJ">
                                        Built and maintained APIs, moving away
                                        from Legacy Monolith infrastructure to a
                                        more domain-driven micro service through
                                        Docker Ruby on Rails, Java Spring-Boot
                                        and ReactJS
                                    </li>
                                    <li class="astro-D33RRYWJ">
                                        Worked with ReactJS and TypeScript to
                                        build a front end
                                    </li>
                                    <li class="astro-D33RRYWJ">
                                        Used higher order of components to make
                                        small, reusable sections${" "}
                                    </li>
                                    <li class="astro-D33RRYWJ">
                                        Built login feature using MS Azure, JWT,
                                        and Apigee
                                    </li>
                                    <li class="astro-D33RRYWJ">
                                        Utilized crucial design software skills
                                        to complete projects
                                    </li>
                                    <li class="astro-D33RRYWJ">
                                        Effectively coded software changes and
                                        alterations based on speciqc design
                                        re’uirements
                                    </li>
                                    <li class="astro-D33RRYWJ">
                                        Applied & stayed current with existing
                                        and emerging technologies${" "}
                                    </li>
                                    <li class="astro-D33RRYWJ">
                                        Brought forth a passion and dedication
                                        to software development
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="employment mb-4 astro-D33RRYWJ">
                            <div class="grid grid-cols-4 astro-D33RRYWJ">
                                <div class="col-span-3 text-left font-bold text-blog-red astro-D33RRYWJ">
                                    Full-Stack Developer, TMPG
                                </div>
                                <div class="text-right astro-D33RRYWJ">White Plains, NY</div>
                            </div>
                            <p class="employment-date astro-D33RRYWJ">
                                Aug 2015 &hyphen; Oct 2017
                            </p>
                            <div class="highlights astro-D33RRYWJ">
                                <ul class="list-inside list-disc astro-D33RRYWJ">
                                    <li class="astro-D33RRYWJ">
                                        Managed a development team building
                                        rich, interactive websites
                                    </li>
                                    <li class="astro-D33RRYWJ">
                                        Built and maintained new infrastructures
                                        while merging our legacy infrastructure
                                        over
                                    </li>
                                    <li class="astro-D33RRYWJ">
                                        Brought forth extensive experience
                                        developing APIs to connect and curate
                                        new and existing data through multiple
                                        platforms
                                    </li>
                                    <li class="astro-D33RRYWJ">
                                        Implemented procedural changes in server
                                        infrastructures
                                    </li>
                                    <li class="astro-D33RRYWJ">
                                        Created new internal portal for managing
                                        client data and assets
                                    </li>
                                    <li class="astro-D33RRYWJ">
                                        Successfully worked to meet tight client
                                        deadlines
                                    </li>
                                    <li class="astro-D33RRYWJ">
                                        Worked well with internal and external
                                        teams
                                    </li>
                                </ul>
                            </div>
                        </div>

                        
                        <div class="employment mb-4 astro-D33RRYWJ">
                            <div class="grid grid-cols-4 astro-D33RRYWJ">
                                <div class="col-span-3 text-left font-bold text-blog-red astro-D33RRYWJ">
                                    Full-Stack Developer, Ferguson Enterprise
                                </div>
                                <div class="text-right astro-D33RRYWJ">Goshen, NY</div>
                            </div>
                            <p class="employment-date astro-D33RRYWJ">
                                Apr 2013 &hyphen; Jul 2015
                            </p>
                            <div class="highlights astro-D33RRYWJ">
                                <ul class="list-inside list-disc astro-D33RRYWJ">
                                    <li class="astro-D33RRYWJ">
                                        Transformed a large e&hyphen;commerce
                                        website with new Ruby on Rails
                                        back&hyphen;end technology
                                    </li>
                                    <li class="astro-D33RRYWJ">
                                        Maintained store locations, websites and
                                        back-end databases
                                    </li>
                                    <li class="astro-D33RRYWJ">
                                        Developed a user&hyphen;friendly SMS
                                        solution for customer service
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                    </div>
                    <div class="education pt-5 astro-D33RRYWJ">
                        <h1 class="astro-D33RRYWJ">EDUCATION</h1>
                        <hr class="astro-D33RRYWJ">
                        <div class="grid grid-cols-4 astro-D33RRYWJ">
                            <div class="col-span-3 text-left font-bold text-gray-dark astro-D33RRYWJ">
                                CSM, College of Westchester
                            </div>
                            <div class="text-right astro-D33RRYWJ">White Plains, NY</div>
                        </div>
                        <p class="employment-date astro-D33RRYWJ">
                            Sep 2004 &hyphen; May 2006
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
});

const $$file$1 = "/Users/t0nylombardi/dev/t0nylombardi/astroBlog/src/pages/resume.astro";
const $$url$1 = "/resume";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$1,
	default: $$Resume,
	file: $$file$1,
	url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

createMetadata("/@fs/Users/t0nylombardi/dev/t0nylombardi/astroBlog/src/layouts/BlogLayout.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$1 = createAstro("/@fs/Users/t0nylombardi/dev/t0nylombardi/astroBlog/src/layouts/BlogLayout.astro", "", "file:///Users/t0nylombardi/dev/t0nylombardi/astroBlog/");
const $$BlogLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$BlogLayout;
  const { title } = Astro2.props;
  const { frontmatter } = Astro2.props;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width">
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<meta name="generator"${addAttribute(Astro2.generator, "content")}>
<title>${title}</title>

${maybeRenderHead($$result)}<body class="astro-4G4LDYUU">
	<div class="container px-5 py-8 mx-auto astro-4G4LDYUU">
		<div class="flex flex-col text-center w-full mt-10 astro-4G4LDYUU">
			<h1 class="sm:text-6xl text-2xl font-medium title-font text-gray-900 astro-4G4LDYUU">
				${frontmatter.title}
			</h1>
			<h2 class="text-indigo-500 tracking-widest font-medium title-font mb-1 astro-4G4LDYUU">
				by: ${frontmatter.author}
			</h2>
		</div>
	</div>
	<article class="md:container md:mx-auto mt-8 mb-8 astro-4G4LDYUU">
		${renderSlot($$result, $$slots["default"])}
	</article>
</body>`;
});

const html$5 = "<p>If you are sending out content to your customers, it pretty handy to know if the content is loading. I speak if you are sending out emails, newsletters, ads, etc. If you have ever sent out an email newsletter from a service like Mailchimp, you would have seen email open graphs. Of course, tracking this stuff is super important for a campaign, but it would also be interesting to see if users are seeing your content.</p>\n<p>The simplest way to do this is via a tracking pixel – a small, invisible image that is loaded from your server every time your medium is opened. This is fairly simple to achieve using Rails by building a simple Rack application.</p>\n<h2 id=\"the-idea\">The idea</h2>\n<p>Picture you are creating ads for clients and you are sending them out to ad shops. If you are using a program like Google Doubleclick. Google DoubleClick allows you to track your ad through a pixel tracking url. This data can be gathered to figure out trends when those ads, emails, or newletters are being opened.</p>\n<h2 id=\"the-setup\">The Setup</h2>\n<p>We’ll add one model: One to tracking pixels:</p>\n<p><code>rails g model Pixel ip_address, campaign, content_type, created_at:date ,city, state, user_agent, referral, banner_size</code></p>\n<p>All of these fields are strings except for created_at so by default they are created as strings.</p>\n<p>the general idea we have here is to get attach a url into an email or something to see if its being loaded such as:</p>\n<p><code>yourUrl.com/assets/tracker.gif?campaign=SomeCampaign&#x26;banner_size=300x250&#x26;content_type=Email</code></p>\n<h2 id=\"right-now-the-magic-bit\">Right, now the magic bit:</h2>\n<p>Create a directory called /lib/tracker and create a new file called rack.rb</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #8B949E\"># app/lib/tracker/rack.rb</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">module</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FFA657\">Tracker</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">class</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FFA657\">Rack</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">def</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">initialize</span><span style=\"color: #C9D1D9\">(app)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      @app </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> app</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">def</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">call</span><span style=\"color: #C9D1D9\">(env)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      @req </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> ::</span><span style=\"color: #79C0FF\">Rack</span><span style=\"color: #C9D1D9\">::</span><span style=\"color: #79C0FF\">Request</span><span style=\"color: #C9D1D9\">.</span><span style=\"color: #FF7B72\">new</span><span style=\"color: #C9D1D9\">(env)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> @req.path_info </span><span style=\"color: #FF7B72\">=~</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">/tracker.gif/</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        result </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">Services</span><span style=\"color: #C9D1D9\">::</span><span style=\"color: #79C0FF\">Params</span><span style=\"color: #C9D1D9\">.deploy @req.query_string</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        location </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">Services</span><span style=\"color: #C9D1D9\">::</span><span style=\"color: #79C0FF\">Locations</span><span style=\"color: #C9D1D9\">.lookup(@req.ip)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        ip_address </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> location[</span><span style=\"color: #A5D6FF\">\"ip\"</span><span style=\"color: #C9D1D9\">] </span><span style=\"color: #FF7B72\">||</span><span style=\"color: #C9D1D9\"> @req.ip</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        params </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">          </span><span style=\"color: #79C0FF\">ip_address:</span><span style=\"color: #C9D1D9\">     ip_address,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">          </span><span style=\"color: #79C0FF\">campaign:</span><span style=\"color: #C9D1D9\">       result[</span><span style=\"color: #79C0FF\">:campaign</span><span style=\"color: #C9D1D9\">],</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">          </span><span style=\"color: #79C0FF\">banner_size:</span><span style=\"color: #C9D1D9\">    result[</span><span style=\"color: #79C0FF\">:banner_size</span><span style=\"color: #C9D1D9\">],</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">          </span><span style=\"color: #79C0FF\">content_type:</span><span style=\"color: #C9D1D9\">   result[</span><span style=\"color: #79C0FF\">:content_type</span><span style=\"color: #C9D1D9\">],</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">          </span><span style=\"color: #79C0FF\">city:</span><span style=\"color: #C9D1D9\">           location[</span><span style=\"color: #A5D6FF\">\"city\"</span><span style=\"color: #C9D1D9\">],</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">          </span><span style=\"color: #79C0FF\">state:</span><span style=\"color: #C9D1D9\">          location[</span><span style=\"color: #A5D6FF\">\"region_name\"</span><span style=\"color: #C9D1D9\">],</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">          </span><span style=\"color: #79C0FF\">user_agent:</span><span style=\"color: #C9D1D9\">     @req.user_agent,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">          </span><span style=\"color: #79C0FF\">referral:</span><span style=\"color: #C9D1D9\">       @req.referer</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        }</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        </span><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> @pixels </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">Pixel</span><span style=\"color: #C9D1D9\">.create!(params)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">          [</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">            </span><span style=\"color: #79C0FF\">200</span><span style=\"color: #C9D1D9\">, { </span><span style=\"color: #A5D6FF\">'Content-Type'</span><span style=\"color: #C9D1D9\"> => </span><span style=\"color: #A5D6FF\">'image/gif'</span><span style=\"color: #C9D1D9\"> },</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">            [</span><span style=\"color: #79C0FF\">File</span><span style=\"color: #C9D1D9\">.read(</span><span style=\"color: #79C0FF\">File</span><span style=\"color: #C9D1D9\">.join(</span><span style=\"color: #79C0FF\">File</span><span style=\"color: #C9D1D9\">.dirname(</span><span style=\"color: #79C0FF\">__FILE__</span><span style=\"color: #C9D1D9\">), </span><span style=\"color: #A5D6FF\">'tracker.gif'</span><span style=\"color: #C9D1D9\">))]</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">          ]</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        </span><span style=\"color: #FF7B72\">else</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">          </span><span style=\"color: #79C0FF\">Rails</span><span style=\"color: #C9D1D9\">.logger.</span><span style=\"color: #79C0FF\">warn</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #79C0FF\">\\n\\n</span><span style=\"color: #A5D6FF\"> Failed to create record on:</span><span style=\"color: #A5D6FF\">#{</span><span style=\"color: #79C0FF\">Date</span><span style=\"color: #C9D1D9\">.today</span><span style=\"color: #A5D6FF\">}</span><span style=\"color: #A5D6FF\">\"</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #FF7B72\">else</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        @app.call(env)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">end</span></span></code></pre>\n<p>Within the method call, several things happen. First is that it will listen to the incomming request for the pixel which we will get into that later. Second we will call on the module Services. The services module does nost if tge heavy lifting for us. In the in lib/servies/ folder will be two files.</p>\n<p>What we need to essentially do is to get the url params, brake them up and return a hash of values that can be entered into the database.</p>\n<h5 id=\"params\">Params:</h5>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #8B949E\"># lib/services/params.rb</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">module</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FFA657\">Services</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">class</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FFA657\">Params</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">require</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">'active_support/all'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">def</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">self.deploy</span><span style=\"color: #C9D1D9\">(obj)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      @url_obj </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> obj</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> obj.class </span><span style=\"color: #FF7B72\">==</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">ActionController</span><span style=\"color: #C9D1D9\">::</span><span style=\"color: #79C0FF\">Parameters</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        return_new_hash @url_obj</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #FF7B72\">else</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        check_for_decode</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">def</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">self.check_for_decode</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> is_base_64 @url_obj</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        str </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> decode(@url_obj)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        return_params(str)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #FF7B72\">else</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        return_params @url_obj</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">def</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">self.return_new_hash</span><span style=\"color: #C9D1D9\">(hash)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      hash[</span><span style=\"color: #79C0FF\">:campaign</span><span style=\"color: #C9D1D9\">] </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> hash.delete(</span><span style=\"color: #79C0FF\">:track</span><span style=\"color: #C9D1D9\">)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      campaign </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> hash[</span><span style=\"color: #79C0FF\">:campaign</span><span style=\"color: #C9D1D9\">].split(</span><span style=\"color: #A5D6FF\">/=/</span><span style=\"color: #C9D1D9\">)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      hash[</span><span style=\"color: #79C0FF\">:campaign</span><span style=\"color: #C9D1D9\">] </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> campaign[</span><span style=\"color: #79C0FF\">1</span><span style=\"color: #C9D1D9\">]</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      hash</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">def</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">self.return_params</span><span style=\"color: #C9D1D9\">(str)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      arry  </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> str.split(</span><span style=\"color: #A5D6FF\">/&#x26;/</span><span style=\"color: #C9D1D9\">)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      hash </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> {}</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> arry.length </span><span style=\"color: #FF7B72\">&#x3C;=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">1</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        </span><span style=\"color: #FF7B72\">raise</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">ActionController</span><span style=\"color: #C9D1D9\">::</span><span style=\"color: #79C0FF\">RoutingError</span><span style=\"color: #C9D1D9\">.</span><span style=\"color: #FF7B72\">new</span><span style=\"color: #C9D1D9\">(</span><span style=\"color: #A5D6FF\">'Not Found'</span><span style=\"color: #C9D1D9\">)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #FF7B72\">else</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        arry.each{|a| hash[a.scan(</span><span style=\"color: #A5D6FF\">/^</span><span style=\"color: #7EE787; font-weight: bold\">\\w</span><span style=\"color: #A5D6FF\">*/</span><span style=\"color: #C9D1D9\">).join(</span><span style=\"color: #A5D6FF\">''</span><span style=\"color: #C9D1D9\">).to_sym] </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> a.</span><span style=\"color: #79C0FF\">gsub</span><span style=\"color: #C9D1D9\">(</span><span style=\"color: #A5D6FF\">/^(</span><span style=\"color: #7EE787; font-weight: bold\">\\w</span><span style=\"color: #A5D6FF\">*=)/</span><span style=\"color: #C9D1D9\">,</span><span style=\"color: #A5D6FF\">''</span><span style=\"color: #C9D1D9\">)}</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      hash</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">def</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">self.decode</span><span style=\"color: #C9D1D9\">(str)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      str </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">Base64</span><span style=\"color: #C9D1D9\">.urlsafe_decode64(str)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">def</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">self.is_base_64</span><span style=\"color: #C9D1D9\">(str)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      str </span><span style=\"color: #FF7B72\">=~</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">/^(</span><span style=\"color: #79C0FF\">[A-Za-z0-9+</span><span style=\"color: #7EE787; font-weight: bold\">\\/</span><span style=\"color: #79C0FF\">]</span><span style=\"color: #FF7B72\">{4}</span><span style=\"color: #A5D6FF\">)*(</span><span style=\"color: #79C0FF\">[A-Za-z0-9+</span><span style=\"color: #7EE787; font-weight: bold\">\\/</span><span style=\"color: #79C0FF\">]</span><span style=\"color: #FF7B72\">{4}</span><span style=\"color: #A5D6FF\">|</span><span style=\"color: #79C0FF\">[A-Za-z0-9+</span><span style=\"color: #7EE787; font-weight: bold\">\\/</span><span style=\"color: #79C0FF\">]</span><span style=\"color: #FF7B72\">{3}</span><span style=\"color: #A5D6FF\">=|</span><span style=\"color: #79C0FF\">[A-Za-z0-9+</span><span style=\"color: #7EE787; font-weight: bold\">\\/</span><span style=\"color: #79C0FF\">]</span><span style=\"color: #FF7B72\">{2}</span><span style=\"color: #A5D6FF\">==)$/</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">end</span></span></code></pre>\n<p>this class also works for encoding whole params into a single 64base string(don’t ask why. it was a good idea at the time)</p>\n<p>The other part of the module handles location. This calls from a ip location service <a href=\"http://freegeoip.net\">http://freegeoip.net</a>.</p>\n<h5 id=\"locations\">Locations:</h5>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #8B949E\"># lib/services/locations.rb</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">module</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FFA657\">Services</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">class</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FFA657\">Locations</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">require</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">'net/http'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">def</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">self.lookup</span><span style=\"color: #C9D1D9\">(ip)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      ip_address </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> ip</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #FF7B72\">unless</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">Rails</span><span style=\"color: #C9D1D9\">.env.production?</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        ip_address </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> random_ip_address</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      url </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">\"http://freegeoip.net/json/</span><span style=\"color: #A5D6FF\">#{</span><span style=\"color: #C9D1D9\">ip_address</span><span style=\"color: #A5D6FF\">}</span><span style=\"color: #A5D6FF\">\"</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #FF7B72\">begin</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        </span><span style=\"color: #79C0FF\">HTTParty</span><span style=\"color: #C9D1D9\">.get(url, </span><span style=\"color: #79C0FF\">timeout:</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">2</span><span style=\"color: #C9D1D9\">)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #FF7B72\">rescue</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">Timeout</span><span style=\"color: #C9D1D9\">::</span><span style=\"color: #79C0FF\">Error</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        </span><span style=\"color: #79C0FF\">Rails</span><span style=\"color: #C9D1D9\">.logger.</span><span style=\"color: #79C0FF\">warn</span><span style=\"color: #C9D1D9\">(</span><span style=\"color: #A5D6FF\">\"Could not post to </span><span style=\"color: #A5D6FF\">#{</span><span style=\"color: #C9D1D9\">url</span><span style=\"color: #A5D6FF\">}</span><span style=\"color: #A5D6FF\">: timeout\"</span><span style=\"color: #C9D1D9\">)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        {</span><span style=\"color: #79C0FF\">city:</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">nil</span><span style=\"color: #C9D1D9\">, </span><span style=\"color: #79C0FF\">region_name:</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">nil</span><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #FF7B72\">rescue</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        </span><span style=\"color: #79C0FF\">Rails</span><span style=\"color: #C9D1D9\">.logger.</span><span style=\"color: #79C0FF\">warn</span><span style=\"color: #C9D1D9\">(</span><span style=\"color: #A5D6FF\">\"Could not post to </span><span style=\"color: #A5D6FF\">#{</span><span style=\"color: #C9D1D9\">url</span><span style=\"color: #A5D6FF\">}</span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #C9D1D9\">)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        {</span><span style=\"color: #79C0FF\">city:</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">nil</span><span style=\"color: #C9D1D9\">, </span><span style=\"color: #79C0FF\">region_name:</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">nil</span><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">def</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">self.check_for_local</span><span style=\"color: #C9D1D9\">(ip)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> [</span><span style=\"color: #A5D6FF\">\"127.0.0.1\"</span><span style=\"color: #C9D1D9\">, </span><span style=\"color: #A5D6FF\">\"::1\"</span><span style=\"color: #C9D1D9\">].include? ip</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        </span><span style=\"color: #A5D6FF\">\"108.41.23.150\"</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #FF7B72\">else</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        ip</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #8B949E\"># These are fake IPS. Put real physical IPS when</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #8B949E\"># testing in developement enviorment.</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">def</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">self.random_ip_address</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #FF7B72\">%</span><span style=\"color: #C9D1D9\">w{ </span><span style=\"color: #79C0FF\">127.19</span><span style=\"color: #C9D1D9\">.</span><span style=\"color: #79C0FF\">209.10</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">          </span><span style=\"color: #79C0FF\">127.21</span><span style=\"color: #C9D1D9\">.</span><span style=\"color: #79C0FF\">23.150</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">          </span><span style=\"color: #79C0FF\">127.31</span><span style=\"color: #C9D1D9\">.</span><span style=\"color: #79C0FF\">23.155</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">          </span><span style=\"color: #79C0FF\">127.41</span><span style=\"color: #C9D1D9\">.</span><span style=\"color: #79C0FF\">23.170</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">          </span><span style=\"color: #79C0FF\">127.59</span><span style=\"color: #C9D1D9\">.</span><span style=\"color: #79C0FF\">209.14</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">          </span><span style=\"color: #79C0FF\">127.69</span><span style=\"color: #C9D1D9\">.</span><span style=\"color: #79C0FF\">209.80</span><span style=\"color: #C9D1D9\"> }.sample</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">end</span></span></code></pre>\n<p>Last thing we need to do is to make a 1x1 opaque pixel and call it tracker.gif and put it app/assets/images &#x26;&#x26; also in lib/tracker.</p>\n<p>You can also add some validations to your model</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #FF7B72\">class</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FFA657\">Pixel</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">&#x3C;</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">ActiveRecord::Base</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  validates_presence_of </span><span style=\"color: #79C0FF\">:ip_address</span></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">end</span></span></code></pre>\n<p>So there you have it. The heart of the program lies within your lib folder and calls on Rack to listen for that pixel. I am sure there is more we can add to this idea. There is no front end to this, you will have to take the numbers off your database.</p>\n<p>Happy Coding =)</p>";

				const frontmatter$5 = {"layout":"../../layouts/BlogLayout.astro","title":"Tracking Pixels in ruby","date":"2020-12-29T20:59:56.707Z","coverImage":"","originalDatePublished":"2014-11-18","description":"The simplest way to do this is via a tracking pixel – a small, invisible image that is loaded from your server every time your medium is opened.","author":"t0nylombardi","image":"https://images.unsplash.com/flagged/photo-1562599838-8cc871c241a5","categories":["ruby"],"tags":["ruby"]};
				const file$5 = "/Users/t0nylombardi/dev/t0nylombardi/astroBlog/src/pages/blog/tracking-pixels-in-ruby.md";
				const url$5 = "/blog/tracking-pixels-in-ruby";
				function rawContent$5() {
					return "\nIf you are sending out content to your customers, it pretty handy to know if the content is loading. I speak if you are sending out emails, newsletters, ads, etc. If you have ever sent out an email newsletter from a service like Mailchimp, you would have seen email open graphs. Of course, tracking this stuff is super important for a campaign, but it would also be interesting to see if users are seeing your content.\n\nThe simplest way to do this is via a tracking pixel – a small, invisible image that is loaded from your server every time your medium is opened. This is fairly simple to achieve using Rails by building a simple Rack application.\n\n## The idea\n\nPicture you are creating ads for clients and you are sending them out to ad shops. If you are using a program like Google Doubleclick. Google DoubleClick allows you to track your ad through a pixel tracking url. This data can be gathered to figure out trends when those ads, emails, or newletters are being opened.\n\n## The Setup\n\nWe’ll add one model: One to tracking pixels:\n\n`rails g model Pixel ip_address, campaign, content_type, created_at:date ,city, state, user_agent, referral, banner_size`\n\nAll of these fields are strings except for created_at so by default they are created as strings.\n\nthe general idea we have here is to get attach a url into an email or something to see if its being loaded such as:\n\n`yourUrl.com/assets/tracker.gif?campaign=SomeCampaign&banner_size=300x250&content_type=Email`\n\n## Right, now the magic bit:\n\nCreate a directory called /lib/tracker and create a new file called rack.rb\n\n```ruby\n# app/lib/tracker/rack.rb\n\nmodule Tracker\n  class Rack\n\n    def initialize(app)\n      @app = app\n    end\n\n    def call(env)\n      @req = ::Rack::Request.new(env)\n      if @req.path_info =~ /tracker.gif/\n        result = Services::Params.deploy @req.query_string\n        location = Services::Locations.lookup(@req.ip)\n        ip_address = location[\"ip\"] || @req.ip\n        params = {\n          ip_address:     ip_address,\n          campaign:       result[:campaign],\n          banner_size:    result[:banner_size],\n          content_type:   result[:content_type],\n          city:           location[\"city\"],\n          state:          location[\"region_name\"],\n          user_agent:     @req.user_agent,\n          referral:       @req.referer\n        }\n\n        if @pixels = Pixel.create!(params)\n          [\n            200, { 'Content-Type' => 'image/gif' },\n            [File.read(File.join(File.dirname(__FILE__), 'tracker.gif'))]\n          ]\n        else\n          Rails.logger.warn \"\\n\\n Failed to create record on:#{Date.today}\"\n        end\n      else\n        @app.call(env)\n      end\n    end\n\n  end\nend\n```\n\nWithin the method call, several things happen. First is that it will listen to the incomming request for the pixel which we will get into that later. Second we will call on the module Services. The services module does nost if tge heavy lifting for us. In the in lib/servies/ folder will be two files.\n\nWhat we need to essentially do is to get the url params, brake them up and return a hash of values that can be entered into the database.\n\n##### Params:\n\n```ruby\n# lib/services/params.rb\n\nmodule Services\n  class Params\n    require 'active_support/all'\n\n    def self.deploy(obj)\n      @url_obj = obj\n      if obj.class == ActionController::Parameters\n        return_new_hash @url_obj\n      else\n        check_for_decode\n      end\n    end\n\n    def self.check_for_decode\n      if is_base_64 @url_obj\n        str = decode(@url_obj)\n        return_params(str)\n      else\n        return_params @url_obj\n      end\n    end\n\n    def self.return_new_hash(hash)\n      hash[:campaign] = hash.delete(:track)\n      campaign = hash[:campaign].split(/=/)\n      hash[:campaign] = campaign[1]\n      hash\n    end\n\n    def self.return_params(str)\n      arry  = str.split(/&/)\n      hash = {}\n      if arry.length <= 1\n        raise ActionController::RoutingError.new('Not Found')\n      else\n        arry.each{|a| hash[a.scan(/^\\w*/).join('').to_sym] = a.gsub(/^(\\w*=)/,'')}\n      end\n      hash\n    end\n\n    def self.decode(str)\n      str = Base64.urlsafe_decode64(str)\n    end\n\n    def self.is_base_64(str)\n      str =~ /^([A-Za-z0-9+\\/]{4})*([A-Za-z0-9+\\/]{4}|[A-Za-z0-9+\\/]{3}=|[A-Za-z0-9+\\/]{2}==)$/\n    end\n\n  end\nend\n```\n\nthis class also works for encoding whole params into a single 64base string(don't ask why. it was a good idea at the time)\n\nThe other part of the module handles location. This calls from a ip location service [http://freegeoip.net](http://freegeoip.net).\n\n##### Locations:\n\n```ruby\n# lib/services/locations.rb\n\nmodule Services\n  class Locations\n    require 'net/http'\n\n    def self.lookup(ip)\n      ip_address = ip\n      unless Rails.env.production?\n        ip_address = random_ip_address\n      end\n      url = \"http://freegeoip.net/json/#{ip_address}\"\n      begin\n        HTTParty.get(url, timeout: 2)\n      rescue Timeout::Error\n        Rails.logger.warn(\"Could not post to #{url}: timeout\")\n        {city: nil, region_name: nil}\n      rescue\n        Rails.logger.warn(\"Could not post to #{url}\")\n        {city: nil, region_name: nil}\n      end\n    end\n\n    def self.check_for_local(ip)\n      if [\"127.0.0.1\", \"::1\"].include? ip\n        \"108.41.23.150\"\n      else\n        ip\n      end\n    end\n\n    # These are fake IPS. Put real physical IPS when\n    # testing in developement enviorment.\n    def self.random_ip_address\n      %w{ 127.19.209.10\n          127.21.23.150\n          127.31.23.155\n          127.41.23.170\n          127.59.209.14\n          127.69.209.80 }.sample\n    end\n\n  end\nend\n```\n\nLast thing we need to do is to make a 1x1 opaque pixel and call it tracker.gif and put it app/assets/images && also in lib/tracker.\n\nYou can also add some validations to your model\n\n```ruby\nclass Pixel < ActiveRecord::Base\n  validates_presence_of :ip_address\nend\n```\n\nSo there you have it. The heart of the program lies within your lib folder and calls on Rack to listen for that pixel. I am sure there is more we can add to this idea. There is no front end to this, you will have to take the numbers off your database.\n\nHappy Coding =)\n";
				}
				function compiledContent$5() {
					return html$5;
				}
				function getHeadings$5() {
					return [{"depth":2,"slug":"the-idea","text":"The idea"},{"depth":2,"slug":"the-setup","text":"The Setup"},{"depth":2,"slug":"right-now-the-magic-bit","text":"Right, now the magic bit:"},{"depth":5,"slug":"params","text":"Params:"},{"depth":5,"slug":"locations","text":"Locations:"}];
				}
				function getHeaders$5() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$5();
				}				async function Content$5() {
					const { layout, ...content } = frontmatter$5;
					content.file = file$5;
					content.url = url$5;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$5 });
					return createVNode($$BlogLayout, {
									content,
									frontmatter: content,
									headings: getHeadings$5(),
									rawContent: rawContent$5,
									compiledContent: compiledContent$5,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$5[Symbol.for('astro.needsHeadRendering')] = false;

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$5,
	file: file$5,
	url: url$5,
	rawContent: rawContent$5,
	compiledContent: compiledContent$5,
	getHeadings: getHeadings$5,
	getHeaders: getHeaders$5,
	Content: Content$5,
	default: Content$5
}, Symbol.toStringTag, { value: 'Module' }));

const html$4 = "<p>I been trying to help a friend get more attention to his twitter and his music. I choose to try to automate search results and reply back to each user with a message. Upon doing this, I discovered it would take two ruby gems.</p>\n<p>First was twitter gem:</p>\n<p><code>sudo gem install twitter</code></p>\n<p>second is tweetstream:</p>\n<p><code>sudo gem install tweetstream</code></p>\n<p>The Twitter gem has streaming aspects in their latest version 5.8.0 say its experimental so I didn’t use it. This is a simple simple bot to run. The main hurtle is to tweet to users that are tweeting about my search field, is that I needed not to get caught by twitter.</p>\n<p>My Idea was get a large amount of sentences together and randomly select one of them and tweet it to that user. Each time I tweeted I would let the script sleep for a while anywhere be tween 1 and 120 seconds. Since this is done with a random generator, Most of the time the random number is above 1 minute. Since the tweets are spaced apart time wise, the sentences where different enough to fool Twitter. I’ve tested twice and each time I was able to keep it running for a few hours with no problems.</p>\n<p>here’s the script:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">require</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">'twitter'</span></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">require</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">'tweetstream'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #79C0FF\">OpenSSL</span><span style=\"color: #C9D1D9\">::</span><span style=\"color: #79C0FF\">SSL</span><span style=\"color: #C9D1D9\">::</span><span style=\"color: #79C0FF\">VERIFY_PEER</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">OpenSSL</span><span style=\"color: #C9D1D9\">::</span><span style=\"color: #79C0FF\">SSL</span><span style=\"color: #C9D1D9\">::</span><span style=\"color: #79C0FF\">VERIFY_NONE</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">count </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">1</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">tweets </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> []</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">api_keys </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">          </span><span style=\"color: #79C0FF\">consumer_key:</span><span style=\"color: #C9D1D9\">         </span><span style=\"color: #A5D6FF\">'1234,</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">          consumer_secret:      '</span><span style=\"color: #79C0FF\">1234</span><span style=\"color: #A5D6FF\">',</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">          access_token:         '</span><span style=\"color: #79C0FF\">1234</span><span style=\"color: #A5D6FF\">',</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">          access_token_secret:  '</span><span style=\"color: #79C0FF\">1234</span><span style=\"color: #A5D6FF\">'</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">file = File.open(\"tweets.txt\", \"r\").each_line do |line|</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">  tweets &#x3C;&#x3C; line</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">end</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">file.close</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">client = Twitter::REST::Client.new do |config|</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">  config.consumer_key        = api_keys[:consumer_key]</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">  config.consumer_secret     = api_keys[:consumer_secret]</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">  config.access_token        = api_keys[:access_token]</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">  config.access_token_secret = api_keys[:access_token_secret]</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">end</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">TweetStream.configure do |config|</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">  config.consumer_key         = api_keys[:consumer_key]</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">  config.consumer_secret      = api_keys[:consumer_secret]</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">  config.oauth_token          = api_keys[:access_token]</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">  config.oauth_token_secret   = api_keys[:access_token_secret]</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">  config.auth_method          = :oauth</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">end</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">puts \"Api keys conected ...\\n\"</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">begin</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">  TweetStream::Client.new.on_error do |message|</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">    puts message</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">    break</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">  end.track('</span><span style=\"color: #C9D1D9\">keyword</span><span style=\"color: #A5D6FF\">', '</span><span style=\"color: #C9D1D9\">keyword2</span><span style=\"color: #A5D6FF\">') do |status|</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">    tweetn = rand(0..tweets.count)</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">    sleepn = rand(1..120)</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">    client.update(\"@#{status.user.screen_name} #{tweets[tweetn]}\")</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">    printf \"%-5s %s\\n\\n\",</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">            \"#{count}: #{status.user.screen_name.rjust(10)}\",</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">                                                      tweets[tweetn]</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">    sleep sleepn</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">    count += 1</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">  end</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">rescue Twitter::Error</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">  sleep(5)</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">  puts \"This request looks like it might be automated.\"</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">rescue Exception</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">  puts \"some other error happened!\"</span></span>\n<span class=\"line\"><span style=\"color: #A5D6FF\">end</span></span>\n<span class=\"line\"></span></code></pre>";

				const frontmatter$4 = {"layout":"../../layouts/BlogLayout.astro","title":"Old-school Twitter Bot in ruby","date":"2020-12-29T20:41:18.408Z","overImage":"","originalDatePublished":"2014-11-18T00:00:00.000Z","description":"I been trying to help a friend get more attention to his twitter and his music. I choose to try to automate search results and reply back to each user with a message.","image":"https://images.unsplash.com/photo-1610878785620-3ab2d3a2ae7b","categories":["ruby"],"tags":["ruby"]};
				const file$4 = "/Users/t0nylombardi/dev/t0nylombardi/astroBlog/src/pages/blog/old-school-twitter-bot.md";
				const url$4 = "/blog/old-school-twitter-bot";
				function rawContent$4() {
					return "\nI been trying to help a friend get more attention to his twitter and his music. I choose to try to automate search results and reply back to each user with a message. Upon doing this, I discovered it would take two ruby gems.\n\nFirst was twitter gem:\n\n`sudo gem install twitter`\n\nsecond is tweetstream:\n\n`sudo gem install tweetstream`\n\nThe Twitter gem has streaming aspects in their latest version 5.8.0 say its experimental so I didn’t use it. This is a simple simple bot to run. The main hurtle is to tweet to users that are tweeting about my search field, is that I needed not to get caught by twitter.\n\nMy Idea was get a large amount of sentences together and randomly select one of them and tweet it to that user. Each time I tweeted I would let the script sleep for a while anywhere be tween 1 and 120 seconds. Since this is done with a random generator, Most of the time the random number is above 1 minute. Since the tweets are spaced apart time wise, the sentences where different enough to fool Twitter. I’ve tested twice and each time I was able to keep it running for a few hours with no problems.\n\nhere’s the script:\n\n```ruby\n\nrequire 'twitter'\nrequire 'tweetstream'\n\nOpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE\n\ncount = 1\ntweets = []\napi_keys = {\n          consumer_key:         '1234,\n          consumer_secret:      '1234',\n          access_token:         '1234',\n          access_token_secret:  '1234'\n}\n\n\nfile = File.open(\"tweets.txt\", \"r\").each_line do |line|\n  tweets << line\nend\nfile.close\n\nclient = Twitter::REST::Client.new do |config|\n  config.consumer_key        = api_keys[:consumer_key]\n  config.consumer_secret     = api_keys[:consumer_secret]\n  config.access_token        = api_keys[:access_token]\n  config.access_token_secret = api_keys[:access_token_secret]\nend\n\nTweetStream.configure do |config|\n  config.consumer_key         = api_keys[:consumer_key]\n  config.consumer_secret      = api_keys[:consumer_secret]\n  config.oauth_token          = api_keys[:access_token]\n  config.oauth_token_secret   = api_keys[:access_token_secret]\n  config.auth_method          = :oauth\nend\n\nputs \"Api keys conected ...\\n\"\n\nbegin\n  TweetStream::Client.new.on_error do |message|\n    puts message\n    break\n  end.track('keyword', 'keyword2') do |status|\n    tweetn = rand(0..tweets.count)\n    sleepn = rand(1..120)\n    client.update(\"@#{status.user.screen_name} #{tweets[tweetn]}\")\n    printf \"%-5s %s\\n\\n\",\n            \"#{count}: #{status.user.screen_name.rjust(10)}\",\n                                                      tweets[tweetn]\n    sleep sleepn\n    count += 1\n  end\nrescue Twitter::Error\n  sleep(5)\n  puts \"This request looks like it might be automated.\"\nrescue Exception\n  puts \"some other error happened!\"\nend\n\n```\n";
				}
				function compiledContent$4() {
					return html$4;
				}
				function getHeadings$4() {
					return [];
				}
				function getHeaders$4() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$4();
				}				async function Content$4() {
					const { layout, ...content } = frontmatter$4;
					content.file = file$4;
					content.url = url$4;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$4 });
					return createVNode($$BlogLayout, {
									content,
									frontmatter: content,
									headings: getHeadings$4(),
									rawContent: rawContent$4,
									compiledContent: compiledContent$4,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$4[Symbol.for('astro.needsHeadRendering')] = false;

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$4,
	file: file$4,
	url: url$4,
	rawContent: rawContent$4,
	compiledContent: compiledContent$4,
	getHeadings: getHeadings$4,
	getHeaders: getHeaders$4,
	Content: Content$4,
	default: Content$4
}, Symbol.toStringTag, { value: 'Module' }));

const html$3 = "<p>Haven’t wrote in this in a while. I wanted this to be a portal to show all the work I do. Coding, Graphics, Music, random thoughts. I been written a code to parse through an email list a client gave me that has roughly 94 emails. The list is old and we don’t know how many of them are actually legit. So my thoughts where to run through the script and first get out all the emails that are misspelled. Second would be to check if the mx record of that email address still exist. The whole loop through create 3 list. Bad_emails(all misspelled emails) Good_emails(all that I going to assume that are good) and Rejected_emails(based off a regex code on the assumption of what a regular email would be) The initial run of my idea came out to be roughly 54k emails. The reason I separated the list into three categories is that, well there is many debated on to what is a real email address and what is not. Plus the assumption of checking the mx record could give false negatives and vice verse.</p>\n<p>Here is the code.</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #8B949E\"># code to parse a text file that has 94k emails to check whether</span></span>\n<span class=\"line\"><span style=\"color: #8B949E\"># the emails are somewhat valid.</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">options </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> { </span><span style=\"color: #79C0FF\">:on</span><span style=\"color: #C9D1D9\"> => </span><span style=\"color: #79C0FF\">true</span><span style=\"color: #C9D1D9\">,</span><span style=\"color: #79C0FF\">:check_mx</span><span style=\"color: #C9D1D9\"> => </span><span style=\"color: #79C0FF\">true</span><span style=\"color: #C9D1D9\">, </span><span style=\"color: #79C0FF\">:local_length</span><span style=\"color: #C9D1D9\"> => </span><span style=\"color: #79C0FF\">25</span><span style=\"color: #C9D1D9\">,</span><span style=\"color: #79C0FF\">:domain_length</span><span style=\"color: #C9D1D9\"> => </span><span style=\"color: #79C0FF\">10</span><span style=\"color: #C9D1D9\"> }</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">def</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">is_a_valid_email?</span><span style=\"color: #C9D1D9\">(email)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    (email </span><span style=\"color: #FF7B72\">=~</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">/^(</span><span style=\"color: #79C0FF\">[</span><span style=\"color: #7EE787; font-weight: bold\">\\w</span><span style=\"color: #79C0FF\">+</span><span style=\"color: #7EE787; font-weight: bold\">\\-</span><span style=\"color: #79C0FF\">]</span><span style=\"color: #A5D6FF\">.?)+@</span><span style=\"color: #79C0FF\">[a-z</span><span style=\"color: #7EE787; font-weight: bold\">\\d\\-</span><span style=\"color: #79C0FF\">]</span><span style=\"color: #A5D6FF\">+(</span><span style=\"color: #7EE787; font-weight: bold\">\\.</span><span style=\"color: #79C0FF\">[a-z]</span><span style=\"color: #A5D6FF\">+)*</span><span style=\"color: #7EE787; font-weight: bold\">\\.</span><span style=\"color: #79C0FF\">[a-z]</span><span style=\"color: #A5D6FF\">+$/i</span><span style=\"color: #C9D1D9\">)</span></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">f </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">File</span><span style=\"color: #C9D1D9\">.</span><span style=\"color: #79C0FF\">open</span><span style=\"color: #C9D1D9\">(</span><span style=\"color: #A5D6FF\">\"emails.txt\"</span><span style=\"color: #C9D1D9\">, </span><span style=\"color: #A5D6FF\">\"r\"</span><span style=\"color: #C9D1D9\">)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">line_number </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">1</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">invailid_email </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">1</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">f.each_line </span><span style=\"color: #FF7B72\">do</span><span style=\"color: #C9D1D9\"> |email|</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> is_a_valid_email?(email)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        results </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">ValidatesEmailFormatOf</span><span style=\"color: #C9D1D9\">::validate_email_format(email, options)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        </span><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> results.nil?</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">            </span><span style=\"color: #79C0FF\">File</span><span style=\"color: #C9D1D9\">.</span><span style=\"color: #79C0FF\">open</span><span style=\"color: #C9D1D9\">(</span><span style=\"color: #A5D6FF\">\"good_emails.txt\"</span><span style=\"color: #C9D1D9\">, </span><span style=\"color: #A5D6FF\">'a+'</span><span style=\"color: #C9D1D9\">) { |file| file.write(email) }</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">            </span><span style=\"color: #79C0FF\">printf</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">\"%-5s %s\"</span><span style=\"color: #C9D1D9\">, line_number, email</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        </span><span style=\"color: #FF7B72\">else</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">            </span><span style=\"color: #79C0FF\">File</span><span style=\"color: #C9D1D9\">.</span><span style=\"color: #79C0FF\">open</span><span style=\"color: #C9D1D9\">(</span><span style=\"color: #A5D6FF\">\"rejected_emails.txt\"</span><span style=\"color: #C9D1D9\">, </span><span style=\"color: #A5D6FF\">'a+'</span><span style=\"color: #C9D1D9\">) { |file| file.write(email) }</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">          </span><span style=\"color: #79C0FF\">print</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #79C0FF\">\\t\\t</span><span style=\"color: #A5D6FF\">#{</span><span style=\"color: #C9D1D9\">email.</span><span style=\"color: #79C0FF\">gsub</span><span style=\"color: #C9D1D9\">(</span><span style=\"color: #A5D6FF\">/</span><span style=\"color: #7EE787; font-weight: bold\">\\n</span><span style=\"color: #A5D6FF\">/</span><span style=\"color: #C9D1D9\">,</span><span style=\"color: #A5D6FF\">\" \"</span><span style=\"color: #C9D1D9\">)</span><span style=\"color: #A5D6FF\">}</span><span style=\"color: #A5D6FF\">: </span><span style=\"color: #A5D6FF\">#{</span><span style=\"color: #C9D1D9\">results.join(</span><span style=\"color: #A5D6FF\">', '</span><span style=\"color: #C9D1D9\">)</span><span style=\"color: #A5D6FF\">}</span><span style=\"color: #79C0FF\">\\n</span><span style=\"color: #A5D6FF\">\"</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">          invailid_email </span><span style=\"color: #FF7B72\">+=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">1</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">else</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        </span><span style=\"color: #79C0FF\">printf</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">\"%-5s %s</span><span style=\"color: #79C0FF\">\\n</span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #C9D1D9\">, line_number, email</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        </span><span style=\"color: #79C0FF\">File</span><span style=\"color: #C9D1D9\">.</span><span style=\"color: #79C0FF\">open</span><span style=\"color: #C9D1D9\">(</span><span style=\"color: #A5D6FF\">\"bad_emails.txt\"</span><span style=\"color: #C9D1D9\">, </span><span style=\"color: #A5D6FF\">'a+'</span><span style=\"color: #C9D1D9\">) { |file| file.write(email) }</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      line_number </span><span style=\"color: #FF7B72\">+=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">1</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">file.close</span></span></code></pre>";

				const frontmatter$3 = {"layout":"../../layouts/BlogLayout.astro","title":"Parsing An Email List","date":"2020-12-29T20:57:55.934Z","coverImage":"","originalDatePublished":"2014-11-18","description":"I been written a code to parse through an email list a client gave me that has roughly 94 emails.","author":"t0nylombardi","image":"https://images.unsplash.com/photo-1603791440384-56cd371ee9a7","categories":["ruby"],"tags":["ruby"]};
				const file$3 = "/Users/t0nylombardi/dev/t0nylombardi/astroBlog/src/pages/blog/parsing-an-email-list.md";
				const url$3 = "/blog/parsing-an-email-list";
				function rawContent$3() {
					return "\nHaven’t wrote in this in a while. I wanted this to be a portal to show all the work I do. Coding, Graphics, Music, random thoughts. I been written a code to parse through an email list a client gave me that has roughly 94 emails. The list is old and we don’t know how many of them are actually legit. So my thoughts where to run through the script and first get out all the emails that are misspelled. Second would be to check if the mx record of that email address still exist. The whole loop through create 3 list. Bad_emails(all misspelled emails) Good_emails(all that I going to assume that are good) and Rejected_emails(based off a regex code on the assumption of what a regular email would be) The initial run of my idea came out to be roughly 54k emails. The reason I separated the list into three categories is that, well there is many debated on to what is a real email address and what is not. Plus the assumption of checking the mx record could give false negatives and vice verse.\n\nHere is the code.\n\n```ruby\n# code to parse a text file that has 94k emails to check whether\n# the emails are somewhat valid.\n\noptions = { :on => true,:check_mx => true, :local_length => 25,:domain_length => 10 }\n\ndef is_a_valid_email?(email)\n    (email =~ /^([\\w+\\-].?)+@[a-z\\d\\-]+(\\.[a-z]+)*\\.[a-z]+$/i)\nend\n\nf = File.open(\"emails.txt\", \"r\")\nline_number = 1\ninvailid_email = 1\nf.each_line do |email|\n\n    if is_a_valid_email?(email)\n        results = ValidatesEmailFormatOf::validate_email_format(email, options)\n        if results.nil?\n            File.open(\"good_emails.txt\", 'a+') { |file| file.write(email) }\n            printf \"%-5s %s\", line_number, email\n        else\n            File.open(\"rejected_emails.txt\", 'a+') { |file| file.write(email) }\n          print \"\\t\\t#{email.gsub(/\\n/,\" \")}: #{results.join(', ')}\\n\"\n          invailid_email += 1\n        end\n    else\n        printf \"%-5s %s\\n\", line_number, email\n        File.open(\"bad_emails.txt\", 'a+') { |file| file.write(email) }\n    end\n      line_number += 1\n    end\nfile.close\n```\n";
				}
				function compiledContent$3() {
					return html$3;
				}
				function getHeadings$3() {
					return [];
				}
				function getHeaders$3() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$3();
				}				async function Content$3() {
					const { layout, ...content } = frontmatter$3;
					content.file = file$3;
					content.url = url$3;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$3 });
					return createVNode($$BlogLayout, {
									content,
									frontmatter: content,
									headings: getHeadings$3(),
									rawContent: rawContent$3,
									compiledContent: compiledContent$3,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$3[Symbol.for('astro.needsHeadRendering')] = false;

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$3,
	file: file$3,
	url: url$3,
	rawContent: rawContent$3,
	compiledContent: compiledContent$3,
	getHeadings: getHeadings$3,
	getHeaders: getHeaders$3,
	Content: Content$3,
	default: Content$3
}, Symbol.toStringTag, { value: 'Module' }));

const html$2 = "<p>My now wife aded me to make some vows for our wedding. I thought I would merge the two loves together and wrote this little code poem. The original was written in PHP.</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #8B949E\">#all you need is love</span></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">require</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">'date'</span></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">require</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">'love'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">on_this_day </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">DateTime</span><span style=\"color: #C9D1D9\">.now</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">begin</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> have_and_hold(better,worse)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    love_and_cherish(richer,pooer)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    get_sickness(status)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    get_health(status)</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #79C0FF\">puts</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">\"I </span><span style=\"color: #A5D6FF\">#{</span><span style=\"color: #C9D1D9\">name</span><span style=\"color: #A5D6FF\">}</span><span style=\"color: #A5D6FF\">, do love you\"</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">else</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    divorce</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">end</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">while</span><span style=\"color: #C9D1D9\"> death(status) </span><span style=\"color: #FF7B72\">!=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">nil</span></span></code></pre>";

				const frontmatter$2 = {"layout":"../../layouts/BlogLayout.astro","title":"All you need is love","date":"2020-12-29T20:37:52.538Z","coverImage":"","originalDatePublished":"2014-11-18T00:00:00.000Z","description":"My now wife aded me to make some vows for our wedding. I thought I would merge the two loves together and wrote this little code poem. The original was written in PHP.","author":"t0nylombardi","image":"https://images.unsplash.com/photo-1584907797065-0bbcaf9c489b","categories":["ruby"],"tags":["ruby"]};
				const file$2 = "/Users/t0nylombardi/dev/t0nylombardi/astroBlog/src/pages/blog/all-you-need-is-love.md";
				const url$2 = "/blog/all-you-need-is-love";
				function rawContent$2() {
					return "\nMy now wife aded me to make some vows for our wedding. I thought I would merge the two loves together and wrote this little code poem. The original was written in PHP.\n\n```ruby\n#all you need is love\nrequire 'date'\nrequire 'love'\n\non_this_day = DateTime.now\n\nbegin\n  if have_and_hold(better,worse)\n    love_and_cherish(richer,pooer)\n    get_sickness(status)\n    get_health(status)\n\n    puts \"I #{name}, do love you\"\n  else\n    divorce\n  end\nend while death(status) != nil\n```\n";
				}
				function compiledContent$2() {
					return html$2;
				}
				function getHeadings$2() {
					return [];
				}
				function getHeaders$2() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$2();
				}				async function Content$2() {
					const { layout, ...content } = frontmatter$2;
					content.file = file$2;
					content.url = url$2;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$2 });
					return createVNode($$BlogLayout, {
									content,
									frontmatter: content,
									headings: getHeadings$2(),
									rawContent: rawContent$2,
									compiledContent: compiledContent$2,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$2[Symbol.for('astro.needsHeadRendering')] = false;

const _page5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$2,
	file: file$2,
	url: url$2,
	rawContent: rawContent$2,
	compiledContent: compiledContent$2,
	getHeadings: getHeadings$2,
	getHeaders: getHeaders$2,
	Content: Content$2,
	default: Content$2
}, Symbol.toStringTag, { value: 'Module' }));

const html$1 = "<p>My biggest concern in developing a website, especially in the current role I have, is to worry about how well a site will perform and how secure it will be. Someone I know from the interwebs posted a site with form that allowed you to sign up to a class of his. I like his work so I was intrigued into how he wrote his backend for the form since he is a front-end developer. His credentials of his backend was in his JS.</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #FF7B72\">function</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">postContactToGoogle</span><span style=\"color: #C9D1D9\">(</span><span style=\"color: #FFA657\">f</span><span style=\"color: #C9D1D9\">) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">var</span><span style=\"color: #C9D1D9\"> email </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> f.</span><span style=\"color: #D2A8FF\">find</span><span style=\"color: #C9D1D9\">(</span><span style=\"color: #A5D6FF\">'.form-email'</span><span style=\"color: #C9D1D9\">).</span><span style=\"color: #D2A8FF\">val</span><span style=\"color: #C9D1D9\">();</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">var</span><span style=\"color: #C9D1D9\"> name </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> f.</span><span style=\"color: #D2A8FF\">find</span><span style=\"color: #C9D1D9\">(</span><span style=\"color: #A5D6FF\">'.form-name'</span><span style=\"color: #C9D1D9\">).</span><span style=\"color: #D2A8FF\">val</span><span style=\"color: #C9D1D9\">();</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  $.</span><span style=\"color: #D2A8FF\">ajax</span><span style=\"color: #C9D1D9\">({</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    url: </span><span style=\"color: #A5D6FF\">'https://docs.google.com/forms/d/jeberish-google-id/formResponse'</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    data: {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      entry_1111111111: email,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      entry_1111111117: name,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    },</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    type: </span><span style=\"color: #A5D6FF\">'POST'</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    dataType: </span><span style=\"color: #A5D6FF\">'xml'</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    statusCode: {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #79C0FF\">0</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #FF7B72\">function</span><span style=\"color: #C9D1D9\"> () {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        window.location.</span><span style=\"color: #D2A8FF\">replace</span><span style=\"color: #C9D1D9\">(</span><span style=\"color: #A5D6FF\">'/path/thanks'</span><span style=\"color: #C9D1D9\">);</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      },</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #79C0FF\">200</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #FF7B72\">function</span><span style=\"color: #C9D1D9\"> () {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        window.location.</span><span style=\"color: #D2A8FF\">replace</span><span style=\"color: #C9D1D9\">(</span><span style=\"color: #A5D6FF\">'/path/thanks'</span><span style=\"color: #C9D1D9\">);</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      },</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    },</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  });</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span></code></pre>\n<p>So I looked at this telling myself it was wrong, or at least there had to be a better way of doing something like that.</p>\n<p>I blew up the database(or in this case to a google excel doc) as a challenge to myself to see if I was really right.</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #FF7B72\">function</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">rText</span><span style=\"color: #C9D1D9\">() {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">var</span><span style=\"color: #C9D1D9\"> text </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">''</span><span style=\"color: #C9D1D9\">;</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">var</span><span style=\"color: #C9D1D9\"> possible </span><span style=\"color: #FF7B72\">=</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #A5D6FF\">'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'</span><span style=\"color: #C9D1D9\">;</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">for</span><span style=\"color: #C9D1D9\"> (</span><span style=\"color: #FF7B72\">var</span><span style=\"color: #C9D1D9\"> i </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">0</span><span style=\"color: #C9D1D9\">; i </span><span style=\"color: #FF7B72\">&#x3C;</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">5</span><span style=\"color: #C9D1D9\">; i</span><span style=\"color: #FF7B72\">++</span><span style=\"color: #C9D1D9\">) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    text </span><span style=\"color: #FF7B72\">+=</span><span style=\"color: #C9D1D9\"> possible.</span><span style=\"color: #D2A8FF\">charAt</span><span style=\"color: #C9D1D9\">(</span><span style=\"color: #79C0FF\">Math</span><span style=\"color: #C9D1D9\">.</span><span style=\"color: #79C0FF\">floor</span><span style=\"color: #C9D1D9\">(</span><span style=\"color: #79C0FF\">Math</span><span style=\"color: #C9D1D9\">.</span><span style=\"color: #79C0FF\">random</span><span style=\"color: #C9D1D9\">() </span><span style=\"color: #FF7B72\">*</span><span style=\"color: #C9D1D9\"> possible.</span><span style=\"color: #79C0FF\">length</span><span style=\"color: #C9D1D9\">));</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  }</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">return</span><span style=\"color: #C9D1D9\"> text;</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">function</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">generateEmail</span><span style=\"color: #C9D1D9\">() {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">var</span><span style=\"color: #C9D1D9\"> username, email, full_email;</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  username </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">'HueBin_'</span><span style=\"color: #C9D1D9\">;</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  email </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">'Hacked'</span><span style=\"color: #C9D1D9\">;</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  full_email </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> username </span><span style=\"color: #FF7B72\">+</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">rText</span><span style=\"color: #C9D1D9\">() </span><span style=\"color: #FF7B72\">+</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">'@'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">+</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">rText</span><span style=\"color: #C9D1D9\">() </span><span style=\"color: #FF7B72\">+</span><span style=\"color: #C9D1D9\"> email </span><span style=\"color: #FF7B72\">+</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">'.com'</span><span style=\"color: #C9D1D9\">;</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">return</span><span style=\"color: #C9D1D9\"> full_email;</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">function</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">postContactToGoogle</span><span style=\"color: #C9D1D9\">() {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  $.</span><span style=\"color: #D2A8FF\">ajax</span><span style=\"color: #C9D1D9\">({</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    url: </span><span style=\"color: #A5D6FF\">'https://docs.google.com/forms/d/jeberish-google-id/formResponse'</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    data: {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      entry_1111111111: </span><span style=\"color: #D2A8FF\">generateEmail</span><span style=\"color: #C9D1D9\">(),</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      entry_1111111117: </span><span style=\"color: #A5D6FF\">'HueBin_'</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    },</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    type: </span><span style=\"color: #A5D6FF\">'POST'</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    dataType: </span><span style=\"color: #A5D6FF\">'xml'</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    crossDomain: </span><span style=\"color: #79C0FF\">true</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    statusCode: {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #79C0FF\">0</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #FF7B72\">function</span><span style=\"color: #C9D1D9\"> (</span><span style=\"color: #FFA657\">data</span><span style=\"color: #C9D1D9\">) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        console.</span><span style=\"color: #D2A8FF\">log</span><span style=\"color: #C9D1D9\">(</span><span style=\"color: #A5D6FF\">'BAD!'</span><span style=\"color: #C9D1D9\">, data);</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      },</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #79C0FF\">200</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #FF7B72\">function</span><span style=\"color: #C9D1D9\"> (</span><span style=\"color: #FFA657\">data</span><span style=\"color: #C9D1D9\">) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        console.</span><span style=\"color: #D2A8FF\">log</span><span style=\"color: #C9D1D9\">(</span><span style=\"color: #A5D6FF\">'GOOD'</span><span style=\"color: #C9D1D9\">, data);</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      },</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    },</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  });</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #D2A8FF\">$</span><span style=\"color: #C9D1D9\">(</span><span style=\"color: #FF7B72\">function</span><span style=\"color: #C9D1D9\"> () {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">var</span><span style=\"color: #C9D1D9\"> num </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">1</span><span style=\"color: #C9D1D9\">;</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">for</span><span style=\"color: #C9D1D9\"> (</span><span style=\"color: #FF7B72\">var</span><span style=\"color: #C9D1D9\"> i </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">0</span><span style=\"color: #C9D1D9\">; i </span><span style=\"color: #FF7B72\">&#x3C;</span><span style=\"color: #C9D1D9\"> num; i</span><span style=\"color: #FF7B72\">++</span><span style=\"color: #C9D1D9\">) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #79C0FF\">setTimeout</span><span style=\"color: #C9D1D9\">(</span><span style=\"color: #D2A8FF\">postContactToGoogle</span><span style=\"color: #C9D1D9\">(), </span><span style=\"color: #79C0FF\">50000</span><span style=\"color: #C9D1D9\">); </span><span style=\"color: #8B949E\">// yes thats 50,000!</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  }</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">});</span></span></code></pre>\n<p>this posted info into the database that looked simular to this:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #c9d1d9\">  name: HueBun_,Email:HueBin_piMt6@vwq4WHacked.com</span></span>\n<span class=\"line\"><span style=\"color: #c9d1d9\">  name: HueBun_,Email:HueBin_f7Txq@pzLm6Hacked.com</span></span>\n<span class=\"line\"><span style=\"color: #c9d1d9\">  name: HueBun_,Email:HueBin_YBTNf@TluieHacked.com</span></span>\n<span class=\"line\"><span style=\"color: #c9d1d9\">  name: HueBun_,Email:HueBin_QYqVm@jYWuUHacked.com</span></span></code></pre>\n<p>I wrote an email stating that I was really really sorry about it. More so, I meant to contact him sooner, but I just entered another year in my life and I took the weekend off from electronics (mainly because of beer)</p>\n<p>conclusion: don’t smoke crack! No, when putting anything out in to the publics eyes, do not put the keys to the castle out there for everyone to see. Also, don’t go my route. Instead inform of the person of potential bugs rather than acting on exploiting them.</p>";

				const frontmatter$1 = {"layout":"../../layouts/BlogLayout.astro","title":"Sorry, I hacked you.","date":"2020-12-29T06:07:10.240Z","coverImage":"/assets/posts/Ways-Websites-Are-Hacked.png","originalDatePublished":"2016-07-19T16:41:00.000Z","description":" Someone I know from the interwebs posted a site with form that allowed you to sign up to a class of his and he had a huge google sheets security flaw","author":"t0nylombardi","image":"https://images.unsplash.com/photo-1511376777868-611b54f68947","categories":"javascript","tags":"javascript"};
				const file$1 = "/Users/t0nylombardi/dev/t0nylombardi/astroBlog/src/pages/blog/Sorry-I-hacked-you.md";
				const url$1 = "/blog/Sorry-I-hacked-you";
				function rawContent$1() {
					return "\nMy biggest concern in developing a website, especially in the current role I have, is to worry about how well a site will perform and how secure it will be. Someone I know from the interwebs posted a site with form that allowed you to sign up to a class of his. I like his work so I was intrigued into how he wrote his backend for the form since he is a front-end developer. His credentials of his backend was in his JS.\n\n```javascript\nfunction postContactToGoogle(f) {\n  var email = f.find('.form-email').val();\n  var name = f.find('.form-name').val();\n\n  $.ajax({\n    url: 'https://docs.google.com/forms/d/jeberish-google-id/formResponse',\n    data: {\n      entry_1111111111: email,\n      entry_1111111117: name,\n    },\n    type: 'POST',\n    dataType: 'xml',\n    statusCode: {\n      0: function () {\n        window.location.replace('/path/thanks');\n      },\n      200: function () {\n        window.location.replace('/path/thanks');\n      },\n    },\n  });\n}\n```\n\nSo I looked at this telling myself it was wrong, or at least there had to be a better way of doing something like that.\n\nI blew up the database(or in this case to a google excel doc) as a challenge to myself to see if I was really right.\n\n```javascript\nfunction rText() {\n  var text = '';\n  var possible =\n    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';\n  for (var i = 0; i < 5; i++) {\n    text += possible.charAt(Math.floor(Math.random() * possible.length));\n  }\n  return text;\n}\n\nfunction generateEmail() {\n  var username, email, full_email;\n  username = 'HueBin_';\n  email = 'Hacked';\n  full_email = username + rText() + '@' + rText() + email + '.com';\n  return full_email;\n}\n\nfunction postContactToGoogle() {\n  $.ajax({\n    url: 'https://docs.google.com/forms/d/jeberish-google-id/formResponse',\n    data: {\n      entry_1111111111: generateEmail(),\n      entry_1111111117: 'HueBin_',\n    },\n    type: 'POST',\n    dataType: 'xml',\n    crossDomain: true,\n    statusCode: {\n      0: function (data) {\n        console.log('BAD!', data);\n      },\n      200: function (data) {\n        console.log('GOOD', data);\n      },\n    },\n  });\n}\n\n$(function () {\n  var num = 1;\n  for (var i = 0; i < num; i++) {\n    setTimeout(postContactToGoogle(), 50000); // yes thats 50,000!\n  }\n});\n```\n\nthis posted info into the database that looked simular to this:\n\n```\n  name: HueBun_,Email:HueBin_piMt6@vwq4WHacked.com\n  name: HueBun_,Email:HueBin_f7Txq@pzLm6Hacked.com\n  name: HueBun_,Email:HueBin_YBTNf@TluieHacked.com\n  name: HueBun_,Email:HueBin_QYqVm@jYWuUHacked.com\n```\n\nI wrote an email stating that I was really really sorry about it. More so, I meant to contact him sooner, but I just entered another year in my life and I took the weekend off from electronics (mainly because of beer)\n\nconclusion: don't smoke crack! No, when putting anything out in to the publics eyes, do not put the keys to the castle out there for everyone to see. Also, don't go my route. Instead inform of the person of potential bugs rather than acting on exploiting them.\n";
				}
				function compiledContent$1() {
					return html$1;
				}
				function getHeadings$1() {
					return [];
				}
				function getHeaders$1() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$1();
				}				async function Content$1() {
					const { layout, ...content } = frontmatter$1;
					content.file = file$1;
					content.url = url$1;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$1 });
					return createVNode($$BlogLayout, {
									content,
									frontmatter: content,
									headings: getHeadings$1(),
									rawContent: rawContent$1,
									compiledContent: compiledContent$1,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$1[Symbol.for('astro.needsHeadRendering')] = false;

const _page6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$1,
	file: file$1,
	url: url$1,
	rawContent: rawContent$1,
	compiledContent: compiledContent$1,
	getHeadings: getHeadings$1,
	getHeaders: getHeaders$1,
	Content: Content$1,
	default: Content$1
}, Symbol.toStringTag, { value: 'Module' }));

const html = "<p>I wrote a script that allows me to take several images rename them, and then create two resized images in addition. The specifics of the naming and re-sizing convention required me to name each image as:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #c9d1d9\">1.jpg</span></span>\n<span class=\"line\"><span style=\"color: #c9d1d9\">2.jpg</span></span>\n<span class=\"line\"><span style=\"color: #c9d1d9\">3.jpg</span></span>\n<span class=\"line\"><span style=\"color: #c9d1d9\">etc.....</span></span></code></pre>\n<p>The file name comes up as a string “OHV May1.jpg” and so on. Recursively parsing through the images came up with a hurtle. In the array of the directory the list would show:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #c9d1d9\">OHV May39.jpg</span></span>\n<span class=\"line\"><span style=\"color: #c9d1d9\">OHV May4.jpg</span></span>\n<span class=\"line\"><span style=\"color: #c9d1d9\">OHV May40.jpg</span></span></code></pre>\n<p>So I simply grabbed the number from the string and renamed it from that variable.</p>\n<p>The next to parts where I create the two re-sized images, They needed to named a certain way. The second I created a new variable so the resize can come from the original file which is bigger and better quality. The First run I did make I went from original image(big) to small back to big. This made the third image pixelated and blurry obviously. I could easily just replace the order of the re-sizing, but I rather just go from the source again just for quality sake if there is one at all.</p>\n<p>Here is the code:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #FF7B72\">require</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">'rubygems'</span></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">require</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">'mini_magick'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">@sizes </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> [ </span><span style=\"color: #A5D6FF\">\"76x100\"</span><span style=\"color: #C9D1D9\">, </span><span style=\"color: #A5D6FF\">\"770x1000\"</span><span style=\"color: #C9D1D9\"> ]</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #8B949E\"># puts \"Script complete.\\n\\n\"</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">folder_path </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">\"pages\"</span></span>\n<span class=\"line\"><span style=\"color: #79C0FF\">Dir</span><span style=\"color: #C9D1D9\">.glob(folder_path </span><span style=\"color: #FF7B72\">+</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">\"/*\"</span><span style=\"color: #C9D1D9\">).sort.each </span><span style=\"color: #FF7B72\">do</span><span style=\"color: #C9D1D9\"> |f|</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">   number </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> f.scan(</span><span style=\"color: #A5D6FF\">/</span><span style=\"color: #79C0FF\">[0-9]</span><span style=\"color: #A5D6FF\">{1,}/</span><span style=\"color: #C9D1D9\">)</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #8B949E\">#rename first</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    filename </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">File</span><span style=\"color: #C9D1D9\">.basename(f, </span><span style=\"color: #79C0FF\">File</span><span style=\"color: #C9D1D9\">.extname(f))</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    renamed_file </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #A5D6FF\">#{</span><span style=\"color: #C9D1D9\">folder_path</span><span style=\"color: #A5D6FF\">}</span><span style=\"color: #A5D6FF\">/\"</span><span style=\"color: #FF7B72\">+</span><span style=\"color: #C9D1D9\">number[</span><span style=\"color: #79C0FF\">0</span><span style=\"color: #C9D1D9\">].to_s</span><span style=\"color: #FF7B72\">+</span><span style=\"color: #A5D6FF\">\"-large\"</span><span style=\"color: #FF7B72\">+</span><span style=\"color: #79C0FF\">File</span><span style=\"color: #C9D1D9\">.extname(f)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #79C0FF\">File</span><span style=\"color: #C9D1D9\">.rename(f, renamed_file)</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #8B949E\"># prints image its working on</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #79C0FF\">puts</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">\"imaging: \"</span><span style=\"color: #FF7B72\">+</span><span style=\"color: #C9D1D9\">number[</span><span style=\"color: #79C0FF\">0</span><span style=\"color: #C9D1D9\">]</span><span style=\"color: #FF7B72\">+</span><span style=\"color: #79C0FF\">File</span><span style=\"color: #C9D1D9\">.extname(f)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    file </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> number[</span><span style=\"color: #79C0FF\">0</span><span style=\"color: #C9D1D9\">]</span><span style=\"color: #FF7B72\">+</span><span style=\"color: #79C0FF\">File</span><span style=\"color: #C9D1D9\">.extname(f)</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #8B949E\"># creates 76x100 thumb</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    ri </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">MiniMagick</span><span style=\"color: #C9D1D9\">::</span><span style=\"color: #79C0FF\">Image</span><span style=\"color: #C9D1D9\">.</span><span style=\"color: #79C0FF\">open</span><span style=\"color: #C9D1D9\">(renamed_file)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    ri.resize </span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #A5D6FF\">#{</span><span style=\"color: #C9D1D9\">@sizes[</span><span style=\"color: #79C0FF\">0</span><span style=\"color: #C9D1D9\">]</span><span style=\"color: #A5D6FF\">}</span><span style=\"color: #A5D6FF\">!\"</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    ri.write </span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #A5D6FF\">#{</span><span style=\"color: #C9D1D9\">folder_path</span><span style=\"color: #A5D6FF\">}</span><span style=\"color: #A5D6FF\">/</span><span style=\"color: #A5D6FF\">#{</span><span style=\"color: #79C0FF\">File</span><span style=\"color: #C9D1D9\">.basename(file, </span><span style=\"color: #A5D6FF\">'.jpg'</span><span style=\"color: #C9D1D9\">)</span><span style=\"color: #A5D6FF\">}</span><span style=\"color: #A5D6FF\">-thumb.jpg\"</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #79C0FF\">printf</span><span style=\"color: #C9D1D9\">(</span><span style=\"color: #A5D6FF\">\"%25s - %s</span><span style=\"color: #79C0FF\">\\n</span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #C9D1D9\">, </span><span style=\"color: #A5D6FF\">\"Created: \"</span><span style=\"color: #C9D1D9\">, </span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #A5D6FF\">#{</span><span style=\"color: #79C0FF\">File</span><span style=\"color: #C9D1D9\">.basename(file, </span><span style=\"color: #A5D6FF\">'.jpg'</span><span style=\"color: #C9D1D9\">)</span><span style=\"color: #A5D6FF\">}</span><span style=\"color: #A5D6FF\">-thumb.jpg\"</span><span style=\"color: #C9D1D9\">)</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #8B949E\"># creates 770x1000</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    ri2 </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">MiniMagick</span><span style=\"color: #C9D1D9\">::</span><span style=\"color: #79C0FF\">Image</span><span style=\"color: #C9D1D9\">.</span><span style=\"color: #79C0FF\">open</span><span style=\"color: #C9D1D9\">(renamed_file)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    ri2.resize </span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #A5D6FF\">#{</span><span style=\"color: #C9D1D9\">@sizes[</span><span style=\"color: #79C0FF\">1</span><span style=\"color: #C9D1D9\">]</span><span style=\"color: #A5D6FF\">}</span><span style=\"color: #A5D6FF\">!\"</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    ri2.write </span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #A5D6FF\">#{</span><span style=\"color: #C9D1D9\">folder_path</span><span style=\"color: #A5D6FF\">}</span><span style=\"color: #A5D6FF\">/</span><span style=\"color: #A5D6FF\">#{</span><span style=\"color: #79C0FF\">File</span><span style=\"color: #C9D1D9\">.basename(file, </span><span style=\"color: #A5D6FF\">'.jpg'</span><span style=\"color: #C9D1D9\">)</span><span style=\"color: #A5D6FF\">}</span><span style=\"color: #A5D6FF\">.jpg\"</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #79C0FF\">printf</span><span style=\"color: #C9D1D9\">(</span><span style=\"color: #A5D6FF\">\"%25s - %s</span><span style=\"color: #79C0FF\">\\n</span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #C9D1D9\">, </span><span style=\"color: #A5D6FF\">\"Created: \"</span><span style=\"color: #C9D1D9\">, </span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #A5D6FF\">#{</span><span style=\"color: #79C0FF\">File</span><span style=\"color: #C9D1D9\">.basename(file, </span><span style=\"color: #A5D6FF\">'.jpg'</span><span style=\"color: #C9D1D9\">)</span><span style=\"color: #A5D6FF\">}</span><span style=\"color: #A5D6FF\">.jpg\"</span><span style=\"color: #C9D1D9\">)</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #79C0FF\">system</span><span style=\"color: #C9D1D9\">(</span><span style=\"color: #A5D6FF\">'clear'</span><span style=\"color: #C9D1D9\">)</span></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">end</span></span>\n<span class=\"line\"></span></code></pre>";

				const frontmatter = {"layout":"../../layouts/BlogLayout.astro","title":"Image Conversion","date":"2020-12-29","coverImage":"","originalDatePublished":"2014-11-18","description":"I wrote a script that allows me to take several images rename them, and then create two resized images in addition.","author":"t0nylombardi","image":"https://images.unsplash.com/photo-1655720035861-ba4fd21a598d","categories":"ruby","tags":"ruby"};
				const file = "/Users/t0nylombardi/dev/t0nylombardi/astroBlog/src/pages/blog/image-conversion.md";
				const url = "/blog/image-conversion";
				function rawContent() {
					return "\nI wrote a script that allows me to take several images rename them, and then create two resized images in addition. The specifics of the naming and re-sizing convention required me to name each image as:\n\n```\n1.jpg\n2.jpg\n3.jpg\netc.....\n```\n\nThe file name comes up as a string “OHV May1.jpg” and so on. Recursively parsing through the images came up with a hurtle. In the array of the directory the list would show:\n\n```\nOHV May39.jpg\nOHV May4.jpg\nOHV May40.jpg\n```\n\nSo I simply grabbed the number from the string and renamed it from that variable.\n\nThe next to parts where I create the two re-sized images, They needed to named a certain way. The second I created a new variable so the resize can come from the original file which is bigger and better quality. The First run I did make I went from original image(big) to small back to big. This made the third image pixelated and blurry obviously. I could easily just replace the order of the re-sizing, but I rather just go from the source again just for quality sake if there is one at all.\n\nHere is the code:\n\n```ruby\nrequire 'rubygems'\nrequire 'mini_magick'\n\n@sizes = [ \"76x100\", \"770x1000\" ]\n\n# puts \"Script complete.\\n\\n\"\nfolder_path = \"pages\"\nDir.glob(folder_path + \"/*\").sort.each do |f|\n   number = f.scan(/[0-9]{1,}/)\n\n    #rename first\n    filename = File.basename(f, File.extname(f))\n    renamed_file = \"#{folder_path}/\"+number[0].to_s+\"-large\"+File.extname(f)\n    File.rename(f, renamed_file)\n\n    # prints image its working on\n    puts \"imaging: \"+number[0]+File.extname(f)\n    file = number[0]+File.extname(f)\n\n    # creates 76x100 thumb\n    ri = MiniMagick::Image.open(renamed_file)\n    ri.resize \"#{@sizes[0]}!\"\n    ri.write \"#{folder_path}/#{File.basename(file, '.jpg')}-thumb.jpg\"\n    printf(\"%25s - %s\\n\", \"Created: \", \"#{File.basename(file, '.jpg')}-thumb.jpg\")\n\n    # creates 770x1000\n    ri2 = MiniMagick::Image.open(renamed_file)\n    ri2.resize \"#{@sizes[1]}!\"\n    ri2.write \"#{folder_path}/#{File.basename(file, '.jpg')}.jpg\"\n    printf(\"%25s - %s\\n\", \"Created: \", \"#{File.basename(file, '.jpg')}.jpg\")\n\n    system('clear')\nend\n\n```\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [];
				}
				function getHeaders() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings();
				}				async function Content() {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html });
					return createVNode($$BlogLayout, {
									content,
									frontmatter: content,
									headings: getHeadings(),
									rawContent,
									compiledContent,
									'server:root': true,
									children: contentFragment
								});
				}
				Content[Symbol.for('astro.needsHeadRendering')] = false;

const _page7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter,
	file,
	url,
	rawContent,
	compiledContent,
	getHeadings,
	getHeaders,
	Content,
	default: Content
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata = createMetadata("/@fs/Users/t0nylombardi/dev/t0nylombardi/astroBlog/src/pages/blog/[...page].astro", { modules: [{ module: $$module1, specifier: "../../layouts/BaseLayout.astro", assert: {} }, { module: moment, specifier: "moment", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro = createAstro("/@fs/Users/t0nylombardi/dev/t0nylombardi/astroBlog/src/pages/blog/[...page].astro", "", "file:///Users/t0nylombardi/dev/t0nylombardi/astroBlog/");
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const posts = await Astro2.glob(/* #__PURE__ */ Object.assign({"./Sorry-I-hacked-you.md": () => Promise.resolve().then(() => _page6),"./all-you-need-is-love.md": () => Promise.resolve().then(() => _page5),"./image-conversion.md": () => Promise.resolve().then(() => _page7),"./old-school-twitter-bot.md": () => Promise.resolve().then(() => _page3),"./parsing-an-email-list.md": () => Promise.resolve().then(() => _page4),"./tracking-pixels-in-ruby.md": () => Promise.resolve().then(() => _page2)}), () => "./*.md");
  const title = "Blog";
  Astro2.props;
  Astro2.props;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<div class="md:container md:mx-auto">
        ${posts.map((post) => renderTemplate`<div class="max-w-2xl mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 mb-4 mt-4">
                    <img class="object-cover w-full h-64"${addAttribute(post.frontmatter.image, "src")} alt="Article">

                    <div class="p-6">
                        <div>
                            <span class="text-xs font-medium text-blue-600 uppercase dark:text-blue-400">
                                ${post.frontmatter.tags}
                            </span>
                            <a${addAttribute(post.url, "href")} class="block mt-2 text-2xl font-semibold text-gray-800 transition-colors duration-200 transform dark:text-white hover:text-gray-600 hover:underline">
                                ${post.frontmatter.title}
                            </a>
                            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                ${post.frontmatter.description}
                            </p>
                        </div>

                        <div class="mt-4">
                            <div class="flex items-center">
                                <div class="flex items-center">
                                    <img class="object-cover h-10 rounded-full" src="https://placebeard.it/256x256" alt="Avatar">
                                    <a href="#" class="mx-2 font-semibold text-gray-700 dark:text-gray-200">
                                        ${post.frontmatter.author}
                                    </a>
                                </div>
                                <span class="mx-1 text-xs text-gray-600 dark:text-gray-300">
                                    ${`${moment__default(
    post.frontmatter.date
  ).fromNow()} | ${moment__default(
    post.frontmatter.date
  ).format("LL")}`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>`)}
    </div>` })}`;
});

const $$file = "/Users/t0nylombardi/dev/t0nylombardi/astroBlog/src/pages/blog/[...page].astro";
const $$url = "/blog/[...page]";

const _page8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata,
	default: $$,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const pageMap = new Map([['src/pages/index.astro', _page0],['src/pages/resume.astro', _page1],['src/pages/blog/tracking-pixels-in-ruby.md', _page2],['src/pages/blog/old-school-twitter-bot.md', _page3],['src/pages/blog/parsing-an-email-list.md', _page4],['src/pages/blog/all-you-need-is-love.md', _page5],['src/pages/blog/Sorry-I-hacked-you.md', _page6],['src/pages/blog/image-conversion.md', _page7],['src/pages/blog/[...page].astro', _page8],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),Object.assign({"name":"@astrojs/react","clientEntrypoint":"@astrojs/react/client.js","serverEntrypoint":"@astrojs/react/server.js","jsxImportSource":"react"}, { ssr: _renderer1 }),];

if (typeof process !== "undefined") {
  if (process.argv.includes("--verbose")) ; else if (process.argv.includes("--silent")) ; else ;
}

const SCRIPT_EXTENSIONS = /* @__PURE__ */ new Set([".js", ".ts"]);
new RegExp(
  `\\.(${Array.from(SCRIPT_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

const STYLE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".css",
  ".pcss",
  ".postcss",
  ".scss",
  ".sass",
  ".styl",
  ".stylus",
  ".less"
]);
new RegExp(
  `\\.(${Array.from(STYLE_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return segment[0].spread ? `/:${segment[0].content.slice(3)}(.*)?` : "/" + segment.map((part) => {
      if (part)
        return part.dynamic ? `:${part.content}` : part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  return {
    ...serializedManifest,
    assets,
    routes
  };
}

const _manifest = Object.assign(deserializeManifest({"adapterName":"@astrojs/netlify/functions","routes":[{"file":"","links":["assets/index.fc930b7f.css","assets/7db28d4b.18536c45.css"],"scripts":[],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/resume.8711ac07.css","assets/7db28d4b.18536c45.css"],"scripts":[],"routeData":{"route":"/resume","type":"page","pattern":"^\\/resume\\/?$","segments":[[{"content":"resume","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/resume.astro","pathname":"/resume","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/9f3efa96.d3d4039a.css","assets/7db28d4b.18536c45.css"],"scripts":[],"routeData":{"route":"/blog/tracking-pixels-in-ruby","type":"page","pattern":"^\\/blog\\/tracking-pixels-in-ruby\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"tracking-pixels-in-ruby","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/tracking-pixels-in-ruby.md","pathname":"/blog/tracking-pixels-in-ruby","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/9f3efa96.d3d4039a.css","assets/7db28d4b.18536c45.css"],"scripts":[],"routeData":{"route":"/blog/old-school-twitter-bot","type":"page","pattern":"^\\/blog\\/old-school-twitter-bot\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"old-school-twitter-bot","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/old-school-twitter-bot.md","pathname":"/blog/old-school-twitter-bot","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/9f3efa96.d3d4039a.css","assets/7db28d4b.18536c45.css"],"scripts":[],"routeData":{"route":"/blog/parsing-an-email-list","type":"page","pattern":"^\\/blog\\/parsing-an-email-list\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"parsing-an-email-list","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/parsing-an-email-list.md","pathname":"/blog/parsing-an-email-list","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/9f3efa96.d3d4039a.css","assets/7db28d4b.18536c45.css"],"scripts":[],"routeData":{"route":"/blog/all-you-need-is-love","type":"page","pattern":"^\\/blog\\/all-you-need-is-love\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"all-you-need-is-love","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/all-you-need-is-love.md","pathname":"/blog/all-you-need-is-love","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/9f3efa96.d3d4039a.css","assets/7db28d4b.18536c45.css"],"scripts":[],"routeData":{"route":"/blog/sorry-i-hacked-you","type":"page","pattern":"^\\/blog\\/Sorry-I-hacked-you\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"Sorry-I-hacked-you","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/Sorry-I-hacked-you.md","pathname":"/blog/Sorry-I-hacked-you","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/9f3efa96.d3d4039a.css","assets/7db28d4b.18536c45.css"],"scripts":[],"routeData":{"route":"/blog/image-conversion","type":"page","pattern":"^\\/blog\\/image-conversion\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"image-conversion","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/image-conversion.md","pathname":"/blog/image-conversion","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/9f3efa96.d3d4039a.css","assets/7db28d4b.18536c45.css"],"scripts":[],"routeData":{"route":"/blog/[...page]","type":"page","pattern":"^\\/blog(?:\\/(.*?))?\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"...page","dynamic":true,"spread":true}]],"params":["...page"],"component":"src/pages/blog/[...page].astro","_meta":{"trailingSlash":"ignore"}}}],"base":"/","markdown":{"drafts":false,"syntaxHighlight":"shiki","shikiConfig":{"langs":[],"theme":"github-dark","wrap":false},"remarkPlugins":[],"rehypePlugins":[],"isAstroFlavoredMd":false},"pageMap":null,"renderers":[],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","@astrojs/react/client.js":"client.4573567e.js","astro:scripts/before-hydration.js":"data:text/javascript;charset=utf-8,//[no before-hydration script]"},"assets":["/assets/7db28d4b.18536c45.css","/assets/9f3efa96.d3d4039a.css","/assets/index.fc930b7f.css","/assets/resume.8711ac07.css","/client.4573567e.js","/favicon.ico"]}), {
	pageMap: pageMap,
	renderers: renderers
});
const _args = {};

const _exports = adapter.createExports(_manifest, _args);
const handler = _exports['handler'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { handler };
