import * as path from 'path';
import * as fs from 'fs';
import {exec, ExecOutputReturnValue} from 'shelljs';

describe('sketchlint-cli', () => {
  const binPath = path.resolve(module.parent.filename, '../..', 'sketchlint');
  const basePath = path.resolve(module.parent.filename, '..');

  function execSketchlint(sketchFilePath?: string, configFilePath?: string) {
    const configArg = configFilePath ? `--config ${configFilePath}` : '';
    return exec(`${binPath} ${sketchFilePath} ${configArg}`, {
      silent: true,
    }) as ExecOutputReturnValue;
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

  function getExpectedOutputForFixture(fixture: string) {
    return fs.readFileSync(
      `${basePath}/fixtures/${fixture}/output.txt`,
      'utf-8',
    );
  }

  describe('<sketchFilePath>', () => {
    it('shows usage message if path is not given', () => {
      const result = execSketchlint('');
      expect(result.code).toBe(1);
      expect(result.toString()).toContain('Usage');
    });

    it('shows error message if sketch file doesnt exist', () => {
      const sketchPath = getFixtureSketchPath('something-that-doesnt-exist');
      const result = execSketchlint(sketchPath, getFixtureConfigPath('basic'));
      expect(result.code).toBe(1);
      expect(result.toString()).toContain(
        `Sketch file path ${sketchPath} does not exist.`,
      );
    });
  });

  describe('<configFilePath>', () => {
    it('shows usage message if path is not given', () => {
      const result = execSketchlint(getFixtureSketchPath('basic'));
      expect(result.code).toBe(1);
      expect(result.toString()).toContain('Usage');
    });

    it('shows error message if config file doesnt exist', () => {
      const configPath = getFixtureConfigPath('something-that-doesnt-exist');
      const result = execSketchlint(getFixtureSketchPath('basic'), configPath);
      expect(result.code).toBe(1);
      expect(result.toString()).toContain(
        `Config file path ${configPath} does not exist.`,
      );
    });
  });

  describe('result', () => {
    it('shows the layer path for every linting error', () => {
      const result = execSketchlint(...getArgumentsForFixture('basic'));
      const resultOut = result.toString();
      expect(resultOut).toContain('page-about');
      expect(resultOut).toContain('homepage/V1/_black box/title');
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

    it('shows the category', () => {
      const result = execSketchlint(...getArgumentsForFixture('basic'));
      const resultOut = result.toString();
      expect(resultOut).toContain('layers');
      expect(resultOut).toContain('pages');
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
      expect(result.toString()).toContain(
        '✖ 6 problems (4 errors, 2 warnings)',
      );
    });

    it('uses sigular language when there is only a single problem', () => {
      const result = execSketchlint(...getArgumentsForFixture('error'));
      expect(result.toString()).toContain('✖ 1 problem');
    });

    it('uses plurals when there are multiple problems', () => {
      const result = execSketchlint(...getArgumentsForFixture('rich'));
      expect(result.toString()).toContain(
        '✖ 4 problems (2 errors, 2 warnings)',
      );
    });

    it('applies the right formatting', () => {
      const result = execSketchlint(...getArgumentsForFixture('basic'));
      const expectedOutput = getExpectedOutputForFixture('basic');
      expect(result.toString()).toBe(expectedOutput);
    });

    it('only shows warnings count when no errors are detected', () => {
      const result = execSketchlint(...getArgumentsForFixture('warning'));
      expect(result.toString()).toContain('(1 warning)');
    });

    it('only shows errors count when no warnings are detected', () => {
      const result = execSketchlint(...getArgumentsForFixture('error'));
      expect(result.toString()).toContain('(1 error)');
    });

    it('prints success message when the file is clean', () => {
      const result = execSketchlint(...getArgumentsForFixture('clean'));
      expect(result.toString()).toContain('All good.');
    });
  });
});
