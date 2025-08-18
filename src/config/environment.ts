// VITE_TARGET_ENVIRONMENT should be set by the ci pipeline

import type { MeasureGroup, MeasureItem } from '@samply/lens';

import {
	dktkDiagnosisMeasure,
	dktkMedicationStatementsMeasure,
	dktkPatientsMeasure,
	dktkProceduresMeasure,
	dktkSpecimenMeasure,
	dktkHistologyMeasure
} from '../measures';

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

/**
 * Array of measure groups for different backends
 */
export const measures: MeasureGroup[] = [
	{
		name: 'DKTK',
		measures: [
			dktkPatientsMeasure as MeasureItem,
			dktkDiagnosisMeasure as MeasureItem,
			dktkSpecimenMeasure as MeasureItem,
			dktkProceduresMeasure as MeasureItem,
			dktkMedicationStatementsMeasure as MeasureItem,
			dktkHistologyMeasure as MeasureItem
		]
	}
];

export const backendMeasures = `DKTK_STRAT_DEF_IN_INITIAL_POPULATION`;
