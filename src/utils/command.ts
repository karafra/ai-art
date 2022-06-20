import { aiStory } from '../assets/language/ai-story'
import { aiArt } from '@Assets/language/ai-art'
/**
 *  Generic json interface.
 *
 * @author Karafra
 * @since 1.0
 */
export interface Copy {
  [key: string]: string
}

/**
 * Base class for all discord commands.
 *
 * @author Karafra
 * @since 1.0
 */
export class Command {
  copy!: Copy

  constructor() {
    this.copy = {
      ...aiArt,
      ...aiStory
    }
  }

  /**
   * Find correct translate copy
   * @param key for which to look in templates
   * @param args arguments to interpolate template with
   * @returns string resulting interpolated template
   */
  public c(key: string, ...args: string[]): string {
    const selectedKey = Object.keys(this.copy).find((k) => k === key)

    if (!selectedKey) {
      return ''
    }

    let selectedCopy: string = this.copy[selectedKey]
    args?.map((a: string, i: number) => {
      selectedCopy = selectedCopy.replace(`{${i}}`, a)
    })

    return selectedCopy
  }

  /**
   * Find correct translate copy and make first letter uppercase
   * @param key for which to look in templates
   * @param args arguments to interpolate template with
   * @returns string resulting interpolated template
   */
  public cCapitalize(key: string, ...args: string[]): string {
    const c = this.c(key, ...args)

    let firstLetter = false
    const letters = c
      .toLowerCase()
      .split('')
      .map((l) => {
        if (/[a-zA-Z]/.test(l) && !firstLetter) {
          firstLetter = true
          return l.toUpperCase()
        }

        return l
      })

    return letters.join()
  }
}
