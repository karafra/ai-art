import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { CreateJobInput } from './dto/create-job.input';
import { UpdateJobInput } from './dto/update-job.input';
import { JobService } from './job.service';

@Resolver('Job')
export class JobResolver {
  constructor(
    @InjectSentry()
    private readonly sentryService: SentryService,
    private readonly jobService: JobService,
  ) {}

  @Mutation('createJob')
  public create(@Args('createJobInput') createJobInput: CreateJobInput) {
    this.sentryService.instance().addBreadcrumb({
      level: 'info',
      category: 'Resolver',
      message: 'Creating job',
    });
    const creationPromise = this.jobService.create(createJobInput);
    this.sentryService.instance().addBreadcrumb({
      level: 'info',
      category: 'Resolver',
      message: 'Created job',
    });
    return creationPromise;
  }

  @Query('jobs')
  public findAll() {
    this.sentryService.instance().addBreadcrumb({
      level: 'info',
      category: 'Resolver',
      message: 'Fetching all jobs',
    });
    const findAllPromise = this.jobService.findAll();
    this.sentryService.instance().addBreadcrumb({
      level: 'info',
      category: 'Resolver',
      message: 'Fetched all jobs',
    });
    return findAllPromise;
  }

  @Query('job')
  public findOne(@Args('id') id: string) {
    this.sentryService.instance().addBreadcrumb({
      level: 'info',
      category: 'Resolver',
      message: `Fetching job with id ${id}`,
    });
    const findOnePromise = this.jobService.findOne(id);
    this.sentryService.instance().addBreadcrumb({
      level: 'info',
      category: 'Resolver',
      message: `Fetched job with id ${id}`,
    });
    return findOnePromise;
  }

  @Query('job')
  public findOneByMessageId(messageId: string) {
    this.sentryService.instance().addBreadcrumb({
      level: 'info',
      category: 'Resolver',
      message: `Fetching job with messageId ${messageId}`,
    });
    const findOneByMessageIdPromise =
      this.jobService.findByMessageId(messageId);
    this.sentryService.instance().addBreadcrumb({
      level: 'info',
      category: 'Resolver',
      message: `Fetched job with messageId ${messageId}`,
    });
    return findOneByMessageIdPromise;
  }

  @Mutation('updateJob')
  public update(@Args('updateJobInput') updateJobInput: UpdateJobInput) {
    this.sentryService.instance().addBreadcrumb({
      level: 'info',
      category: 'Resolver',
      message: `Updating job with id ${updateJobInput._id}`,
    });
    const findOneByMessageIdPromise = this.jobService.update(
      updateJobInput._id,
      updateJobInput,
    );
    this.sentryService.instance().addBreadcrumb({
      level: 'info',
      category: 'Resolver',
      message: `Updated job with id ${updateJobInput._id}`,
    });
    return findOneByMessageIdPromise;
  }

  @Mutation('removeJob')
  public remove(@Args('id') id: string) {
    this.sentryService.instance().addBreadcrumb({
      level: 'info',
      category: 'Resolver',
      message: `Removing job with id ${id}`,
    });
    const removePromise = this.jobService.remove(id);

    this.sentryService.instance().addBreadcrumb({
      level: 'info',
      category: 'Resolver',
      message: `Removed job with id ${id}`,
    });
    return removePromise;
  }
}
