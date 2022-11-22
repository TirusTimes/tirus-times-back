import * as Yup from 'yup'
const schemaCreate = Yup.object().shape({
    username: Yup.string().required(),
    firstname: Yup.string().required(),
    lastname: Yup.string().required(),
    email: Yup.string().required(),
    password: Yup.string().required(),
    position: Yup.string().required(),
    age: Yup.number().required().positive().integer(),
    gender: Yup.string().required()
})

const schemaUpdate = Yup.object().shape({
    username: Yup.string(),
    firstname: Yup.string(),
    lastname: Yup.string(),
    email: Yup.string(),
    password: Yup.string(),
    position: Yup.string(),
    age: Yup.number().positive().integer(),
    gender: Yup.string()
})

export { schemaCreate, schemaUpdate }

