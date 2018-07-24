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
    it('matches the snapshot for a basic input', () => {
      const result = execSketchlint(...getArgumentsForFixture('basic'));
      const expectedOutput = getExpectedOutputForFixture('basic');
      expect(result.toString()).toBe(expectedOutput);
    });
  });
});
