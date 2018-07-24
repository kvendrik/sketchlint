import {sketchData as basicSketchData} from './fixtures/basic';
import sketchlint, {ValidatorError} from '../';

describe('sketchlint', () => {
  describe('pages', () => {
    const mockError: ValidatorError = [
      'error',
      `Page name contains forbidden "page" prefix.`,
    ];

    it('runs validators for pages', async () => {
      const validatorSpy = jest.fn();
      await sketchlint(basicSketchData, {
        pages: {
          testValidator: validatorSpy,
          secondTestValidator: validatorSpy,
        },
      });
      expect(validatorSpy).toHaveBeenCalled();
    });

    it('passes the page object into the validator', async () => {
      const validatorSpy = jest.fn();
      await sketchlint(basicSketchData, {
        pages: {
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
        pages: {
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
        pages: {
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
        pages: {
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
        pages: {
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
  });
});
