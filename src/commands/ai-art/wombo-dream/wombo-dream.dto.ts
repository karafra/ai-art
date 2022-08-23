import { Choice, Param, ParamType } from '@discord-nestjs/core';
import { WomboDreamStyle } from '../../../types/api/wombo-dream';

/**
 * DTO for /ai-art wombo-dream command.
 *
 * @author Karafra
 * @since 2.1.5
 */
export class WomboDreamDto {
  /**
   * Prompt describing image.
   */
  @Param({
    name: 'prompt',
    description: 'Prompt describing image you want to generate',
    type: ParamType.STRING,
    required: true,
    autocomplete: true,
  })
  public prompt: string;

  /**
   * One of supported styles
   *
   * @see WomboDreamStyle
   */
  @Choice(WomboDreamStyle.styles)
  @Param({
    name: 'style',
    description: 'Style of wombo art',
    type: ParamType.STRING,
    required: false,
    autocomplete: true,
  })
  public style: string;
}
