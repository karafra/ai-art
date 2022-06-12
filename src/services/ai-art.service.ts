import { aiArtModelService } from '@Models/ai-art-model.service';
import { Collage } from '@Utils/collage';

export class AiArtService {
  public async getArt(prompt: string): Promise<Buffer> {
    const collage = new Collage();
    for (let i = 0; i < 30; i++) {
      try {
        const response = await aiArtModelService.getImageArray(prompt);
        await collage.constructCollage(response.images);
        return collage.canvas.toBuffer('image/png');
      } catch (Error) {
        await new Promise((f) => setTimeout(f, 3000));
        continue;
      }
    }
    throw new Error('Could not process this query');
  }
}

export const aiArtService = new AiArtService();
