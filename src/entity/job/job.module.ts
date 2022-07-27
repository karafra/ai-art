import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { JobResolver } from './job.resolver';
import { JobService } from './job.service';

@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  providers: [JobResolver, JobService],
  exports: [JobResolver, JobService],
})
export class JobModule {}
