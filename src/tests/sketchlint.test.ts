import {sketchData as basicSketchData} from './fixtures/basic';
import {
  sketchData as groupsSketchData,
  noCapitalizedGroupNames as noCapitalizedGroupNamesRule,
} from './fixtures/groups';
import {
  sketchData as exclamationMarkSketchData,
  noExclamationMark as noExclamationMarkRule,
} from './fixtures/nested-exclamation-mark';
import getDefaultTestsForValidatorGroup from './utilities/getDefaultTestsForValidatorGroup';
import sketchlint from '../';

describe('sketchlint', () => {
  describe(
    'pages',
    getDefaultTestsForValidatorGroup('pages', {
      expectedValidatorData: expect.objectContaining({
        name: expect.any(String),
      }),
      mockSketchData: basicSketchData,
    }),
  );

  describe(
    'meta',
    getDefaultTestsForValidatorGroup('meta', {
      expectedValidatorData: expect.objectContaining({
        fonts: expect.any(Array),
      }),
      mockSketchData: basicSketchData,
    }),
  );

  describe('layers', () => {
    getDefaultTestsForValidatorGroup('layers', {
      expectedValidatorData: expect.objectContaining({
        name: expect.any(String),
      }),
      mockSketchData: basicSketchData,
    })();

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
    getDefaultTestsForValidatorGroup('artboards', {
      expectedValidatorData: expect.objectContaining({
        name: expect.any(String),
      }),
      mockSketchData: basicSketchData,
    })();

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
    getDefaultTestsForValidatorGroup('groups', {
      expectedValidatorData: expect.objectContaining({
        name: expect.any(String),
      }),
      mockSketchData: groupsSketchData,
    })();

    it('doesnt include groups in the layers category', async () => {
      const validatorSpy = jest.fn();
      await sketchlint(groupsSketchData, {
        layers: {
          testGroupValidator: validatorSpy,
        },
      });
      expect(validatorSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'content',
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
            path: 'about/v1/content/Version',
          }),
        ]),
      );
    });
  });
});
