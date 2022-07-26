import { MessageAttachment } from 'discord.js';

export class MessageAttachmentWithDbRecord<T> {
  private _dbRecord?: T;

  private _messageAttachment: MessageAttachment;

  public get dbRecord(): T {
    return this._dbRecord;
  }

  public set dbRecord(dbRecord: T) {
    this._dbRecord = dbRecord;
  }

  public get attachment() {
    return this._messageAttachment;
  }

  public set attachment(attachment: MessageAttachment) {
    this._messageAttachment = attachment;
  }

  constructor(attachment: MessageAttachment, dbRecord?: T) {
    this._messageAttachment = attachment;
    this._dbRecord = dbRecord;
  }
}
