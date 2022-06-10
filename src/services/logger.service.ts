/* eslint-disable no-console */
import chalk from 'chalk';
import dayjs from 'dayjs';

class Logger {
  private static logger: Logger;

  public info(message: string): void {
    console.log(
      chalk.green(`✔ ${dayjs().format('YYYY-MM-DD HH:mm:ss')} : `, chalk.underline(message))
    );
  }

  public warn(message: string): void {
    console.log(
      chalk.yellow(
        `⚠ ${dayjs().format('YYYY-MM-DD HH:mm:ss')} : `, chalk.underline(message)
      )
    );
  }

  public error(message: string): void {
    console.log(
      chalk.red(`⛔ ${dayjs().format('YYYY-MM-DD HH:mm:ss')} : `, chalk.underline(message))
    );
  }

  public getInstance(): Logger {
    if (!Logger.logger) {
      Logger.logger = new Logger();
    }
    return Logger.logger;
  }
}

export const logger = new Logger();
