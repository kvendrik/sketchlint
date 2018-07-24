import * as fs from 'fs';

export const sketchData = fs.readFileSync(`${__dirname}/basic.sketch`);
