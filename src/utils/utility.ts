import { Role, RoleManager } from 'discord.js'
import * as _ from 'underscore'

export default class Utility {
  /**
   * Get random value or subset of values
   * @param array array to pick from
   * @param subset how many to pick from array
   * @returns random elements of array
   */
  static random<T>(array: T[], subset?: number): T | T[] {
    if (subset) {
      return _.sample(array, subset)
    }

    return array[Math.floor(Math.random() * array.length)]
  }

  /**
   * Checks if every substrings is within copy
   * @param subStrings strings to look for
   * @param copy string to check
   * @returns true if string contains all substrings, false otherwise
   */
  static checkStatementForStrings(subStrings: string[], copy: string): boolean {
    return subStrings.every((s) => copy.indexOf(s) > -1)
  }

  /**
   * Find role
   * @param roleManager discord role manager
   * @param roleName name of role
   * @returns Role | undefined
   */
  static findRole(
    roleManager: RoleManager | undefined,
    roleName: string | undefined
  ): Role | undefined {
    return roleManager?.cache.find((r) => r.name === roleName)
  }

  /**
   * Generates random string of lowercase characters of given length.
   * @param length length of id
   * @returns random id
   */
  static makeId(length: number) {
    let result = ''
    const characters = 'abcdefghijklmnopqrstuvwxyz'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }
}
