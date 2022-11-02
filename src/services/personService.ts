import { ICreatePerson } from "../helpers/dto";
import { schemaCreate } from "../helpers/schemas";

class personService {

    async createPerson({ name, age }: ICreatePerson): Promise<String>{
        schemaCreate.validate({ name, age },{
            abortEarly:false
        }).catch(err => {throw new Error(err.name)})

        return `Person {${name}, ${age}} created.`
    }


}

export { personService };

