// VITE_TARGET_ENVIRONMENT should be set by the ci pipeline

export const genderHeaders: Map<string, string> = new Map<string, string>()
	.set('male', 'männlich')
	.set('female', 'weiblich')
	.set('other', 'Divers, Intersexuell')
	.set('unknown', 'unbekannt');
export const vitalstatusHeaders: Map<string, string> = new Map<string, string>()
	.set('L', 'lebt')
	.set('T', 'verstorben')
	.set('A', 'lost to follow-up');
export const smokestatusHeaders: Map<string, string> = new Map<string, string>()
	.set('LA15920-4', 'Ehemaliger Raucher')
	.set('LA18978-9', 'Niemals Raucher')
	.set('LA18979-7', 'Raucher, aktueller Status unbekannt')
	.set('unknown', 'unbekannt');
export const ecogstatusHeaders: Map<string, string> = new Map<string, string>()
	.set('LA9622-7', 'Voll aktiv')
	.set('LA9623-5', 'eingeschränkt')
	.set('LA9624-3', 'gehfähig')
	.set('LA9625-0', 'begrenzt')
	.set('LA9626-8', 'völlig behindert')
	.set('LA9627-6', 'tot');

export const barChartBackgroundColors: string[] = ['#4dc9f6', '#3da4c7'];
