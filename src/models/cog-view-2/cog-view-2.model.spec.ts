import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { CogView2Model } from './cog-view-2.model';

describe('CogView2Service', () => {
  let service: CogView2Model;
  const cogView2ResponseObjectPending = {
    status: 'PENDING',
    hash: 'hash',
    duration: 1,
    average_duration: 2,
    data: {
      data: ['1', '1', '1', '1', '1', '1', '1', '1', '1'],
    },
  };
  const cogView2ResponseObjectFinished = {
    status: 'COMPLETE',
    hash: 'hash',
    duration: 1,
    average_duration: 2,
    data: {
      data: [
        '1',
        '1',
        ['data:image/png;base64a'],
        '1',
        '1',
        '1',
        '1',
        '1',
        '1',
        '1',
      ],
    },
  };
  const cogView2ResponsePending = {
    data: cogView2ResponseObjectPending,
  };
  const cogView2ResponseFinished = {
    data: cogView2ResponseObjectFinished,
  };
  const mockHttpService = {
    axiosRef: {
      post: jest.fn(),
    },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CogView2Model,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<CogView2Model>(CogView2Model);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getResponse', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('Should get response', async () => {
      // Given
      const prompt = 'prompt';
      mockHttpService.axiosRef.post
        .mockResolvedValueOnce(cogView2ResponsePending)
        .mockResolvedValueOnce(cogView2ResponseFinished);
      // When
      const response = await service.getResponse(prompt);
      // Then
      expect(response).toBe(cogView2ResponseFinished);
      expect(mockHttpService.axiosRef.post).toBeCalledTimes(2);
      expect(mockHttpService.axiosRef.post).toBeCalledWith(
        'https://hf.space/embed/THUDM/CogView2/api/queue/push/',
        {
          fn_index: 0,
          data: [prompt, false, 'mainbody', expect.any(Number), true, 9],
          action: 'predict',
          session_hash: expect.any(String),
          headers: {
            Accept: 'application/json',
          },
        },
      );
    });
    it('Should get response with style', async () => {
      // Given
      const prompt = 'prompt';
      const style = 'chinese';
      mockHttpService.axiosRef.post
        .mockResolvedValueOnce(cogView2ResponsePending)
        .mockResolvedValueOnce(cogView2ResponseFinished);
      // When
      const response = await service.getResponse(prompt, style);
      // Then
      expect(response).toBe(cogView2ResponseFinished);
      expect(mockHttpService.axiosRef.post).toBeCalledTimes(2);
      expect(mockHttpService.axiosRef.post).toBeCalledWith(
        'https://hf.space/embed/THUDM/CogView2/api/queue/push/',
        {
          fn_index: 0,
          data: [prompt, false, style, expect.any(Number), true, 9],
          action: 'predict',
          session_hash: expect.any(String),
          headers: {
            Accept: 'application/json',
          },
        },
      );
    });
    it('Should get response and wait', async () => {
      // Given
      const prompt = 'prompt';
      const style = 'chinese';
      mockHttpService.axiosRef.post
        .mockResolvedValueOnce(cogView2ResponsePending)
        .mockResolvedValueOnce(cogView2ResponsePending)
        .mockResolvedValueOnce(cogView2ResponseFinished);
      // When
      const response = await service.getResponse(prompt, style);
      // Then
      expect(response).toBe(cogView2ResponseFinished);
      expect(mockHttpService.axiosRef.post).toBeCalledTimes(3);
      expect(mockHttpService.axiosRef.post).toBeCalledWith(
        'https://hf.space/embed/THUDM/CogView2/api/queue/push/',
        {
          fn_index: 0,
          data: [prompt, false, style, expect.any(Number), true, 9],
          action: 'predict',
          session_hash: expect.any(String),
          headers: {
            Accept: 'application/json',
          },
        },
      );
    });
  });
  describe('getImageArray', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('Should get image array', async () => {
      // Given
      const prompt = 'prompt';
      const style = 'chinese';
      mockHttpService.axiosRef.post
        .mockResolvedValueOnce(cogView2ResponsePending)
        .mockResolvedValueOnce(cogView2ResponseFinished);
      // When
      const response = await service.getImageArray(prompt, style);
      // Then
      expect(response).toStrictEqual(expect.any(Array));
      expect(mockHttpService.axiosRef.post).toBeCalledTimes(2);
      expect(mockHttpService.axiosRef.post).toBeCalledWith(
        'https://hf.space/embed/THUDM/CogView2/api/queue/push/',
        {
          fn_index: 0,
          data: [prompt, false, style, expect.any(Number), true, 9],
          action: 'predict',
          session_hash: expect.any(String),
          headers: {
            Accept: 'application/json',
          },
        },
      );
    });
  });
});
