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
    it('matches the snapshot for a basic input', () => {
      const result = execSketchlint(...getArgumentsForFixture('basic'));
      const expectedOutput = getExpectedOutputForFixture('basic');
      expect(result.toString()).toBe(expectedOutput);
    });
  });
});
