import * as path from 'path';
import {execSync} from 'child_process';

const binPath = path.resolve(module.parent.filename, '../..', 'sketchlint');

describe('sketchlint-cli', () => {
  it('uses the given config', () => {
    const result = execSync(
      `${binPath} ./fixtures/basic/basic.sketch --config ./fixtures/basic/config.js`,
    );
    console.log(result);
  });
});
