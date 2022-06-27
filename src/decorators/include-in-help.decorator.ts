import { Command } from '@Utils/command'

export const __INCLUDE_IN_HELP: Command[] = []

/**
 * Tells bot to include given command in help
 */
export function IncludeInHelp(): any {
  return function (target: Command): void {
    __INCLUDE_IN_HELP.push(target)
  }
}
