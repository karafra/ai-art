import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';
import { Logger } from '@nestjs/common';
import { MigrationInterface } from 'typeorm';

/**
 * Creates capped Jobs collection if it does not exist.
 * @classdesc Database migration creating Collection "Job" and capping its size, so it does not overflow during runtime
 * @since 2.1.5
 * @author Karafra
 */
export class createCappedJobsCollection1661353047612
  implements MigrationInterface
{
  public name = 'Create capped Jobs collection 1661353047612';
  private readonly size = 400_000_000;

  private readonly logger = new Logger(
    createCappedJobsCollection1661353047612.name,
  );

  /**
   * Creates capped Job collection.
   *
   * @param queryRunner runner executing query
   */
  public async up(queryRunner: MongoQueryRunner): Promise<void> {
    this.logger.log(`Running migration ${this.name}`);
    this.logger.debug(
      `Creating capped collection "Jobs" with size ${this.size}B`,
    );
    await queryRunner.databaseConnection.db().createCollection('Job', {
      capped: true,
      size: this.size,
    });
    this.logger.debug('Collection "Jobs" created');
  }

  /**
   * This migration is starting migration. It cannot be reverted.
   *
   * @throws Error error is always thrown, this migration can not be undone
   */
  public async down(): Promise<void> {
    this.logger.log(`Reverting migration ${this.name}`);
    throw new Error('This is starting migration, it cannot be turned back');
  }
}
