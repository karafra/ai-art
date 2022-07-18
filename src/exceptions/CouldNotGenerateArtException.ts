export class CouldNotGenerateArtException extends Error {
  public constructor(serviceName: string, prompt: string, style?: string) {
    super(
      `Could not generate art "${prompt}" based on ${serviceName}${
        style ? ' in style "' + style + '"' : ''
      }`,
    );
  }
}
