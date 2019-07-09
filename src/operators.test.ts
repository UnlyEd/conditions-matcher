import { and, not, or } from '../lib/operators';
import { formatFilters } from '../lib/conditions';

/*
  TODO
    rajouter des tests avec des cas limites, genre des valeurs inattendues (null, undefined, string, etc.)
      Si c'est pas supposé arriver, et que les fonctions ne doivent prendre que des booleans en entrée alors il faudrait throw une exception, qui serait catch par l'appelant et permettrait de retourner un contexte pour aider au debug, car c'est pas supposé arriver et c'est donc qu'on a des filtres mal configurés => permettre de remonter à la source du problème
      Attention toutefois, il faut pas que ça plante tout l'algo, mais plutôt que ça plante uniquement le filtre affecté
        Donc, utiliser du throw Error côté operators, mais plutôt retourner un tableau d'erreurs par la fonction "check" de façon à pouvoir compiler les erreurs et les gérer de la manière qu'on souhaite (sentry pour nous) tout en récupérant les résultats exploitables
 */
describe('src/operators', () => {
  describe('AND operator', () => {
    test('Values are true', () => {
      expect(and([true, true, true, true])).toBe(true);
      expect(and([true])).toBe(true);
    });
    test('Values are mixed', () => {
      expect(and([true, false, true])).toBe(false);
      expect(and([true, false, false])).toBe(false);
      expect(and([true, false])).toBe(false);
    });
    test('Values are false', () => {
      expect(and([false, false])).toBe(false);
      expect(and([false])).toBe(false);
    });
  });

  describe('OR operator', () => {
    test('Values are true', () => {
      expect(or([true, true, true, true])).toBe(true);
      expect(or([true])).toBe(true);
    });
    test('Values are mixed', () => {
      expect(or([true, false, true])).toBe(true);
      expect(or([true, false, false])).toBe(true);
      expect(or([true, false])).toBe(true);
    });
    test('Values are false', () => {
      expect(or([false, false])).toBe(false);
      expect(or([false])).toBe(false);

    });
  });

  describe('NOT operator', () => {
    test('Values are true', () => {
      expect(not([true, true, true, true])).toBe(false);
      expect(not([true])).toBe(false);
    });
    test('Values are mixed', () => {
      expect(not([true, false, true])).toBe(false);
      expect(not([true, false, false])).toBe(false);
      expect(not([false, true])).toBe(false);
    });
    test('Values are false', () => {
      expect(not([false, false])).toBe(true);
      expect(not([false])).toBe(true);
    });
  });

  describe('Filter feature', () => {
    test('Reformat simple nested filter', () => {
      expect(formatFilters({
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
