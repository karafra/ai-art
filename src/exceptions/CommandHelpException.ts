/**
 * Exception thrown when class declares it has help but property help is undefined.
 *
 * @author Karafra
 * @since 1.4.5
 */
export class CommandHelpException extends Error {
  constructor() {
    super('Are you sure you implemented field `public static help`?')
  }
}
