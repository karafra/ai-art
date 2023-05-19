import { Test, TestingModule } from '@nestjs/testing';
import { MessageActionRow, MessageEmbed } from 'discord.js';
import { HelpService } from '../../services/commands/help/help.service';
import { HelpCommand } from './help.command';

describe('first', () => {
  let service: HelpCommand;
  const mockHelpService = {
    getHelpAtIndex: jest.fn(),
  };
  const mockInteraction = {
    reply: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HelpCommand,
        {
          provide: HelpService,
          useValue: mockHelpService,
        },
      ],
    }).compile();
    service = module.get<HelpCommand>(HelpCommand);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handle', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('Should get help at index 0', async () => {
      // Given
      const index = 0;
      const expectedHelp = new MessageEmbed({
        author: {
          name: 'test',
        },
      });
      mockHelpService.getHelpAtIndex.mockReturnValue(expectedHelp);
      // When
      await service.handler(mockInteraction as any);
      // Then
      expect(mockHelpService.getHelpAtIndex).toBeCalledTimes(1);
      expect(mockHelpService.getHelpAtIndex).toBeCalledWith(index);
      expect(mockInteraction.reply).toBeCalledWith({
        embeds: [expectedHelp],
        components: [expect.any(MessageActionRow)],
        ephemeral: true,
      });
    });
  });
});
