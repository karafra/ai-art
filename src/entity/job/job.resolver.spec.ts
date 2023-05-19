import { Test, TestingModule } from '@nestjs/testing';
import { UpdateJobInput } from './dto/update-job.input';
import { JobResolver } from './job.resolver';
import { JobService } from './job.service';

describe('JobResolver', () => {
  let resolver: JobResolver;
  const mockJobService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByMessageId: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobResolver,
        {
          provide: JobService,
          useValue: mockJobService,
        },
      ],
    }).compile();

    resolver = module.get<JobResolver>(JobResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
  describe('createJob', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('Should create job', () => {
      // Given
      const id = 'id';
      // When
      resolver.create(id as any);
      // Then
      expect(mockJobService.create).toBeCalledTimes(1);
      expect(mockJobService.create).toBeCalledWith(id);
    });
  });
  describe('findAllJobs', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('Should create job', () => {
      // Given
      const result = ['a', 'b'];
      mockJobService.findAll.mockReturnValue(result);
      // When
      const response = resolver.findAll();
      // Then
      expect(response).toBe(result);
      expect(mockJobService.findAll).toBeCalledTimes(1);
      expect(mockJobService.findAll).toBeCalledWith();
    });
  });
  describe('findOne', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('findOne', () => {
      // Given
      const id = 'id';
      const result = 'result';
      mockJobService.findOne.mockReturnValue(result);
      // When
      const response = resolver.findOne(id);
      // Then
      expect(response).toBe(result);
      expect(mockJobService.findOne).toBeCalledTimes(1);
      expect(mockJobService.findOne).toBeCalledWith(id);
    });
  });
  describe('findOneByMessageId', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('findOne', () => {
      // Given
      const id = 'id';
      const result = 'result';
      mockJobService.findByMessageId.mockReturnValue(result);
      // When
      const response = resolver.findOneByMessageId(id);
      // Then
      expect(response).toBe(result);
      expect(mockJobService.findByMessageId).toBeCalledTimes(1);
      expect(mockJobService.findByMessageId).toBeCalledWith(id);
    });
  });
  describe('findOneByMessageId', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('findOne', () => {
      // Given
      const id = 'id';
      const result = 'result';
      mockJobService.update.mockReturnValue(result);
      // When
      const response = resolver.update({ _id: id } as UpdateJobInput);
      // Then
      expect(response).toBe(result);
      expect(mockJobService.update).toBeCalledTimes(1);
      expect(mockJobService.update).toBeCalledWith(id, { _id: id });
    });
  });
  describe('remove', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('findOne', () => {
      // Given
      const id = 'id';
      const result = 'result';
      mockJobService.remove.mockReturnValue(result);
      // When
      const response = resolver.remove(id);
      // Then
      expect(response).toBe(result);
      expect(mockJobService.remove).toBeCalledTimes(1);
      expect(mockJobService.remove).toBeCalledWith(id);
    });
  });
});
