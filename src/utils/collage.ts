import { AiArtImageArray } from '@Types/api/ai-art.js';
// @ts-ignore
import createCollage from '@settlin/collage';
import { MessageAttachment } from 'discord.js';
import fs from 'node:fs';

export class Collage {
  private static readonly options: any = {
    width: 3,
    height: 3,
    imageWidth: 300,
    imageHeight: 300,
    spacing: 20,
    sources: []
  };
  public canvas: any;

  public async constructCollage(arr: AiArtImageArray): Promise<Collage> {
    const options = Collage.options;
    options.sources = arr.map((image: string) => Buffer.from(image, 'base64'));
    this.canvas = await createCollage(options);
    return this;
  }

  getAsAttachment(name: string = Date.now().toString()): MessageAttachment {
    const buffer = this.canvas.toBuffer('image/png');
    return new MessageAttachment(buffer, `${name}.png`);
  }
}
