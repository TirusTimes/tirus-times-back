import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IAvaliation } from '../helpers/dto';
import { AvaliationService } from '../services/avaliationService';

const avaliationServiceInstance = new AvaliationService();

export class AvaliationController {
  async avaliation(request: Request, response: Response): Promise<Response> {
    try {
      const aval = avaliationServiceInstance.addAvaliation({
        ...(request.body as IAvaliation)
      });
      return response.status(StatusCodes.OK).send(aval);
    } catch (err) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }
}
