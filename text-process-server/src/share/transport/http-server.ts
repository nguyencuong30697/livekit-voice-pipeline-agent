import type { Request, Response } from 'express';

export abstract class BaseHttpService<CreateDTO, UpdateDTO> {
  constructor() {}

  async createAPI(req: Request<any, any, CreateDTO>, res: Response) {
    // Implement create API
    res.status(200).json({ data: 'Created successfully' });
  }

  async getDetailAPI(req: Request, res: Response) {
    // Implement get detail API
    res.status(200).json({ data: 'Get detail successfully' });
  }

  async listAPI(req: Request, res: Response) {
    // Implement list API
    res.status(200).json({ data: 'List successfully' });
  }

  async updateAPI(req: Request<any, any, UpdateDTO>, res: Response) {
    // Implement update API
    res.status(200).json({ data: 'Updated successfully' });
  }

  async deleteAPI(req: Request, res: Response) {
    // Implement delete API
    res.status(200).json({ data: 'Deleted successfully' });
  }
}
