<script lang="ts">
	import {
		barChartBackgroundColors,
		genderHeaders,
		vitalstatusHeaders
	} from './config/environment';
	import { catalogueText } from './services/catalogue.service';
	import '@samply/lens/style.css';
	import '@samply/lens';
	import ScrollToTop from './services/tools/top-anker.svelte';

	let catalogueopen = false;
	//let catalogueCollapsable = true;

	/*
	let mobileNavOpen = false;
	const toggleMobileNav = () => {
		mobileNavOpen = !mobileNavOpen;
	};

	window.addEventListener('resize', () => {
		if (window.innerWidth <= 768) {
			mobileNavOpen = false;
			catalogueCollapsable = true;
		} else if (window.innerWidth > 768 && window.innerWidth < 1024) {
			mobileNavOpen = true;
			catalogueCollapsable = true;
		} else if (window.innerWidth >= 1024) {
			catalogueCollapsable = false;
		}
	});

	if (window.innerWidth >= 1024) {
		catalogueCollapsable = false;
	}
*/

	import type { Catalogue, SpotResult } from '@samply/lens';
	import {
		setOptions,
		setCatalogue,
		clearSiteResults,
		markSiteClaimed,
		setSiteResult,
		querySpot,
		getAst
	} from '@samply/lens';

	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import { options } from './lib/env-options';
	import catalogueProd from './config/catalogue.json';
	import catalogueTest from './config/catalogue-from-lens1.json';

	let abortController = new AbortController();
	window.addEventListener('lens-search-triggered', () => {
		abortController.abort();
		abortController = new AbortController();

		clearSiteResults();

		const query = btoa(
			JSON.stringify({
				lang: 'ast',
				payload: btoa(JSON.stringify({ ast: getAst(), id: crypto.randomUUID() }))
			})
		);
		querySpot(query, abortController.signal, (result: SpotResult) => {
			const site = result.from.split('.')[1];
			if (result.status === 'claimed') {
				markSiteClaimed(site);
			} else if (result.status === 'succeeded') {
				const siteResult = JSON.parse(atob(result.body));
				console.log(siteResult);
				setSiteResult(site, siteResult);
			} else {
				console.error(`Site ${site} failed with status ${result.status}:`, result.body);
			}
		});
	});
	onMount(() => {
		setOptions(options);

		// Set the catalogue based on the environment
		let catalogue = catalogueProd as Catalogue;
		if (env.PUBLIC_ENVIRONMENT === 'test') {
			catalogue = catalogueTest as Catalogue;
		}
		setCatalogue(catalogue);
	});
</script>

<header>
	<div class="logo">
		<a href="https://nngm.de">
			<img
				src="../assets/images/logo-nngm-nationales-netzwerk-genomische-medizin-lungenkrebs.svg"
				alt="nNGM"
			/>
		</a>
		<span class="ccp-header">Deutsche Krebshilfe (DKH)</span>
	</div>
	<!--<button class="burger-menu-button" on:click="{toggleMobileNav}">
		<div></div>
		<div></div>
		<div></div>
	</button>
	{#if mobileNavOpen}
		<div>
			<nav>
				<ul>
					<li>
						<a href="https://dashboard.eucaim.cancerimage.eu/">HOME</a>
					</li>
					<li>
						<a href="https://catalogue.eucaim.cancerimage.eu/">PUBLIC CATALOGUE</a>
					</li>
					<li>
						<a href="https://help.cancerimage.eu/#login">HELPDESK</a>
					</li>
				</ul>
			</nav>
		</div>
	{/if}-->
</header>

<main>
	<div class="search">
		<div class="search-wrapper">
			<lens-search-bar-multiple noMatchesFoundMessage="keine Ergebnisse gefunden"
			></lens-search-bar-multiple>
			<!--<lens-info-button
				noQueryMessage="Leere Suchanfrage: Sucht nach allen Ergebnissen."
				showQuery="{true}"
			></lens-info-button>-->
			<lens-query-explain-button
				noQueryMessage="Leere Suchanfrage: Sucht nach allen Ergebnissen."
			></lens-query-explain-button>
			<lens-search-button title="Suchen"></lens-search-button>
		</div>
	</div>
	<div class="grid">
		<div class="catalogue-wrapper">
			<div class="catalogue">
				<h2>
					Suchkriterien
					<lens-info-button
						message={[
							`Bei Patienten mit mehreren onkologischen Diagnosen, können sich ausgewählte Suchkriterien nicht nur auf eine Erkrankung beziehen, sondern auch auf Weitere.`,
							`Innerhalb einer Kategorie werden verschiedene Ausprägungen mit einer „Oder-Verknüpfung“ gesucht; bei der Suche über mehrere Kategorien mit einer „Und-Verknüpfung“.`
						]}
					></lens-info-button>
				</h2>
				<lens-catalogue
					toggleIconUrl="right-arrow-svgrepo-com.svg"
					addIconUrl="long-right-arrow-svgrepo-com.svg"
					infoIconUrl="info-circle-svgrepo-com.svg"
					texts={catalogueText}
					toggle={{ collapsable: false, open: catalogueopen }}
				></lens-catalogue>
			</div>
		</div>
		<div class="charts">
			<div class="chart-wrapper result-summary">
				<lens-result-summary></lens-result-summary>
				<lens-search-modified-display
					>Diagramme repräsentieren nicht mehr die aktuelle Suche!</lens-search-modified-display
				>
			</div>
			<div class="chart-wrapper chart-diagnosis">
				<lens-chart
					title="Diagnose"
					catalogueGroupCode="diagnosis"
					dataKey="diagnosis"
					chartType="bar"
					indexAxis="y"
					groupingDivider="."
					groupingLabel=".%"
					filterRegex="^[CD].*"
					xAxisTitle="Anzahl der Diagnosen"
					yAxisTitle="ICD-10-Codes"
					backgroundColor={barChartBackgroundColors}
				></lens-chart>
			</div>

			<div class="chart-wrapper result-table">
				<lens-result-table pageSize="10">
					<div slot="above-pagination" class="result-table-hint-text">
						* Umfasst Gewebe- und flüssige Proben. Die Anzahl der FFPE-Proben (Schätzung)
						entspricht der Zahl der Diagnosen.
					</div>
				</lens-result-table>
			</div>
			<div class="chart-wrapper">
				<lens-chart
					title="Geschlecht"
					catalogueGroupCode="gender"
					dataKey="gender"
					chartType="pie"
					displayLegends={true}
					headers={genderHeaders}
				></lens-chart>
			</div>
			<div class="chart-wrapper chart-age-distribution">
				<lens-chart
					title="Alter bei Erstdiagnose"
					dataKey="age_at_diagnosis"
					chartType="bar"
					groupRange={10}
					filterRegex="^(1*[12]*[0-9])"
					xAxisTitle="Alter"
					yAxisTitle="Anzahl der Primärdiagnosen"
					backgroundColor={barChartBackgroundColors}
				></lens-chart>
			</div>
			<div class="chart-wrapper">
				<lens-chart
					title="Vitalstatus"
					catalogueGroupCode="vital"
					dataKey="75186-7"
					chartType="pie"
					displayLegends={true}
					headers={vitalstatusHeaders}
				></lens-chart>
			</div>
			<!--<div class="chart-wrapper">
				<lens-chart
					title="Proben"
					catalogueGroupCode="sample_kind"
					chartType="bar"
					xAxisTitle="Probentypen"
					yAxisTitle="Probenanzahl"
					filterRegex="^(?!(tissue-other|buffy-coat|peripheral-blood-cells|dried-whole-blood|swab|ascites|stool-faeces|saliva|liquid-other|derivative-other))"
					backgroundColor="{JSON.stringify(barChartBackgroundColors)}"
				>
				</lens-chart>
			</div>-->
		</div>
	</div>
	<div class="credits">
		<p>
			This federated search was made with the open source <a
				href="https://github.com/samply/">Samply tools</a
			>
			(<a href="https://github.com/samply/lens/">Lens</a>,
			<a href="https://github.com/samply/beam/">Beam</a>,
			<a href="https://github.com/samply/focus/">Focus</a>,
			<a href="https://github.com/samply/bridgehead/">Bridgehead</a>), created by the
			<a href="https://www.dkfz.de/en/verbis/">German Cancer Research Center (DKFZ)</a>.
		</p>
	</div>
</main>

<footer>
	<div class="logo">
		<a href="https://nngm.de">
			<img
				src="../assets/images/logo-nngm-nationales-netzwerk-genomische-medizin-lungenkrebs.svg"
				alt=""
			/>
		</a>
	</div>
	<div class="links">
		<a href="http://localhost:4200/#">PRIVACY POLICY</a>
		<a href="http://localhost:4200/#">COOKIES POLICY</a>
	</div>
</footer>
<ScrollToTop />
