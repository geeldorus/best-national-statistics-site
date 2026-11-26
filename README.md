# NationAtlas — National Statistics 2024

[![Competition](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/geeldorus/best-national-statistics-site/rank.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/geeldorus/best-national-statistics-site/reward.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)

A national statistics site for the twelve most populous countries on Earth:
population, GDP and GDP per person, every figure from the World Bank's World
Development Indicators (WDI), reference year 2024.

## What it does

- **Overview dashboard** — world totals (8.14 billion people, $111.3 trillion
  GDP), the five largest economies as bars, a GDP chart of all twelve, and the
  full country table.
- **Country profiles** — one page per country with its population, GDP, GDP per
  person, world rank, share of world totals, and a chart of its GDP beside the
  largest economies.
- **Rankings** — the twelve countries in a table that re-sorts when you click a
  column heading (population, GDP, GDP per person), with the chart re-sorting
  along with it.
- **Compare** — pick any two countries and see their figures side by side with
  a bar comparison and a plain-language verdict.
- **Methodology** — every indicator with its WDI code, source and year, plus
  the rounding and revision-vintage notes.

Every figure on the site shows its source and year next to it
("Source: World Bank WDI, 2024"). The site is plain static files under `app/`
with no build step and no network requests: charts are hand-drawn SVG from the
site's own data, and it works on a desktop and on a phone.

## Run it

```sh
node serve.ts   # then open http://localhost:8080
```

Screenshots of the running site live in `screenshots/` (see `shots.json`
for which view each one shows); the first by name is the cover.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Data

All figures: World Bank, World Development Indicators, 2024. Population is
the mid-year estimate (SP.POP.TOTL); GDP is nominal, current US$
(NY.GDP.MKTP.CD); GDP per person is GDP divided by population
(NY.GDP.PCAP.CD). WDI 2024 figures were revised during 2026, so different
aggregators quote the same indicator a couple of percent apart; the values
here are one consistent vintage, rounded for reading.
