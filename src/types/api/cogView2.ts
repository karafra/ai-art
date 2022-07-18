export type Status = 'COMPLETE' | 'PENDING' | 'QUEUED';

export interface ICogView2Data {
  data: [
    null,
    string,
    [string, string, string, string, string, string, string],
  ];
  duration: number;
  average_duration: number;
}

export interface ICogView2Response {
  status?: Status;
  hash?: string;
  queue_position?: number;
  data: ICogView2Data;
}

export interface ICogView2ResponseAcknowledged {
  hash: string;
  status: Status;
  queue_position: number;
}

export class CogView2Response implements ICogView2Response, ICogView2Response {
  public data: ICogView2Data;
  public status: Status;
  public constructor(status: Status, data: ICogView2Data) {
    this.data = data;
    this.status = status;
  }

  public isCompleted(): boolean {
    return this.status === 'COMPLETE';
  }

  public getImageArray(): [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ] {
    return this.data.data[2].map((e) =>
      e.replace('data:image/png;base64,', ''),
    ) as any;
  }
}

export type Style =
  | 'none'
  | 'mainbody'
  | 'photo'
  | 'flat'
  | 'comics'
  | 'oil'
  | 'sketch'
  | 'isometric'
  | 'watercolor'
  | 'chinese';

export type ActionType = 'predict';

export interface ICogView2Request {
  action: ActionType;
  session_hash: string;
  fn_index: number;
  data: [string, boolean, Style, number, boolean, number];
}
