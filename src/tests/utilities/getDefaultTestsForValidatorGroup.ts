import sketchlint, {ValidatorError} from '../../';

interface Options {
  expectedValidatorData: any;
  mockSketchData: any;
}

export default function getDefaultTestsForValidatorGroup(
  category: string,
  {expectedValidatorData, mockSketchData}: Options,
) {
  return () => {
    const mockError: ValidatorError = [
      'error',
      `Object name contains forbidden prefix.`,
    ];

    it('runs validators', async () => {
      const validatorSpy = jest.fn();
      await sketchlint(mockSketchData, {
        [category]: {
          testValidator: validatorSpy,
        },
      });
      expect(validatorSpy).toHaveBeenCalled();
    });

    it(`passes the item into the validator`, async () => {
      const validatorSpy = jest.fn();
      await sketchlint(mockSketchData, {
        [category]: {
          testValidator: validatorSpy,
        },
      });
      expect(validatorSpy).toHaveBeenCalledWith(expectedValidatorData);
    });

    it('includes the ruleID', async () => {
      const results = await sketchlint(mockSketchData, {
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
      const results = await sketchlint(mockSketchData, {
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
      const results = await sketchlint(mockSketchData, {
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
      const results = await sketchlint(mockSketchData, {
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

    it('includes the error category', async () => {
      const results = await sketchlint(mockSketchData, {
        [category]: {
          testValidator: () => mockError,
        },
      });

      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            category,
          }),
        ]),
      );
    });
  };
}
