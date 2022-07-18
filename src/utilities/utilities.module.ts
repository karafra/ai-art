import { Module } from '@nestjs/common';
import { Collage } from './collage/collage';

@Module({
  providers: [Collage],
  exports: [Collage],
})
export class UtilitiesModule {}
