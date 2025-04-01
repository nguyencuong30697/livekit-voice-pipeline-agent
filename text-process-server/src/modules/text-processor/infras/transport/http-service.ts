import type { ITextProcessorUseCase } from '../../interface';
import type { TextProcessorRequestDTO } from '../../model/dto';
import type { Request, Response } from 'express';

export class TextProcessorHttpService {
  constructor(private readonly useCase: ITextProcessorUseCase) {}

  /**
   * @swagger
   * /text-processor/truncate:
   *   post:
   *     summary: Truncate text to a maximum reading time
   *     description: Truncates the provided text to a maximum reading time (default 60 seconds)
   *     tags:
   *       - Text Processing
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TextProcessorRequest'
   *     responses:
   *       200:
   *         description: Text processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TextProcessorResponse'
   *       400:
   *         description: Invalid request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ServerError'
   */
  async truncateAPI(req: Request, res: Response) {
    try {
      const requestData: TextProcessorRequestDTO = {
        text: req.body.text,
      };

      // Process the text
      const result = await this.useCase.truncate(requestData);
      res.status(200).json({ data: result });
    } catch (error) {
      throw error;
    }
  }
}
