import * as Yup from 'yup';
const schemaCreateUser = Yup.object().shape({
  username: Yup.string().required(),
  firstname: Yup.string().required(),
  lastname: Yup.string().required(),
  email: Yup.string().required(),
  password: Yup.string().required(),
  position: Yup.string().required(),
  age: Yup.number().required().positive().integer(),
  gender: Yup.string().required()
});

const schemaUpdateUser = Yup.object().shape({
  username: Yup.string(),
  firstname: Yup.string(),
  lastname: Yup.string(),
  email: Yup.string(),
  password: Yup.string(),
  position: Yup.string(),
  age: Yup.number().positive().integer(),
  gender: Yup.string()
});

const groupSchemaCreate = Yup.object().shape({
  name: Yup.string().required()
});

export { schemaCreateUser, schemaUpdateUser, groupSchemaCreate };
