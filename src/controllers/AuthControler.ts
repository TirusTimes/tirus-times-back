import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken';
import { prismaClient } from "../database/prismaClient";

export class AuthController {
    async authenticate(request: Request, response: Response){
        const { username, password} = request.body;
        const secret = process.env.SECRET!;
        const user = await prismaClient.user.findFirst({
            where: {
                username
            }
        })

        
        if (!user) {
            return response.sendStatus(StatusCodes.UNAUTHORIZED)
          }

        if (password != user?.password) {
            return response.sendStatus(StatusCodes.UNAUTHORIZED)
          }

        const token = jwt.sign({id: user?.id}, secret, { expiresIn: '1d'})

        delete user.password;
        
        return response.json({
            user,
            token
        })
    }

}