/**
 * Exception thrown when wombo art generation fails.
 *
 * @author Karafra
 * @since 2.1.5
 */
export class CouldNotGenerateWomboArtException extends Error {
  public constructor(message: string) {
    super(message);
  }
}
