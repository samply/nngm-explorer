<script lang="ts">
	import {
		barChartBackgroundColors,
		genderHeaders,
		vitalstatusHeaders
		//measures
	} from './config/environment';
	import { browser } from '$app/environment';
	//import options from './config/options.json';
	import {
		catalogueText
		//fetchData
	} from './services/catalogue.service';
	//import ResultTable from './components/ResultTable.svelte';
	//import { backendCall } from './services/backend.service';
	//import { onMount } from 'svelte';
	//import { requestBackend } from './services/backends/backend.service';
	//import { getAst, setSiteResult } from '@samply/lens';
	import '@samply/lens/style.css';
	//import 'C:/IntelliJ - Projekte/nngm-lens-svelte/node_modules/@samply/lens/dist/style.css'
	import '@samply/lens';
	//import type { LensDataPasser, QueryEvent } from '@samply/lens';
	//import type { LensDataPasser } from '@samply/lens';
	import ScrollToTop from './services/tools/top-anker.svelte';

	//let catalogueDataPromise = getStaticCatalogue('catalogues/catalogue-example.json');
	let catalogueopen = false;
	//let catalogueCollapsable = true;
	//let dataPasser: LensDataPasser;

	//const catalogueUrl = 'catalogues/catalogue-from-lens1.json';
	//const optionsFilePath = 'config/options.json';

	/*const jsonPromises: Promise<{
		catalogueJSON: string;
		optionsJSON: string;
	}> = fetchData(catalogueUrl, optionsFilePath);*/

	/**
	 * The following functions are the API to the library stores (state)
	 * here you get information to use in your application
	 * or manipulate the stores
	 * use if needed and import types from @samply/lens
	 */

	// const getQuery = (): void => {
	// 	console.log('getQuery()', dataPasser.getQueryAPI());
	// };

	// const getResponse = (): void => {
	// 	console.log('getResponse()', dataPasser.getResponseAPI());
	// };

	// const getAST = (): void => {
	// 	console.log('getAst()', dataPasser.getAstAPI());
	// };

	// const removeItem = (queryObject: QueryItem): void => {
	// 	console.log('removeItem()', queryObject);
	// 	dataPasser.removeItemFromQuyeryAPI({ queryObject });
	// 	getQuery();
	// };

	// const removeValue = (queryItem: QueryItem, value: QueryValue): void => {
	// 	console.log('removeValue()', queryItem, value);
	// 	dataPasser.removeValueFromQueryAPI({ queryItem, value });
	// 	getQuery();
	// };
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
	/**
	 * This event listener is triggered when the user clicks the search button
	 */

	/*let response: void;

	window.addEventListener('emit-lens-query', (e) => {
		const event = e as QueryEvent;
		const { ast, updateResponse, abortController } = event.detail;
		response = backendCall(ast, updateResponse, abortController);
	});*/

	if (browser) {
		//window.addEventListener('emit-lens-query', (e) => {
		//if (!dataPasser) return;
		//const event = e as CustomEvent;
		//const { ast, updateResponse, abortController } = event.detail;
		//const criteria: string[] = dataPasser.getCriteriaAPI('diagnosis');
		//requestBackend(ast, updateResponse, abortController, measures, criteria);
		//});
	}

	/*
	import {
		setOptions,
		setCatalogue,
		type LensOptions,
		type Catalogue
	} from '@samply/lens';
	import options from './config/options.json';
	import catalogue from './config/catalogue-from-lens1.json';
	import { onMount } from 'svelte';
	onMount(() => {
		setOptions(options as LensOptions);
		setCatalogue(catalogue as Catalogue);
	});

	window.addEventListener('lens-search-triggered', () => {
		console.log('AST:', JSON.stringify(getAst()));

		setSiteResult('Test1', {
			totals: {
				patients: 10,
				samples: 100
			},
			stratifiers: {
				gender: {
					female: 9,
					male: 3
				},
				diagnosis: {
					'C34.0': 26,
					'C34.2': 28,
					'C35.8': 25,
					'C36.0': 35
				},
				'75186-7': {
					L: 9,
					T: 3,
					A: 0
				}
			}
		});
		setSiteResult('Test2', {
			totals: {
				patients: 20,
				samples: 200
			},
			stratifiers: {
				gender: {
					female: 9,
					male: 3
				}
			}
		});
	});*/

	import type { Catalogue, SpotResult } from '@samply/lens';
	import {
		setOptions,
		setCatalogue,
		clearSiteResults,
		markSiteClaimed,
		setSiteResult,
		querySpot,
		getAst,
		buildLibrary,
		buildMeasure
	} from '@samply/lens';
	import { translateAstToCql } from './lib/ast-to-cql-translator';
	import { measures } from './lib/measures';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import { options } from './lib/env-options';
	import catalogueProd from './config/catalogue.json';
	import catalogueTest from './config/catalogue-from-lens1.json';

	let abortController = new AbortController();
	window.addEventListener('lens-search-triggered', () => {
		abortController.abort();
		abortController = new AbortController();

		// AST to CQL translation
		const cql = translateAstToCql(
			getAst(),
			false,
			'DKTK_STRAT_DEF_IN_INITIAL_POPULATION',
			measures
		);
		const lib = buildLibrary(cql);
		const measure = buildMeasure(
			lib.url,
			measures.map((m) => m.measure)
		);

		clearSiteResults();
		const query = btoa(
			JSON.stringify({
				lang: 'cql',
				lib,
				measure
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
					backgroundColor={JSON.stringify(barChartBackgroundColors)}
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
					catalogueGroupCode="age_at_diagnosis"
					chartType="bar"
					groupRange={10}
					filterRegex="^(1*[12]*[0-9])"
					xAxisTitle="Alter"
					yAxisTitle="Anzahl der Primärdiagnosen"
					backgroundColor={JSON.stringify(barChartBackgroundColors)}
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
<!-- here it waits on all promises to resolve and fills in the parameters -->
<!--{#await jsonPromises}
	Loading data...
{:then { optionsJSON, catalogueJSON }}
	<lens-options {catalogueJSON} {optionsJSON} {measures}></lens-options>
{:catch someError}
	System error: {someError.message}
{/await}-->

<!--<lens-data-passer bind:this="{dataPasser}"></lens-data-passer>-->
