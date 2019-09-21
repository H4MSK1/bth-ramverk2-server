import { join } from 'path';
import { config } from 'dotenv';

config({
  path: join(
    `${__dirname}/../../config/`,
    `.env.${process.env.NODE_ENV || 'development'}`,
  ),
});
