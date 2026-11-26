// The figures behind NationAtlas.
//
// Every number comes from the World Bank's World Development Indicators
// (WDI), reference year 2024, and is shown rounded on the site so it never
// pretends to be more exact than the source: population in millions with one
// decimal, GDP in billions of current US dollars, GDP per capita computed
// from those two and rounded to the nearest dollar.
//
// WDI figures for 2024 were revised during 2026, so different aggregators
// quote the same indicator a couple of percent apart (for example US GDP
// $28.8T-$29.3T, India $3.76T-$3.91T). The values below are the rounded
// figures the site is internally consistent on; the methodology page says
// so in plain language.
//
// Indicator codes: population SP.POP.TOTL, GDP (nominal, current US$)
// NY.GDP.MKTP.CD, GDP per capita NY.GDP.PCAP.CD.

export const SOURCE = 'World Bank WDI';
export const YEAR = 2024;

export const WORLD = {
  populationMillions: 8141.8,
  gdpBillions: 111300,
};

// The twelve most populous countries, 2024. Population is the mid-year
// estimate; GDP is nominal, in current US dollars.
export const COUNTRIES = [
  { slug: 'india', name: 'India', region: 'South Asia', population: 1450.9, gdp: 3910 },
  { slug: 'china', name: 'China', region: 'East Asia', population: 1409.0, gdp: 18740 },
  { slug: 'united-states', name: 'United States', region: 'North America', population: 340.1, gdp: 29020 },
  { slug: 'indonesia', name: 'Indonesia', region: 'Southeast Asia', population: 283.5, gdp: 1400 },
  { slug: 'pakistan', name: 'Pakistan', region: 'South Asia', population: 251.3, gdp: 370 },
  { slug: 'nigeria', name: 'Nigeria', region: 'West Africa', population: 232.7, gdp: 190 },
  { slug: 'brazil', name: 'Brazil', region: 'South America', population: 212.0, gdp: 2170 },
  { slug: 'russia', name: 'Russia', region: 'Europe & North Asia', population: 143.5, gdp: 2190 },
  { slug: 'mexico', name: 'Mexico', region: 'North America', population: 130.9, gdp: 1830 },
  { slug: 'japan', name: 'Japan', region: 'East Asia', population: 124.0, gdp: 4030 },
  { slug: 'germany', name: 'Germany', region: 'Western Europe', population: 83.5, gdp: 4690 },
  { slug: 'united-kingdom', name: 'United Kingdom', region: 'Northern Europe', population: 69.2, gdp: 3650 },
];

// --- Derived figures. Everything the site displays about a country is
// computed here, from the two columns above, so the pages can never
// disagree with each other.

export function gdpPerCapita(country) {
  return Math.round((country.gdp * 1000) / country.population);
}

export function populationShare(country) {
  return (country.population / WORLD.populationMillions) * 100;
}

export function gdpShare(country) {
  return (country.gdp / WORLD.gdpBillions) * 100;
}

export function worldGdpPerCapita() {
  return Math.round((WORLD.gdpBillions * 1000) / WORLD.populationMillions);
}

export function totals() {
  const population = COUNTRIES.reduce((sum, c) => sum + c.population, 0);
  const gdp = COUNTRIES.reduce((sum, c) => sum + c.gdp, 0);
  return {
    population,
    gdp,
    populationShare: (population / WORLD.populationMillions) * 100,
    gdpShare: (gdp / WORLD.gdpBillions) * 100,
  };
}

// Rank of a country (1 = largest) by one of 'population', 'gdp' or
// 'perCapita'. Ranks are computed from the same data the tables sort.
export function rankOf(country, key) {
  const value =
    key === 'population'
      ? (c) => c.population
      : key === 'gdp'
        ? (c) => c.gdp
        : (c) => gdpPerCapita(c);
  const sorted = [...COUNTRIES].sort((a, b) => value(b) - value(a));
  return sorted.findIndex((c) => c.slug === country.slug) + 1;
}

export function sortedBy(key, descending = true) {
  const value =
    key === 'population'
      ? (c) => c.population
      : key === 'gdp'
        ? (c) => c.gdp
        : (c) => gdpPerCapita(c);
  const sorted = [...COUNTRIES].sort((a, b) => value(a) - value(b));
  return descending ? sorted.reverse() : sorted;
}

export function findCountry(slug) {
  return COUNTRIES.find((c) => c.slug === slug);
}

// The largest economy of the twelve, so a page can name the leader without
// hardcoding a figure that would go stale if the data changed.
export function topEconomy() {
  return sortedBy('gdp')[0];
}

// --- Formatting. One place formats every number on the site, so a figure
// reads the same on the dashboard, a profile and a table.

export function formatPopulation(millions) {
  return `${millions.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} million`;
}

export function formatGdp(billions) {
  if (billions >= 1000) {
    return `$${(billions / 1000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} trillion`;
  }
  return `$${billions.toLocaleString('en-US')} billion`;
}

export function formatDollars(amount) {
  return `$${Math.round(amount).toLocaleString('en-US')}`;
}

export function formatPercent(value) {
  return `${value.toFixed(1)}%`;
}

export function sourceLine() {
  return `Source: ${SOURCE}, ${YEAR}`;
}
