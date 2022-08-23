/**
 * Error thrown when Google toolkit authentication fails.
 *
 * @author Karafra
 * @since 2.1.5
 */
export class GoogleAuthenticationToolkitError extends Error {
  public constructor(message: string) {
    super(message);
  }
}
