import { PartialType } from '@nestjs/mapped-types';
import { CreateJobInput } from './create-job.input';

export class UpdateJobInput extends PartialType(CreateJobInput) {
  declare _id: string;
}
