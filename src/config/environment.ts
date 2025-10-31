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

export const barChartBackgroundColors: string[] = ['#4dc9f6', '#3da4c7'];
