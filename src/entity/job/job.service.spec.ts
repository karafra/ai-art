import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SENTRY_TOKEN } from '@ntegral/nestjs-sentry';
import { Job } from './entities/job.entity';
import { JobService } from './job.service';

describe('JobService', () => {
  let service: JobService;
  const mockAddBreadcrumb = jest.fn();
  const mockSentryService = {
    instance: jest.fn(() => ({
      addBreadcrumb: mockAddBreadcrumb,
    })),
  };
  const mockRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobService,
        {
          provide: getRepositoryToken(Job),
          useValue: mockRepository,
        },
        {
          provide: SENTRY_TOKEN,
          useValue: mockSentryService,
        },
      ],
    }).compile();

    service = module.get<JobService>(JobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('Should create job', async () => {
      // Given
      const result = 'result';
      const input = ['a'];
      mockRepository.save.mockResolvedValue(result);
      // When
      const response = await service.create(input as any);
      // Then
      expect(response).toBe(result);
      expect(mockSentryService.instance).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Database',
        level: 'info',
        message: 'Creating job',
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Database',
        level: 'info',
        message: 'Job created',
      });
    });

    it('Should create job with null', async () => {
      // Given
      const result = 'result';
      const input = null;
      mockRepository.save.mockResolvedValue(result);
      // When
      const response = await service.create(input as any);
      // Then
      expect(response).toBe(result);
      expect(mockSentryService.instance).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Database',
        level: 'info',
        message: 'Creating job',
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Database',
        level: 'info',
        message: 'Job created',
      });
    });
    describe('findAll', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });
      it('Should find multiple results', async () => {
        // Given
        const result = ['a', 'b'];
        mockRepository.find.mockResolvedValue(result);
        // When
        const response = await service.findAll();
        // Then
        expect(response).toBe(result);
        expect(mockSentryService.instance).toBeCalledTimes(2);
        expect(mockAddBreadcrumb).toBeCalledTimes(2);
        expect(mockAddBreadcrumb).toBeCalledWith({
          category: 'Database',
          level: 'info',
          message: 'Finding all jobs in database',
        });
        expect(mockAddBreadcrumb).toBeCalledWith({
          category: 'Database',
          level: 'info',
          message: `Found ${result.length} jobs in database`,
        });
      });
      it('Should find one result', async () => {
        // Given
        const result = ['a'];
        mockRepository.find.mockResolvedValue(result);
        // When
        const response = await service.findAll();
        // Then
        expect(response).toBe(result);
        expect(mockSentryService.instance).toBeCalledTimes(2);
        expect(mockAddBreadcrumb).toBeCalledTimes(2);
        expect(mockAddBreadcrumb).toBeCalledWith({
          category: 'Database',
          level: 'info',
          message: 'Finding all jobs in database',
        });
        expect(mockAddBreadcrumb).toBeCalledWith({
          category: 'Database',
          level: 'info',
          message: `Found ${result.length} jobs in database`,
        });
      });
      it('Should find zero results', async () => {
        // Given
        const result = [];
        mockRepository.find.mockResolvedValue(result);
        // When
        const response = await service.findAll();
        // Then
        expect(response).toBe(result);
        expect(mockSentryService.instance).toBeCalledTimes(2);
        expect(mockAddBreadcrumb).toBeCalledTimes(2);
        expect(mockAddBreadcrumb).toBeCalledWith({
          category: 'Database',
          level: 'info',
          message: 'Finding all jobs in database',
        });
        expect(mockAddBreadcrumb).toBeCalledWith({
          category: 'Database',
          level: 'info',
          message: `Found ${result.length} jobs in database`,
        });
      });
    });
    describe('findOne', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });
      it('Should find one job', async () => {
        // Given
        const id = 'id';
        const result = 'result';
        mockRepository.findOne.mockResolvedValue(result);
        // When
        const response = await service.findOne(id);
        // Then
        expect(response).toBe(result);
        expect(mockRepository.findOne).toBeCalledTimes(1);
        expect(mockRepository.findOne).toBeCalledWith({
          where: {
            _id: id,
          },
        });
        expect(mockAddBreadcrumb).toBeCalledTimes(2);
        expect(mockAddBreadcrumb).toBeCalledWith({
          category: 'Database',
          level: 'info',
          message: `Querying for job with id ${id}`,
        });
        expect(mockAddBreadcrumb).toBeCalledWith({
          category: 'Database',
          level: 'info',
          message: `Found job with id ${id}`,
        });
      });
      it('Should not find job', async () => {
        // Given
        const id = 'id';
        const result = null;
        mockRepository.findOne.mockResolvedValue(result);
        // When
        const response = await service.findOne(id);
        // Then
        expect(response).toBe(result);
        expect(mockRepository.findOne).toBeCalledTimes(1);
        expect(mockRepository.findOne).toBeCalledWith({
          where: {
            _id: id,
          },
        });
        expect(mockAddBreadcrumb).toBeCalledTimes(2);
        expect(mockAddBreadcrumb).toBeCalledWith({
          category: 'Database',
          level: 'info',
          message: `Querying for job with id ${id}`,
        });
        expect(mockAddBreadcrumb).toBeCalledWith({
          category: 'Database',
          level: 'info',
          message: `Haven't found any jobs with id ${id}`,
        });
      });
    });
  });
  describe('findOneByMessageId', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('Should find one job', async () => {
      // Given
      const id = 'id';
      const result = 'result';
      mockRepository.findOneBy.mockResolvedValue(result);
      // When
      const response = await service.findByMessageId(id);
      // Then
      expect(response).toBe(result);
      expect(mockRepository.findOneBy).toBeCalledTimes(1);
      expect(mockRepository.findOneBy).toBeCalledWith({
        where: {
          messageId: id,
        },
      });
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Database',
        level: 'info',
        message: `Finding job with messageId ${id} jobs in database`,
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Database',
        level: 'info',
        message: `Found job with messageId ${id} in database`,
      });
    });
    it('Should not find job', async () => {
      // Given
      const id = 'id';
      const result = null;
      mockRepository.findOneBy.mockResolvedValue(result);
      // When
      const response = await service.findByMessageId(id);
      // Then
      expect(response).toBe(result);
      expect(mockRepository.findOneBy).toBeCalledTimes(1);
      expect(mockRepository.findOneBy).toBeCalledWith({
        where: {
          messageId: id,
        },
      });
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Database',
        level: 'info',
        message: `Finding job with messageId ${id} jobs in database`,
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Database',
        level: 'info',
        message: `Found job with messageId ${id} in database`,
      });
    });
  });
  describe('update', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('Should update', async () => {
      // Given
      const id = 'id';
      const result = {
        value: 'value',
      };
      const input = {
        images: ['a'],
      };
      mockRepository.findOneAndUpdate.mockResolvedValue(result);
      // When
      const response = await service.update(id, input as any);
      // Then
      expect(response).toBe(result.value);
      expect(mockRepository.findOneAndUpdate).toBeCalledTimes(1);
      expect(mockRepository.findOneAndUpdate).toBeCalledWith(
        {
          _id: id,
        },
        {
          $set: input,
        },
      );
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Database',
        level: 'info',
        message: `Updated job with id ${id}`,
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Database',
        level: 'info',
        message: `Updating job with id ${id}`,
      });
    });
    it('Should not fail on update of non existent job', async () => {
      // Given
      const id = 'id';
      const result = {
        value: null,
      };
      const input = {
        images: ['a'],
      };
      mockRepository.findOneAndUpdate.mockResolvedValue(result);
      // When
      const response = await service.update(id, input as any);
      // Then
      expect(response).toBe(result.value);
      expect(mockRepository.findOneAndUpdate).toBeCalledTimes(1);
      expect(mockRepository.findOneAndUpdate).toBeCalledWith(
        {
          _id: id,
        },
        {
          $set: input,
        },
      );
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Database',
        level: 'info',
        message: `Updated job with id ${id}`,
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Database',
        level: 'info',
        message: `Updating job with id ${id}`,
      });
    });
  });
  describe('findOneByMessageId', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('Should find one job', async () => {
      // Given
      const id = 'id';
      const result = 'result';
      mockRepository.findOneBy.mockResolvedValue(result);
      // When
      const response = await service.findByMessageId(id);
      // Then
      expect(response).toBe(result);
      expect(mockRepository.findOneBy).toBeCalledTimes(1);
      expect(mockRepository.findOneBy).toBeCalledWith({
        where: {
          messageId: id,
        },
      });
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Database',
        level: 'info',
        message: `Finding job with messageId ${id} jobs in database`,
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Database',
        level: 'info',
        message: `Found job with messageId ${id} in database`,
      });
    });
    it('Should not find job', async () => {
      // Given
      const id = 'id';
      const result = null;
      mockRepository.findOneBy.mockResolvedValue(result);
      // When
      const response = await service.findByMessageId(id);
      // Then
      expect(response).toBe(result);
      expect(mockRepository.findOneBy).toBeCalledTimes(1);
      expect(mockRepository.findOneBy).toBeCalledWith({
        where: {
          messageId: id,
        },
      });
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Database',
        level: 'info',
        message: `Finding job with messageId ${id} jobs in database`,
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Database',
        level: 'info',
        message: `Found job with messageId ${id} in database`,
      });
    });
  });
  describe('delete', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('Should remove document', async () => {
      // Given
      const id = 'id';
      const result = {
        value: 'value',
      };
      mockRepository.findOneAndDelete.mockResolvedValue(result);
      // When
      const response = await service.remove(id);
      // Then
      expect(response).toBe(result.value);
      expect(mockRepository.findOneAndDelete).toBeCalledTimes(1);
      expect(mockRepository.findOneAndDelete).toBeCalledWith({
        _id: id,
      });
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Database',
        level: 'info',
        message: `Removing job with id ${id}`,
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Database',
        level: 'info',
        message: `Removed job with id ${id}`,
      });
    });
    it('Should not fail on non existent document', async () => {
      // Given
      const id = 'id';
      const result = {
        value: null,
      };
      mockRepository.findOneAndDelete.mockResolvedValue(result);
      // When
      const response = await service.remove(id);
      // Then
      expect(response).toBe(result.value);
      expect(mockRepository.findOneAndDelete).toBeCalledTimes(1);
      expect(mockRepository.findOneAndDelete).toBeCalledWith({
        _id: id,
      });
      expect(mockAddBreadcrumb).toBeCalledTimes(2);
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Database',
        level: 'info',
        message: `Removing job with id ${id}`,
      });
      expect(mockAddBreadcrumb).toBeCalledWith({
        category: 'Database',
        level: 'info',
        message: `Removed job with id ${id}`,
      });
    });
  });
});
