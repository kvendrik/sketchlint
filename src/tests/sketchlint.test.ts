import {sketchData as basicSketchData} from './fixtures/basic';
import {
  sketchData as groupsSketchData,
  noCapitalizedGroupNames as noCapitalizedGroupNamesRule,
} from './fixtures/groups';
import {
  sketchData as exclamationMarkSketchData,
  noExclamationMark as noExclamationMarkRule,
} from './fixtures/nested-exclamation-mark';
import sketchlint, {ValidatorError} from '../';

const mockError: ValidatorError = [
  'error',
  `Object name contains forbidden prefix.`,
];

function getDefaultTestsForValidatorGroup(
  category: string,
  expectedObject: any,
) {
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
      expect(validatorSpy).toHaveBeenCalledWith(expectedObject);
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

    it('includes the error category', async () => {
      const results = await sketchlint(basicSketchData, {
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

describe('sketchlint', () => {
  describe(
    'pages',
    getDefaultTestsForValidatorGroup(
      'pages',
      expect.objectContaining({
        name: expect.any(String),
      }),
    ),
  );

  describe(
    'meta',
    getDefaultTestsForValidatorGroup(
      'meta',
      expect.objectContaining({
        fonts: expect.any(Array),
      }),
    ),
  );

  describe('layers', () => {
    getDefaultTestsForValidatorGroup(
      'layers',
      expect.objectContaining({
        name: expect.any(String),
      }),
    )();

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

  describe('artboards', () => {
    getDefaultTestsForValidatorGroup(
      'artboards',
      expect.objectContaining({
        name: expect.any(String),
      }),
    )();

    it('accepts a seperate artboards validators category', async () => {
      const validatorSpy = jest.fn();
      await sketchlint(basicSketchData, {
        artboards: {
          testArtboardValidator: validatorSpy,
        },
      });
      expect(validatorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'v1',
        }),
      );
    });

    it('doesnt include artboards in the layers category', async () => {
      const validatorSpy = jest.fn();
      await sketchlint(basicSketchData, {
        layers: {
          testValidator: validatorSpy,
        },
      });
      expect(validatorSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'v1',
        }),
      );
    });
  });

  describe('groups', () => {
    getDefaultTestsForValidatorGroup(
      'groups',
      expect.objectContaining({
        name: expect.any(String),
      }),
    )();

    it('accepts a seperate groups validators category', async () => {
      const validatorSpy = jest.fn();
      await sketchlint(groupsSketchData, {
        groups: {
          testGroupValidator: validatorSpy,
        },
      });
      expect(validatorSpy).toHaveBeenCalledTimes(3);
      expect(validatorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'header',
        }),
      );
    });

    it('doesnt include groups in the layers category', async () => {
      const validatorSpy = jest.fn();
      await sketchlint(groupsSketchData, {
        layers: {
          testGroupValidator: validatorSpy,
        },
      });
      expect(validatorSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'header',
        }),
      );
    });

    it('includes the nested error path when the group is nested', async () => {
      const results = await sketchlint(groupsSketchData, {
        groups: {
          noCapitalizedGroupNamesRule,
        },
      });

      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'page-about/v1/header/Version',
          }),
        ]),
      );
    });
  });
});
