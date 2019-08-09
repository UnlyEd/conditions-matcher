import { formatFilter } from '../checkMatches';
import { and, not, or } from './logicalOperators';

/*
  TODO
    rajouter des tests avec des cas limites, genre des valeurs inattendues (null, undefined, string, etc.)
      Si c'est pas supposé arriver, et que les fonctions ne doivent prendre que des booleans en entrée alors il faudrait throw une exception, qui serait catch par l'appelant et permettrait de retourner un contexte pour aider au debug, car c'est pas supposé arriver et c'est donc qu'on a des filtres mal configurés => permettre de remonter à la source du problème
      Attention toutefois, il faut pas que ça plante tout l'algo, mais plutôt que ça plante uniquement le filtre affecté
        Donc, utiliser du throw Error côté operators, mais plutôt retourner un tableau d'erreurs par la fonction "check" de façon à pouvoir compiler les erreurs et les gérer de la manière qu'on souhaite (sentry pour nous) tout en récupérant les résultats exploitables
 */
describe('src/logicalOperators', () => {
  describe('AND operator', () => {
    test('Values are true', () => {
      expect(and([true, true, true, true])).toEqual(true);
      expect(and([true])).toEqual(true);
    });
    test('Values are mixed', () => {
      expect(and([true, false, true])).toEqual(false);
      expect(and([true, false, false])).toEqual(false);
      expect(and([true, false])).toEqual(false);
    });
    test('Values are false', () => {
      expect(and([false, false])).toEqual(false);
      expect(and([false])).toEqual(false);
    });
  });

  describe('OR operator', () => {
    test('Values are true', () => {
      expect(or([true, true, true, true])).toEqual(true);
      expect(or([true])).toEqual(true);
    });
    test('Values are mixed', () => {
      expect(or([true, false, true])).toEqual(true);
      expect(or([true, false, false])).toEqual(true);
      expect(or([true, false])).toEqual(true);
    });
    test('Values are false', () => {
      expect(or([false, false])).toEqual(false);
      expect(or([false])).toEqual(false);

    });
  });

  describe('NOT operator', () => {
    test('Values are true', () => {
      expect(not([true, true, true, true])).toEqual(false);
      expect(not([true])).toEqual(false);
    });
    test('Values are mixed', () => {
      expect(not([true, false, true])).toEqual(false);
      expect(not([true, false, false])).toEqual(false);
      expect(not([false, true])).toEqual(false);
    });
    test('Values are false', () => {
      expect(not([false, false])).toEqual(true);
      expect(not([false])).toEqual(true);
    });
  });

  describe('Filter feature', () => {
    test('Reformat simple nested filter', () => {
      expect(formatFilter({
        'AND': [
          {
            'organisation_name': 'skema',
            'institution_name': 'skema',
            'campus_name': 'paris',
          },
        ],
        'organisation_name': 'skema',
      })).toEqual({
        'AND': [
          {
            'organisation_name': 'skema',
          }, {
            'institution_name': 'skema',
          }, {
            'campus_name': 'paris',
          },
        ],
        'organisation_name': 'skema',
      });
    });
  });
});
