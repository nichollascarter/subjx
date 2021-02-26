import * as prod from './dist/js/subjx.esm.js';
import * as dev from './dist/js/subjx.dev.esm.js';

export default process.env.NODE_ENV === 'production' ? prod : dev;