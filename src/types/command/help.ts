export interface ICommandParameter {
  name: string;
  optional?: boolean;
  description: string;
}

export interface ICommandHelp {
  name: string;
  description: string;
  usage: string;
  parameters: ICommandParameter[];
}
