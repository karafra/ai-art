import { INJECT_DISCORD_CLIENT } from '@discord-nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { SENTRY_TOKEN } from '@ntegral/nestjs-sentry';
import { MessageActionRow, MessageAttachment } from 'discord.js';
import { JobResolver } from '../../entity/job/job.resolver';
import { BotGateway } from './discord.gateway';

describe('DiscordService', () => {
  let service: BotGateway;
  const mockSentryInstance = {
    addBreadcrumb: jest.fn(),
  };
  const mockSentryService = {
    instance: jest.fn().mockReturnValue(mockSentryInstance),
  };
  const mockJobResolver = {
    findOneByMessageId: jest.fn(),
  };
  const mockWebsocket = {
    ping: 1,
  };
  const botId = '0';
  const mockDiscordClient = {
    ws: mockWebsocket,
    user: {
      id: botId,
    },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotGateway,
        {
          provide: JobResolver,
          useValue: mockJobResolver,
        },
        {
          provide: INJECT_DISCORD_CLIENT,
          useValue: mockDiscordClient,
        },
        {
          provide: SENTRY_TOKEN,
          useValue: mockSentryService,
        },
      ],
    }).compile();

    service = module.get<BotGateway>(BotGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onReady', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('Should run startup without problems', () => {
      // Given
      // When
      service.onReady();
      // Then
      expect(mockSentryInstance.addBreadcrumb).toBeCalledTimes(1);
      expect(mockSentryInstance.addBreadcrumb).toBeCalledWith({
        level: 'info',
        message: 'Gateway connected to Discord',
        category: 'Gateway',
      });
    });
  });
  describe('onError', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('Should run on error without problems', () => {
      // Given
      const error = new Error('Test error');
      // When
      service.onError(error);
      // Then
      expect(mockSentryInstance.addBreadcrumb).toBeCalledTimes(1);
      expect(mockSentryInstance.addBreadcrumb).toBeCalledWith({
        level: 'error',
        message: `Discord gateway WS connection failed with error ${error.message}`,
        category: 'Gateway',
      });
    });
  });
  describe('ibReactionAdd', () => {
    let mockAuthorId;
    let mockAuthor;
    let mockMessage;
    let mockEmoji;
    let mockMessageReaction;
    let mockUser;
    const mockMessageReactionRemove = jest.fn();
    const mockUserSend = jest.fn();
    beforeEach(() => {
      jest.clearAllMocks();
      mockAuthorId = 'authorId';
      mockAuthor = {
        id: mockAuthorId,
      };
      mockMessage = {
        author: mockAuthor,
      };
      mockEmoji = {
        identifier: '%E2%9C%89%EF%B8%8F',
      };
      mockMessageReaction = {
        emoji: mockEmoji,
        message: mockMessage,
        remove: mockMessageReactionRemove,
      };
      mockUser = {
        send: mockUserSend,
      };
    });
    it('Should run on reaction to non bot message', async () => {
      // Given
      mockMessageReaction.message.author.id = 1;
      // When
      await service.onMessageReactionAdd(mockMessageReaction, mockUser);
      // Then
      expect(mockSentryInstance.addBreadcrumb).toBeCalledTimes(2);
      expect(mockSentryInstance.addBreadcrumb).toBeCalledWith({
        level: 'info',
        category: 'Gateway',
        message: 'reaction collected',
      });
      expect(mockSentryInstance.addBreadcrumb).toBeCalledWith({
        level: 'debug',
        category: 'Gateway',
        message: 'Not dispatching, reaction is non related',
      });
    });
    it('Should run on bot message without error', async () => {
      // Given
      mockMessageReaction.message.author.id = mockDiscordClient.user.id;
      const dbRecord = {
        images: ['a'],
        messageLink: 'https://lorempicsum.com',
      };
      mockJobResolver.findOneByMessageId.mockResolvedValue(dbRecord);
      // When
      await service.onMessageReactionAdd(mockMessageReaction, mockUser);
      // Then
      expect(mockMessageReactionRemove).toBeCalledTimes(1);
      expect(mockJobResolver.findOneByMessageId).toBeCalledTimes(1);
      expect(mockJobResolver.findOneByMessageId).toBeCalledWith(
        mockMessageReaction.message.id,
      );
      expect(mockUserSend).toBeCalledTimes(1);
      expect(mockUserSend).toBeCalledWith({
        files: [expect.any(MessageAttachment)],
        components: [expect.any(MessageActionRow)],
      });
      expect(mockSentryInstance.addBreadcrumb).toBeCalledTimes(3);
      expect(mockSentryInstance.addBreadcrumb).toBeCalledWith({
        level: 'info',
        category: 'Gateway',
        message: 'reaction collected',
      });
      expect(mockSentryInstance.addBreadcrumb).toBeCalledWith({
        level: 'info',
        category: 'Gateway',
        message: 'Messages sent do DM successfully',
      });
      expect(mockSentryInstance.addBreadcrumb).toBeCalledWith({
        level: 'debug',
        category: 'Gateway',
        message: 'Fetched record from database',
      });
    });
    it('Should fail gracefully if record is not in database', async () => {
      // Given
      mockMessageReaction.message.author.id = mockDiscordClient.user.id;
      mockJobResolver.findOneByMessageId.mockResolvedValue(null);
      // When
      await service.onMessageReactionAdd(mockMessageReaction, mockUser);
      // Then
      expect(mockMessageReactionRemove).toBeCalledTimes(1);
      expect(mockJobResolver.findOneByMessageId).toBeCalledTimes(1);
      expect(mockJobResolver.findOneByMessageId).toBeCalledWith(
        mockMessageReaction.message.id,
      );
      expect(mockUserSend).toBeCalledTimes(0);
      expect(mockSentryInstance.addBreadcrumb).toBeCalledTimes(3);
      expect(mockSentryInstance.addBreadcrumb).toBeCalledWith({
        level: 'info',
        category: 'Gateway',
        message: 'reaction collected',
      });
      expect(mockSentryInstance.addBreadcrumb).toBeCalledWith({
        level: 'debug',
        category: 'Gateway',
        message: 'Record was empty, stopping execution',
      });
      expect(mockSentryInstance.addBreadcrumb).toBeCalledWith({
        level: 'debug',
        category: 'Gateway',
        message: 'Fetched record from database',
      });
    });
  });
});
