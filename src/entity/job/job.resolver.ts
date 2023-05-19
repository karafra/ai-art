import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateJobInput } from './dto/create-job.input';
import { UpdateJobInput } from './dto/update-job.input';
import { JobService } from './job.service';

@Resolver('Job')
export class JobResolver {
  constructor(private readonly jobService: JobService) {}

  @Mutation('createJob')
  public create(@Args('createJobInput') createJobInput: CreateJobInput) {
    return this.jobService.create(createJobInput);
  }

  @Query('jobs')
  public findAll() {
    const findAllPromise = this.jobService.findAll();
    return findAllPromise;
  }

  @Query('job')
  public findOne(@Args('id') id: string) {
    return this.jobService.findOne(id);
  }

  @Query('job')
  public findOneByMessageId(messageId: string) {
    return this.jobService.findByMessageId(messageId);
  }

  @Mutation('updateJob')
  public update(@Args('updateJobInput') updateJobInput: UpdateJobInput) {
    return this.jobService.update(updateJobInput._id, updateJobInput);
  }

  @Mutation('removeJob')
  public remove(@Args('id') id: string) {
    return this.jobService.remove(id);
  }
}
