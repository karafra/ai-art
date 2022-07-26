import { CreateJobInput } from './create-job.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateJobInput extends PartialType(CreateJobInput) {
  declare _id: string;
}
