import { Role, RoleManager } from 'discord.js';
import * as _ from 'underscore';

export default class Utility {
  /**
   * Get random value or subset of values
   * @param array
   * @param subset
   * @returns
   */
  static random(array: any[], subset?: number): any {
    if (subset) {
      return _.sample(array, subset);
    }

    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Checks if every substrings is within copy
   * @param subStrings
   * @param copy
   * @returns boolean
   */
  static checkStatementForStrings(subStrings: string[], copy: string): boolean {
    return subStrings.every((s) => copy.indexOf(s) > -1);
  }

  /**
   * Find role
   * @param roleManager
   * @param roleName
   * @returns Role | undefined
   */
  static findRole(
    roleManager: RoleManager | undefined,
    roleName: string | undefined
  ): Role | undefined {
    return roleManager?.cache.find((r) => r.name === roleName);
  }
}
