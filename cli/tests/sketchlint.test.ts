import * as path from 'path';
import {exec} from 'shelljs';

describe('sketchlint-cli', () => {
  const binPath = path.resolve(module.parent.filename, '../..', 'sketchlint');
  const basePath = path.resolve(module.parent.filename, '..');

  function execSketchlint(sketchFilePath?: string, configFilePath?: string) {
    const configArg = configFilePath ? `--config ${configFilePath}` : '';
    return exec(`${binPath} ${sketchFilePath} ${configArg}`);
  }

  function getFixtureSketchPath(fixture: string) {
    return `${basePath}/fixtures/${fixture}/${fixture}.sketch`;
  }

  function getFixtureConfigPath(fixture: string) {
    return `${basePath}/fixtures/${fixture}/config.js`;
  }

  function getArgumentsForFixture(fixture: string) {
    return [getFixtureSketchPath(fixture), getFixtureConfigPath(fixture)];
  }

  describe('<sketchFilePath>', () => {
    it('throws if no sketch file path is given', () => {
      const result = execSketchlint('');
      expect(result.code).toBe(1);
    });

    it('throws if sketch file path doesnt exist', () => {
      const result = execSketchlint(
        getFixtureSketchPath('something-that-doesnt-exist'),
      );
      expect(result.code).toBe(1);
    });

    it('shows usage message when it throws', () => {
      const result = execSketchlint(
        getFixtureSketchPath('something-that-doesnt-exist'),
      );
      expect(result.toString()).toContain('Usage');
    });
  });

  describe('<configFilePath>', () => {
    it('throws if no config file path is given', () => {
      const result = execSketchlint(getFixtureSketchPath('basic'));
      expect(result.code).toBe(1);
    });

    it('throws if config file path doesnt exist', () => {
      const result = execSketchlint(
        getFixtureSketchPath('basic'),
        getFixtureConfigPath('something-that-doesnt-exist'),
      );
      expect(result.code).toBe(1);
    });

    it('shows usage message when it throws', () => {
      const result = execSketchlint(
        getFixtureSketchPath('something-that-doesnt-exist'),
      );
      expect(result.toString()).toContain('Usage');
    });
  });

  describe('result', () => {
    it('shows the layer path for every linting error', () => {
      const result = execSketchlint(...getArgumentsForFixture('basic'));
      const resultOut = result.toString();
      expect(resultOut).toContain('page-about');
      expect(resultOut).toContain('homepage/v1/box/title');
    });

    it('shows the error types', () => {
      const result = execSketchlint(...getArgumentsForFixture('basic'));
      const resultOut = result.toString();
      expect(resultOut).toContain('error');
      expect(resultOut).toContain('warning');
    });

    it('shows the rule IDs', () => {
      const result = execSketchlint(...getArgumentsForFixture('basic'));
      const resultOut = result.toString();
      expect(resultOut).toContain('noPagePrefix');
      expect(resultOut).toContain('noExclamationMark');
    });

    it('shows the error messages', () => {
      const result = execSketchlint(...getArgumentsForFixture('basic'));
      const resultOut = result.toString();
      expect(resultOut).toContain(
        'text "Yeey!" may not contain an exclamation mark.',
      );
      expect(resultOut).toContain(
        'Page name "page-about" contains forbidden "page" prefix.',
      );
    });

    it('shows a summary', () => {
      const result = execSketchlint(...getArgumentsForFixture('basic'));
      expect(result.toString()).toContain('✖ 2 problems (1 error, 1 warning)');
    });

    it('has the right format', () => {
      const result = execSketchlint(...getArgumentsForFixture('basic'));
      expect(result.toString()).toBe(
        `page-about
error Page name "page-about" contains forbidden "page" prefix. noPagePrefix

homepage/v1/box/title
warning text "Yeey!" may not contain an exclamation mark. noExclamationMark

✖ 2 problems (1 error, 1 warning)
`,
      );
    });
  });
});
