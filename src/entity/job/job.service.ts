import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { MongoRepository } from 'typeorm';
import { CreateJobInput } from './dto/create-job.input';
import { UpdateJobInput } from './dto/update-job.input';
import { Job } from './entities/job.entity';

@Injectable()
export class JobService {
  public constructor(
    @InjectSentry()
    private readonly sentryService: SentryService,
    @InjectRepository(Job)
    private readonly repository: MongoRepository<Job>,
  ) {}

  public async create(createJobInput: CreateJobInput): Promise<Job> {
    this.sentryService.instance().addBreadcrumb({
      category: 'Database',
      level: 'info',
      message: 'Creating job',
    });
    const result = await this.repository.save(createJobInput);
    this.sentryService.instance().addBreadcrumb({
      category: 'Database',
      level: 'info',
      message: 'Job created',
    });
    return result;
  }

  public async findAll(): Promise<Job[]> {
    this.sentryService.instance().addBreadcrumb({
      category: 'Database',
      level: 'info',
      message: 'Finding all jobs in database',
    });
    const result = await this.repository.find();
    this.sentryService.instance().addBreadcrumb({
      category: 'Database',
      level: 'info',
      message: `Found ${result.length} jobs in database`,
    });
    return result;
  }

  public async findByMessageId(messageId: string) {
    this.sentryService.instance().addBreadcrumb({
      category: 'Database',
      level: 'info',
      message: `Finding job with messageId ${messageId} jobs in database`,
    });
    const result = await this.repository.findOneBy({
      where: {
        messageId: messageId,
      },
    });
    this.sentryService.instance().addBreadcrumb({
      category: 'Database',
      level: 'info',
      message: `Found job with messageId ${messageId} in database`,
    });
    return result;
  }

  public async findOne(id: string): Promise<Job> {
    this.sentryService.instance().addBreadcrumb({
      category: 'Database',
      level: 'info',
      message: `Querying for job with id ${id}`,
    });
    const result = await this.repository.findOne({
      where: {
        _id: id,
      },
    });
    this.sentryService.instance().addBreadcrumb({
      category: 'Database',
      level: 'info',
      message:
        result === null
          ? `Haven't found any jobs with id ${id}`
          : `Found job with id ${id}`,
    });
    return result;
  }

  public async update(
    id: string,
    updateJobInput: UpdateJobInput,
  ): Promise<Job> {
    this.sentryService.instance().addBreadcrumb({
      category: 'Database',
      level: 'info',
      message: `Updating job with id ${id}`,
    });

    const operation = await this.repository.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: updateJobInput,
      },
    );
    this.sentryService.instance().addBreadcrumb({
      category: 'Database',
      level: 'info',
      message: `Updated job with id ${id}`,
    });
    return operation.value;
  }

  public async remove(id: string) {
    this.sentryService.instance().addBreadcrumb({
      category: 'Database',
      level: 'info',
      message: `Removing job with id ${id}`,
    });
    const operation = await this.repository.findOneAndDelete({
      _id: id,
    });
    this.sentryService.instance().addBreadcrumb({
      category: 'Database',
      level: 'info',
      message: `Removed job with id ${id}`,
    });
    return operation.value;
  }
}
