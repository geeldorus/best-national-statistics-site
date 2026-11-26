// Charts for NationAtlas, drawn as inline SVG from the site's own data.
// No chart library, no network: every bar is a rectangle whose length is a
// share of the largest value in the set it shows.

import { formatGdp } from './data.js';

const escape = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

// Horizontal bars: one row per item, label on the left, value on the right.
// `items` is [{ label, value, note }]; `format` turns a value into text.
export function horizontalBars(items, format, { highlight = 0 } = {}) {
  const max = Math.max(...items.map((item) => item.value));
  const rows = items
    .map((item, index) => {
      const width = Math.max((item.value / max) * 100, 1.5);
      const strong = index === highlight;
      return `<div class="bar-row${strong ? ' bar-row--top' : ''}">
  <span class="bar-label">${escape(item.label)}</span>
  <span class="bar-track"><span class="bar-fill" style="width:${width.toFixed(1)}%"></span></span>
  <span class="bar-value">${escape(format(item.value))}</span>
</div>`;
    })
    .join('');
  return `<div class="bars" role="img" aria-label="Bar chart">${rows}</div>`;
}

// A compact vertical bar chart of GDP for a list of countries, with the
// tallest bar labelled. Built as one SVG so it scales cleanly on a phone.
export function gdpColumns(countries, { height = 190, highlightSlug = null } = {}) {
  const width = 640;
  const padLeft = 8;
  const padBottom = 26;
  const padTop = 26;
  const max = Math.max(...countries.map((c) => c.gdp));
  const slot = (width - padLeft * 2) / countries.length;
  const barWidth = Math.min(34, slot * 0.62);
  const chartHeight = height - padTop - padBottom;

  const columns = countries
    .map((c, i) => {
      const x = padLeft + slot * i + (slot - barWidth) / 2;
      const barHeight = (c.gdp / max) * chartHeight;
      const y = padTop + (chartHeight - barHeight);
      const top = c.slug === highlightSlug;
      const fill = top ? '#c2571b' : '#274b6d';
      const label = c.gdp >= 1000 ? `$${(c.gdp / 1000).toFixed(2)}T` : `$${c.gdp}B`;
      return `<g>
  <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${barHeight.toFixed(1)}" rx="2" fill="${fill}">
    <title>${escape(c.name)}: ${escape(formatGdp(c.gdp))}</title>
  </rect>
  <text x="${(x + barWidth / 2).toFixed(1)}" y="${(y - 6).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="#14273d">${label}</text>
  <text x="${(x + barWidth / 2).toFixed(1)}" y="${(height - 8).toFixed(1)}" text-anchor="middle" font-size="11" fill="#43566b">${escape(shortName(c.name))}</text>
</g>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${width} ${height}" class="chart-svg" role="img" aria-label="GDP by country, 2024">${columns}
  <line x1="${padLeft}" y1="${padTop + chartHeight}" x2="${width - padLeft}" y2="${padTop + chartHeight}" stroke="#c8cfd6" stroke-width="1" />
</svg>`;
}

// Two bars side by side for the compare page: each country's share of the
// larger value, so the difference is visible at a glance.
export function compareBars(a, b, label, format) {
  const max = Math.max(a.value, b.value);
  const row = (entry) => {
    const width = Math.max((entry.value / max) * 100, 2);
    return `<div class="compare-bar-row">
  <span class="compare-bar-name">${escape(entry.name)}</span>
  <span class="bar-track"><span class="bar-fill" style="width:${width.toFixed(1)}%"></span></span>
  <span class="bar-value">${escape(format(entry.value))}</span>
</div>`;
  };
  return `<section class="compare-metric">
  <h3>${escape(label)}</h3>
  ${row(a)}${row(b)}
</section>`;
}

function shortName(name) {
  return name.replace('United States', 'USA').replace('United Kingdom', 'UK');
}
