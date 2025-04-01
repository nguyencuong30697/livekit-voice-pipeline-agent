import { setupTextProcessorHexagon } from './modules/text-processor';
import { config } from './share/component/config';
import { swaggerSpec } from './share/component/swagger';
import { WinstonLogger } from './share/component/winston-logger';
import cors from 'cors';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import 'module-alias/register';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { responseErr } from './share/app-error';

(async () => {
  // Initialize logger
  const logger = new WinstonLogger();

  logger.info('Connection has been established successfully.');

  const app = express();
  const port = config.port;

  // Setup middleware
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  // API routes
  app.use('/v1/text-processor', setupTextProcessorHexagon());

  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    responseErr(err, res);
    return next();
  });

  app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
    logger.info(`Swagger documentation available at http://localhost:${port}/api-docs`);
  });
})();
