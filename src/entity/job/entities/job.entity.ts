import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'Job', database: 'ai-art' })
export class Job {
  @ObjectIdColumn()
  _id: string;

  @Column()
  images: string[];

  @Column()
  messageId: string;

  @Column()
  messageLink: string;

  public constructor(images: string[]) {
    this.images = images;
  }
}
