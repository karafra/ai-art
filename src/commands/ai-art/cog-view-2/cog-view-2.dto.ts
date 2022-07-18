import { Choice, Param, ParamType } from '@discord-nestjs/core';

/**
 * Enum for style supported by cog-view-2
 *
 * @since 2.0.0
 * @author Karafra
 */
export enum Style {
  NONE = 'none',
  MAINBODY = 'mainbody',
  PHOTO = 'photo',
  FLAT = 'flat',
  COMICS = 'comics',
  OIL = 'oil',
  SKETCH = 'sketch',
  ISOMETRIC = 'isometric',
  WATERCOLOR = 'watercolor',
  CHINESE = 'chinese',
}

/**
 * DTO for cog view2 command.
 *
 * @author Karafra
 * @since 2.0.0
 */
export class CogView2CommandDto {
  @Param({
    name: 'prompt',
    description: 'Prompt from which generate art',
    type: ParamType.STRING,
    required: true,
    autocomplete: true,
  })
  public prompt: string;

  @Choice(Style)
  @Param({
    name: 'style',
    autocomplete: true,
    description: 'Style of art',
    required: false,
  })
  public style: Style;
}
