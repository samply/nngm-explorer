import { env } from '$env/dynamic/public';
import type { Options } from './options';
import optionsProd from '../config/options.json';

/** The options depending on the environment */
export let options: Options = optionsProd;
if (env.PUBLIC_ENVIRONMENT === 'test') {
	options = optionsProd;
}
if (env.PUBLIC_SPOT_URL) {
	options.spotUrl = env.PUBLIC_SPOT_URL;
}
