/* eslint-disable no-console */
import chalk from 'chalk'
import dayjs from 'dayjs'

/**
 * Logging service
 *
 * @author Karafra
 * @since 1.0
 */
export class Logger {
  private static logger: Logger

  /**
   * Logs info message.
   *
   * @param message message to log
   */
  public info(message: string): void {
    console.log(
      chalk.green(`✔ ${dayjs().format('YYYY-MM-DD HH:mm:ss')} : `, chalk.underline(message))
    )
  }

  /**
   * Logs warning message.
   *
   * @param message message to log
   */
  public warn(message: string): void {
    console.log(
      chalk.yellow(`⚠ ${dayjs().format('YYYY-MM-DD HH:mm:ss')} : `, chalk.underline(message))
    )
  }

  /**
   * Logs error message.
   *
   * @param message message to log
   */
  public error(message: string): void {
    Logger.getInstance()
    console.log(
      chalk.red(`⛔ ${dayjs().format('YYYY-MM-DD HH:mm:ss')} : `, chalk.underline(message))
    )
  }

  /**
   *
   * @returns instance of logger
   */
  public static getInstance(): Logger {
    if (!this.logger) {
      this.logger = new Logger()
    }
    return Logger.logger
  }
}

export const logger = new Logger()
