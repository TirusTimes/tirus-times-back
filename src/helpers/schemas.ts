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

export { schemaCreate }
