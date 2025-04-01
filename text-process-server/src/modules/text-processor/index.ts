import { Router } from 'express';
import { TextProcessorHttpService } from './infras/transport/http-service';
import { TextProcessorUseCase } from './usecase';

export const setupTextProcessorHexagon = () => {
  const router = Router();

  // Initialize Use case
  const useCase = new TextProcessorUseCase();

  // Initialize Http service
  const httpService = new TextProcessorHttpService(useCase);

  // Define routes for the text processor
  router.post('/truncate', httpService.truncateAPI.bind(httpService));
  return router;
};
