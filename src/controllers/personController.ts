import { Request, Response } from "express";
import { ICreatePerson } from "../helpers/dto";
import { personService } from "../services/personService";
const personServiceInstance = new personService();

export class personController {

async createperson(request: Request, response: Response): Promise<Response> {
    try{
        const  { name, age }: ICreatePerson = request.body;
        const person = await personServiceInstance.createPerson({name, age})
        return response.status(201).send(person);
    }catch(err){
        if(err instanceof Error){
            return response.status(500).json({error: err.message});
        }
        const errorMessage = "Failed to do something exceptional"
            return response.status(500).json({error: errorMessage});
            
    }
}
}