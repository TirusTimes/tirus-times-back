import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../errors/AppErrors';
import { IMatch, IMatchUpdate } from '../helpers/dto';
import { MatchService } from '../services/matchService';
const matchServiceInstance = new MatchService();

export class MatchController {
  async createMatch(request: Request, response: Response): Promise<Response> {
    try {
      const match = await matchServiceInstance.createMatch({
        ...(request.body as IMatch)
      });
      return response.status(StatusCodes.OK).send(match);
    } catch (err) {
      if (err instanceof AppError) { return response.status(err.statusCode).json({ error: err.message }); }
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }

  async updateMatch(request: Request, response: Response): Promise<Response> {
    try {
      const id = request.params.id;
      const updatedMatch = await matchServiceInstance.updateMatch(Number(id), {
        ...(request.body as IMatchUpdate)
      });
      return response.status(StatusCodes.OK).send(updatedMatch);
    } catch (err) {
      if (err instanceof AppError) { return response.status(err.statusCode).json({ error: err.message }); }
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }

  async updateMatchStatus(request: Request, response: Response): Promise<Response> {
    try {
      const id = request.params.id;
      const { adminID, status } = request.body;
      const updatedMatchStatus = await matchServiceInstance.updateMatchStatus(Number(id), adminID, status);
      return response.status(StatusCodes.OK).send(updatedMatchStatus);
    } catch (err) {
      if (err instanceof AppError) { return response.status(err.statusCode).json({ error: err.message }); }
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }

  async getMatch(request: Request, response: Response): Promise<Response> {
    try {
      const id = request.params.id;
      const match = await matchServiceInstance.getMatch(Number(id));
      return response.status(StatusCodes.OK).send(match);
    } catch (err) {
      if (err instanceof AppError) { return response.status(err.statusCode).json({ error: err.message }); }
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }

  async getMatchByGroupId(request: Request, response: Response): Promise<Response> {
    try {
      const id = request.params.id;
      const match = await matchServiceInstance.getMatchByGroupId(Number(id));
      return response.status(StatusCodes.OK).send(match);
    } catch (err) {
      if (err instanceof AppError) { return response.status(err.statusCode).json({ error: err.message }); }
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }

  async getUsersMatch(request: Request, response: Response): Promise<Response> {
    try {
      const id = request.params.id;
      const match = await matchServiceInstance.getAllUsersByMatch(Number(id));
      return response.status(StatusCodes.OK).send(match);
    } catch (err) {
      if (err instanceof AppError) { return response.status(err.statusCode).json({ error: err.message }); }
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }

  async getAllMatchs(request: Request, response: Response): Promise<Response> {
    try {
      const matchs = await matchServiceInstance.getAllMatchs();
      return response.status(StatusCodes.OK).send(matchs);
    } catch (err) {
      if (err instanceof AppError) { return response.status(err.statusCode).json({ error: err.message }); }
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }

  async separateTeam(request: Request, response: Response): Promise<Response> {
    try {
      const id = request.params.id;
      const teams = await matchServiceInstance.separateTeams(Number(id));
      return response.status(StatusCodes.OK).send(teams);
    } catch (err) {
      if (err instanceof AppError) { return response.status(err.statusCode).json({ error: err.message }); }
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }
}
