// HTML for every page of NationAtlas, built from the data in data.js.
// Every figure carries its source and year; every link is a hash route the
// router in main.js knows; nothing here fetches anything.

import {
  COUNTRIES,
  WORLD,
  YEAR,
  findCountry,
  formatDollars,
  formatGdp,
  formatPercent,
  formatPopulation,
  gdpPerCapita,
  gdpShare,
  populationShare,
  rankOf,
  sortedBy,
  sourceLine,
  topEconomy,
  totals,
  worldGdpPerCapita,
} from './data.js';
import { compareBars, gdpColumns, horizontalBars } from './charts.js';

const escape = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

function countryLink(country) {
  return `<a href="#/country/${country.slug}">${escape(country.name)}</a>`;
}

function rankBadge(label, rank) {
  return `<span class="rank-badge">${escape(label)} #${rank} of 12</span>`;
}

// A row of the three world totals, used at the top of the dashboard.
function worldTiles() {
  const t = totals();
  return `<section class="tiles" aria-label="World totals, 2024">
  <article class="tile">
    <p class="tile-label">World population</p>
    <p class="tile-value">8.14 billion</p>
    <p class="tile-note">8,141.8 million people · ${escape(sourceLine())}</p>
  </article>
  <article class="tile">
    <p class="tile-label">World GDP</p>
    <p class="tile-value">$111.3 trillion</p>
    <p class="tile-note">Nominal, current US$ · ${escape(sourceLine())}</p>
  </article>
  <article class="tile">
    <p class="tile-label">World GDP per person</p>
    <p class="tile-value">${formatDollars(worldGdpPerCapita())}</p>
    <p class="tile-note">World GDP divided by world population · ${escape(sourceLine())}</p>
  </article>
  <article class="tile tile--cover">
    <p class="tile-label">Countries on this site</p>
    <p class="tile-value">12</p>
    <p class="tile-note">The 12 most populous nations — ${formatPercent(t.populationShare)} of all people, ${formatPercent(t.gdpShare)} of world GDP</p>
  </article>
</section>`;
}

export function dashboard() {
  const topFive = sortedBy('gdp').slice(0, 5);
  const byGdp = sortedBy('gdp');
  const rows = byGdp
    .map(
      (c) => `<tr>
  <td>${rankOf(c, 'gdp')}</td>
  <td>${countryLink(c)}</td>
  <td>${formatPopulation(c.population)}</td>
  <td>${formatGdp(c.gdp)}</td>
  <td>${formatDollars(gdpPerCapita(c))}</td>
</tr>`,
    )
    .join('');
  return `<p class="kicker">National statistics · ${YEAR}</p>
<h1>The world in numbers</h1>
<p class="lede">Population, GDP and GDP per person for the twelve most populous countries on Earth — each figure with its source and year, nothing estimated, nothing hidden.</p>
${worldTiles()}
<section class="panel-grid">
  <article class="panel">
    <h2>Largest economies</h2>
    <p class="panel-note">GDP, nominal, current US$ · ${escape(sourceLine())}</p>
    ${horizontalBars(
      topFive.map((c) => ({ label: c.name, value: c.gdp })),
      (v) => formatGdp(v),
    )}
    <p class="panel-link"><a href="#/rankings">See the full ranking &rarr;</a></p>
  </article>
  <article class="panel">
    <h2>GDP of all twelve</h2>
    <p class="panel-note">Nominal GDP, ${YEAR} · ${escape(sourceLine())}</p>
    ${gdpColumns(byGdp, { highlightSlug: 'united-states' })}
    <p class="panel-link"><a href="#/country/united-states">United States profile &rarr;</a></p>
  </article>
</section>
<section class="panel">
  <h2>All twelve countries</h2>
  <p class="panel-note">Click a country for its full profile. Figures: ${escape(sourceLine())}.</p>
  <div class="table-wrap"><table class="data-table">
    <thead><tr><th>GDP rank</th><th>Country</th><th>Population</th><th>GDP</th><th>GDP per person</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>
  <p class="panel-link"><a href="#/compare">Compare any two countries &rarr;</a> · <a href="#/method">How the figures were made &rarr;</a></p>
</section>`;
}

export function rankings(sortKey = 'gdp', descending = true) {
  const list = sortedBy(sortKey, descending);
  const arrow = descending ? ' ▼' : ' ▲';
  const header = (key, label) =>
    `<th><button class="sort-btn" data-sort="${key}" aria-sort="${sortKey === key ? (descending ? 'descending' : 'ascending') : 'none'}">${label}${sortKey === key ? arrow : ''}</button></th>`;
  const rows = list
    .map(
      (c) => `<tr>
  <td>${rankOf(c, sortKey)}</td>
  <td>${countryLink(c)}</td>
  <td>${formatPopulation(c.population)}</td>
  <td>${formatGdp(c.gdp)}</td>
  <td>${formatDollars(gdpPerCapita(c))}</td>
  <td>${formatPercent(populationShare(c))}</td>
  <td>${formatPercent(gdpShare(c))}</td>
</tr>`,
    )
    .join('');
  const chartLabel =
    sortKey === 'population' ? 'Population (millions)' : sortKey === 'gdp' ? 'GDP (US$ billions)' : 'GDP per person (US$)';
  return `<p class="kicker">Rankings · ${YEAR}</p>
<h1>Rankings</h1>
<p class="lede">The same twelve countries, ordered by the measure you choose. Click any column heading to re-sort the table and the chart together.</p>
<section class="panel">
  <h2>${escape(chartLabel)}</h2>
  <p class="panel-note">Sorted by ${escape(sortKey === 'population' ? 'population' : sortKey === 'gdp' ? 'GDP' : 'GDP per person')} · ${escape(sourceLine())}</p>
  ${horizontalBars(
    list.map((c) => ({
      label: c.name,
      value: sortKey === 'population' ? c.population : sortKey === 'gdp' ? c.gdp : gdpPerCapita(c),
    })),
    (v) => (sortKey === 'population' ? formatPopulation(v) : sortKey === 'gdp' ? formatGdp(v) : formatDollars(v)),
  )}
</section>
<section class="panel">
  <h2>Full table</h2>
  <p class="panel-note">All figures: ${escape(sourceLine())}.</p>
  <div class="table-wrap"><table class="data-table">
    <thead><tr><th>Rank</th><th>Country</th>${header('population', 'Population')}${header('gdp', 'GDP')}${header('perCapita', 'GDP per person')}<th>Share of world population</th><th>Share of world GDP</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>
</section>`;
}

export function country(slug) {
  const c = findCountry(slug);
  if (!c) return missing();
  const pc = gdpPerCapita(c);
  const worldPc = worldGdpPerCapita();
  const vsWorld = Math.round((pc / worldPc) * 100);
  const byGdp = sortedBy('gdp');
  const gdpRank = rankOf(c, 'gdp');
  const popRank = rankOf(c, 'population');
  const pcRank = rankOf(c, 'perCapita');
  const neighbours = [byGdp[gdpRank - 2], byGdp[gdpRank]].filter(Boolean);
  const neighbourLinks = neighbours
    .map((n) => `${countryLink(n)} (${formatGdp(n.gdp)})`)
    .join(' and ');
  const popPart =
    popRank === 1
      ? 'the most populous country in the world'
      : `the ${ordinal(popRank)} most populous country in the world`;
  const gdpPart =
    gdpRank === 1 ? 'the largest economy' : `the ${ordinal(gdpRank)} largest economy`;
  return `<p class="kicker"><a href="#/">&larr; All countries</a> · ${escape(c.region)}</p>
<h1>${escape(c.name)}</h1>
<p class="lede">${escape(c.name)} is ${popPart} and ${gdpPart}, in ${YEAR} figures.</p>
<p class="badges">${rankBadge('Population', popRank)} ${rankBadge('GDP', gdpRank)} ${rankBadge('GDP per person', pcRank)}</p>
<section class="tiles" aria-label="${escape(c.name)} key figures">
  <article class="tile">
    <p class="tile-label">Population</p>
    <p class="tile-value">${formatPopulation(c.population)}</p>
    <p class="tile-note">${formatPercent(populationShare(c))} of the world's people · ${escape(sourceLine())}</p>
  </article>
  <article class="tile">
    <p class="tile-label">GDP</p>
    <p class="tile-value">${formatGdp(c.gdp)}</p>
    <p class="tile-note">${formatPercent(gdpShare(c))} of world GDP · ${escape(sourceLine())}</p>
  </article>
  <article class="tile">
    <p class="tile-label">GDP per person</p>
    <p class="tile-value">${formatDollars(pc)}</p>
    <p class="tile-note">${vsWorld}% of the world average (${formatDollars(worldPc)}) · ${escape(sourceLine())}</p>
  </article>
</section>
<section class="panel-grid">
  <article class="panel">
    <h2>GDP beside the largest economies</h2>
    <p class="panel-note">Nominal GDP, ${YEAR} · ${escape(sourceLine())}</p>
    ${gdpColumns(sortedBy('gdp').slice(0, 6), { highlightSlug: c.slug })}
    <p class="panel-note">${escape(c.name)} is highlighted in rust where it appears in the top six; ${escape(topEconomy().name)} leads at ${formatGdp(topEconomy().gdp)}.</p>
  </article>
  <article class="panel">
    <h2>At a glance</h2>
    <dl class="facts">
      <dt>Region</dt><dd>${escape(c.region)}</dd>
      <dt>People</dt><dd>${formatPopulation(c.population)} — ${formatPercent(populationShare(c))} of everyone on Earth</dd>
      <dt>Economy</dt><dd>${formatGdp(c.gdp)} — ${formatPercent(gdpShare(c))} of world GDP</dd>
      <dt>Per person</dt><dd>${formatDollars(pc)}, ${vsWorld}% of the world average</dd>
      <dt>Nearest economies</dt><dd>${neighbourLinks ? `Ranked beside ${neighbourLinks} by GDP.` : 'The largest economy of the twelve.'}</dd>
    </dl>
    <p class="panel-link"><a href="#/compare?a=${c.slug}">Compare ${escape(c.name)} with another country &rarr;</a></p>
    <p class="panel-link"><a href="#/rankings">Back to the rankings &rarr;</a></p>
  </article>
</section>
<p class="source-foot">All figures: ${escape(sourceLine())}. Population is the mid-year estimate (WDI SP.POP.TOTL); GDP is nominal, current US$ (WDI NY.GDP.MKTP.CD); GDP per person is GDP divided by population (WDI NY.GDP.PCAP.CD). See <a href="#/method">Methodology</a> for the full notes.</p>`;
}

export function compare(aSlug, bSlug) {
  const a = findCountry(aSlug) ?? COUNTRIES[2];
  const b = findCountry(bSlug) ?? COUNTRIES[0];
  const options = (selected) =>
    COUNTRIES.map((c) => `<option value="${c.slug}"${c.slug === selected ? ' selected' : ''}>${escape(c.name)}</option>`).join('');
  const bigger = a.gdp >= b.gdp ? a : b;
  const smaller = a.gdp >= b.gdp ? b : a;
  const times = (bigger.gdp / smaller.gdp).toFixed(1);
  const pcGap = Math.abs(gdpPerCapita(a) - gdpPerCapita(b));
  const richer = gdpPerCapita(a) >= gdpPerCapita(b) ? a : b;
  return `<p class="kicker">Compare · ${YEAR}</p>
<h1>Compare two countries</h1>
<p class="lede">Pick any two of the twelve and see their figures side by side. Change either menu and the comparison updates at once.</p>
<section class="panel">
  <form class="compare-form" id="compare-form">
    <label>First country
      <select id="compare-a" name="a">${options(a.slug)}</select>
    </label>
    <span class="compare-vs" aria-hidden="true">vs</span>
    <label>Second country
      <select id="compare-b" name="b">${options(b.slug)}</select>
    </label>
  </form>
  <div class="compare-cards">
    ${compareCard(a)}
    ${compareCard(b)}
  </div>
  ${compareBars({ name: a.name, value: a.population }, { name: b.name, value: b.population }, 'Population', formatPopulation)}
  ${compareBars({ name: a.name, value: a.gdp }, { name: b.name, value: b.gdp }, 'GDP', formatGdp)}
  ${compareBars({ name: a.name, value: gdpPerCapita(a) }, { name: b.name, value: gdpPerCapita(b) }, 'GDP per person', formatDollars)}
  <p class="compare-verdict">${escape(bigger.name)}'s economy is ${times} times ${escape(smaller.name)}'s. Per person, ${escape(richer.name)} is ahead by ${formatDollars(pcGap)} a year. All figures: ${escape(sourceLine())}.</p>
</section>`;
}

function compareCard(c) {
  return `<article class="compare-card">
  <h2><a href="#/country/${c.slug}">${escape(c.name)}</a></h2>
  <p class="compare-card-region">${escape(c.region)}</p>
  <dl class="facts">
    <dt>Population</dt><dd>${formatPopulation(c.population)}</dd>
    <dt>GDP</dt><dd>${formatGdp(c.gdp)}</dd>
    <dt>GDP per person</dt><dd>${formatDollars(gdpPerCapita(c))}</dd>
    <dt>World share</dt><dd>${formatPercent(populationShare(c))} of people · ${formatPercent(gdpShare(c))} of GDP</dd>
  </dl>
</article>`;
}

export function method() {
  return `<p class="kicker">Methodology</p>
<h1>Where every number comes from</h1>
<p class="lede">NationAtlas shows one dataset only: the World Bank's World Development Indicators (WDI) for 2024. No figure is estimated, modelled or taken from another source.</p>
<section class="panel">
  <h2>Indicators</h2>
  <div class="table-wrap"><table class="data-table">
    <thead><tr><th>Indicator</th><th>WDI code</th><th>Source</th><th>Year</th><th>Notes</th></tr></thead>
    <tbody>
      <tr><td>Population, total</td><td>SP.POP.TOTL</td><td>World Bank WDI</td><td>2024</td><td>Mid-year estimate, all residents regardless of citizenship.</td></tr>
      <tr><td>GDP, nominal</td><td>NY.GDP.MKTP.CD</td><td>World Bank WDI</td><td>2024</td><td>Current US dollars; market exchange rates, not purchasing-power parity.</td></tr>
      <tr><td>GDP per capita</td><td>NY.GDP.PCAP.CD</td><td>World Bank WDI</td><td>2024</td><td>GDP divided by mid-year population; shown rounded to the nearest dollar.</td></tr>
      <tr><td>World population</td><td>SP.POP.TOTL</td><td>World Bank WDI</td><td>2024</td><td>8,141.8 million people.</td></tr>
      <tr><td>World GDP</td><td>NY.GDP.MKTP.CD</td><td>World Bank WDI</td><td>2024</td><td>About $111.3 trillion; aggregations differ by a fraction of a percent.</td></tr>
    </tbody>
  </table></div>
</section>
<section class="panel">
  <h2>Rounding and revisions</h2>
  <p>Figures are rounded for reading: population to one decimal of a million, GDP to two decimals of a trillion (or whole billions below $1 trillion), GDP per person to the nearest dollar. A rounded figure never implies false precision — the site prints "$3.91 trillion", not six decimals.</p>
  <p>WDI figures for 2024 were revised during 2026, so different aggregators quote the same indicator a couple of percent apart: US GDP is quoted between $28.8T and $29.3T, India between $3.76T and $3.91T. The values on this site are one consistent vintage of the 2024 WDI release; where two aggregators disagree, this site follows the World Bank's own table.</p>
  <p>Shares of world totals are computed from the same rounded figures, so a share can differ by a tenth of a percent from one computed from unrounded data.</p>
</section>
<section class="panel">
  <h2>Coverage</h2>
  <p>The site covers the twelve most populous countries. Together they hold ${formatPercent(totals().populationShare)} of the world's people and ${formatPercent(totals().gdpShare)} of world GDP. Countries outside the twelve are not shown, rather than shown with older or weaker data.</p>
  <p><a href="#/">Back to the overview &rarr;</a></p>
</section>`;
}

export function missing() {
  return `<h1>Not found</h1>
<p>There is no country at this address. <a href="#/">See all twelve countries</a>.</p>`;
}

function ordinal(n) {
  const words = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth'];
  return words[n - 1] ?? `${n}th`;
}
