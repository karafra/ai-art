import { ICommandHelp } from '../types/command/help';

export const __INCLUDE_IN_HELP: ICommandHelp[] = [] as ICommandHelp[];

/**
 * Tells bot to include given command in help
 */
export function IncludeInHelp(help: ICommandHelp): any {
  return function (target: any) {
    __INCLUDE_IN_HELP.push(help);
    return target;
  };
}
