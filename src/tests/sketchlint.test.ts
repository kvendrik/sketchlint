import {sketchData as basicSketchData} from './fixtures/basic';
import {
  sketchData as exclamationMarkSketchData,
  noExclamationMark as noExclamationMarkRule,
} from './fixtures/nested-exclamation-mark';
import sketchlint, {ValidatorError} from '../';

const mockError: ValidatorError = [
  'error',
  `Object name contains forbidden prefix.`,
];

function getDefaultTestsForValidatorGroup(category: string) {
  return () => {
    it('runs validators', async () => {
      const validatorSpy = jest.fn();
      await sketchlint(basicSketchData, {
        [category]: {
          testValidator: validatorSpy,
        },
      });
      expect(validatorSpy).toHaveBeenCalled();
    });

    it(`passes the group item into the validator`, async () => {
      const validatorSpy = jest.fn();
      await sketchlint(basicSketchData, {
        [category]: {
          testValidator: validatorSpy,
        },
      });
      expect(validatorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: expect.any(String),
        }),
      );
    });

    it('includes the ruleID', async () => {
      const results = await sketchlint(basicSketchData, {
        [category]: {
          testValidator: () => mockError,
        },
      });

      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ruleID: 'testValidator',
          }),
        ]),
      );
    });

    it('includes the error message', async () => {
      const results = await sketchlint(basicSketchData, {
        [category]: {
          testValidator: () => mockError,
        },
      });

      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: mockError[1],
          }),
        ]),
      );
    });

    it('includes the error type', async () => {
      const results = await sketchlint(basicSketchData, {
        [category]: {
          testValidator: () => mockError,
        },
      });

      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: mockError[0],
          }),
        ]),
      );
    });

    it('includes the error path', async () => {
      const results = await sketchlint(basicSketchData, {
        [category]: {
          testValidator: () => mockError,
        },
      });

      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: expect.any(String),
          }),
        ]),
      );
    });
  };
}

describe('sketchlint', () => {
  describe('pages', getDefaultTestsForValidatorGroup('pages'));
  describe('layers', () => {
    getDefaultTestsForValidatorGroup('layers')();

    it('includes the nested error path when the layer is nested', async () => {
      const results = await sketchlint(exclamationMarkSketchData, {
        layers: {
          noExclamationMarkRule,
        },
      });

      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'homepage/v1/box/title',
          }),
        ]),
      );
    });
  });
});
