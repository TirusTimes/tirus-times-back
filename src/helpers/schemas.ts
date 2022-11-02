import * as Yup from 'yup'
const schemaCreate = Yup.object().shape({
    name: Yup.string().required(),
    age: Yup.number().required().positive().integer(),
})

export { schemaCreate }

