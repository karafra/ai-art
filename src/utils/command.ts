import { aiArt } from '@Assets/language/ai-art';

interface Copy {
  [key: string]: string;
}

export class Command {
  copy!: Copy;

  constructor() {
    this.copy = {
      ...aiArt
    };
  }

  /**
   * Find correct translate copy
   * @param key
   * @param args
   * @returns string
   */
  public c(key: string, ...args: string[]): string {
    const selectedKey = Object.keys(this.copy).find((k) => k === key);

    if (!selectedKey) {
      return '';
    }

    let selectedCopy: string = this.copy[selectedKey];
    args?.map((a: string, i: number) => {
      selectedCopy = selectedCopy.replace(`{${i}}`, a);
    });

    return selectedCopy;
  }

  /**
   * Find correct translate copy and make first letter uppercase
   * @param key
   * @param args
   * @returns string
   */
  public cBold(key: string, ...args: string[]): string {
    const c = this.c(key, ...args);

    let firstLetter = false;
    const letters = c
      .toLowerCase()
      .split('')
      .map((l) => {
        if (/[a-zA-Z]/.test(l) && !firstLetter) {
          firstLetter = true;
          return l.toUpperCase();
        }

        return l;
      });

    return letters.join();
  }
}
