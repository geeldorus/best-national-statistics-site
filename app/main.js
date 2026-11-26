// NationAtlas: the router and the page interactions. The pages are hash
// routes, so the whole site is one static index.html and works from any
// static server:
//
//   #/                    the overview dashboard
//   #/rankings            the sortable rankings table and chart
//   #/country/<slug>     one country's profile
//   #/compare?a=x&b=y    the two-country comparison
//   #/method              sources and methodology
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { compare, country, dashboard, method, missing, rankings } from './views.js';

const app = document.getElementById('app');
const navLinks = [...document.querySelectorAll('[data-route]')];

let sortKey = 'gdp';
let sortDescending = true;

function parseHash() {
  const hash = location.hash.replace(/^#/, '') || '/';
  const [path, query = ''] = hash.split('?');
  return { path, params: new URLSearchParams(query) };
}

function render() {
  window.__shotReady = false;
  const { path, params } = parseHash();
  let html;
  let title = 'NationAtlas — National Statistics 2024';

  const countryMatch = path.match(/^\/country\/([^/]+)$/);
  if (path === '/' || path === '') {
    html = dashboard();
  } else if (path === '/rankings') {
    html = rankings(sortKey, sortDescending);
    title = 'Rankings | NationAtlas';
  } else if (countryMatch) {
    html = country(decodeURIComponent(countryMatch[1]));
    title = `${titleCase(countryMatch[1])} | NationAtlas`;
  } else if (path === '/compare') {
    html = compare(params.get('a') ?? undefined, params.get('b') ?? undefined);
    title = 'Compare countries | NationAtlas';
  } else if (path === '/method') {
    html = method();
    title = 'Methodology & sources | NationAtlas';
  } else {
    html = missing();
    title = 'Not found | NationAtlas';
  }

  document.title = title;
  app.innerHTML = html;
  navLinks.forEach((link) => {
    if (link.dataset.route === currentRoute(path)) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function currentRoute(path) {
  if (path === '/' || path === '') return 'overview';
  if (path === '/rankings') return 'rankings';
  if (path.startsWith('/country/')) return 'country';
  if (path === '/compare') return 'compare';
  if (path === '/method') return 'method';
  return '';
}

function titleCase(slug) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Sorting and comparing are handled by delegation on the rendered page:
// the sort buttons re-render the rankings with a new key and direction,
// the compare menus re-render the comparison with new countries.
app.addEventListener('click', (event) => {
  const button = event.target.closest('[data-sort]');
  if (!button) return;
  const key = button.dataset.sort;
  if (key === sortKey) {
    sortDescending = !sortDescending;
  } else {
    sortKey = key;
    sortDescending = true;
  }
  render();
});

app.addEventListener('change', (event) => {
  if (event.target.id !== 'compare-a' && event.target.id !== 'compare-b') return;
  const a = document.getElementById('compare-a').value;
  const b = document.getElementById('compare-b').value;
  history.replaceState(null, '', `#/compare?a=${a}&b=${b}`);
  render();
});

window.addEventListener('hashchange', render);
render();
