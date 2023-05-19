import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { CreateJobInput } from './dto/create-job.input';
import { UpdateJobInput } from './dto/update-job.input';
import { Job } from './entities/job.entity';

@Injectable()
export class JobService {
  public constructor(
    @InjectRepository(Job)
    private readonly repository: MongoRepository<Job>,
  ) {}

  public async create(createJobInput: CreateJobInput): Promise<Job> {
    return await this.repository.save(createJobInput);
  }

  public async findAll(): Promise<Job[]> {
    return await this.repository.find();
  }

  public async findByMessageId(messageId: string) {
    return await this.repository.findOneBy({
      where: {
        messageId: messageId,
      },
    });
  }

  public async findOne(id: string): Promise<Job> {
    const result = await this.repository.findOne({
      where: {
        _id: id,
      },
    });
    return result;
  }

  public async update(
    id: string,
    updateJobInput: UpdateJobInput,
  ): Promise<Job> {
    const operation = await this.repository.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: updateJobInput,
      },
    );
    return operation.value;
  }

  public async remove(id: string) {
    const operation = await this.repository.findOneAndDelete({
      _id: id,
    });
    return operation.value;
  }
}
