import * as Yup from 'yup';
import { Status } from './dto';
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
  name: Yup.string().required(),
  adminID: Yup.number().required()
});

const schemaCreateMatch = Yup.object().shape({
  location: Yup.string().required(),
  date: Yup.date().required(),
  time: Yup.string()
    .required()
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Time must has format HH:MM'
    ),
  playerLimit: Yup.number().required().positive().integer(),
  groupId: Yup.number().required(),
  adminID: Yup.number().required()
});

const schemaUpdateMatch = Yup.object().shape({
  location: Yup.string(),
  date: Yup.date(),
  time: Yup.string()
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Time must has format HH:MM'
    ),
  playerLimit: Yup.number().positive().integer(),
  adminID: Yup.number().required()
});

const schemaUpdateMatchStatus = Yup.object().shape({
  status: Yup.string().oneOf([Status.Open, Status.Started, Status.Evaluate, Status.Finished], 'Non-standard Status').required(),
  adminID: Yup.number().required()
});

const avaliationSchemaCreate = Yup.object().shape({
  avaliation: Yup.number().positive().required(),
  userId: Yup.number().required()
});

export { schemaCreateUser, schemaUpdateUser, groupSchemaCreate, schemaCreateMatch, schemaUpdateMatch, schemaUpdateMatchStatus, avaliationSchemaCreate };
