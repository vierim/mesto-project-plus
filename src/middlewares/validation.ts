import urlValidation from '../utils/validation';

const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;

export const validateCreateCardReq = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Название изображения должно содержать не менее 2 символов',
        'string.max': 'Название изображения должно содержать не более 30 символов',
        'any.required': 'Обязательное поле',
      }),
    link: Joi.string().required()
      .custom((value: string, helpers: any) => {
        if (urlValidation(value)) {
          return value;
        }

        return helpers.message('Неправильный формат ссылки на изображение');
      })
      .messages({
        'any.required': 'Обязательное поле',
      }),
  }),
});

export const validateIdParam = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom((value: string, helpers: any) => {
      if (ObjectId.isValid(value)) {
        return value;
      }

      return helpers.message('Невалидный id');
    }),
  }),
});

export const validateLoginReq = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .messages({
        'string.email': 'Неправильный формат электронной почты',
        'any.required': 'Обязательное поле',
      }),
    password: Joi.string().required()
      .messages({
        'any.required': 'Обязательное поле',
      }),
  }),
});

export const validateCreateUserReq = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Имя пользователя должно содержать не менее 2 символов',
        'string.max': 'Имя пользователя должно содержать не более 30 символов',
      }),
    about: Joi.string().min(2).max(200)
      .messages({
        'string.min': 'Описание пользователя должно содержать не менее 2 символов',
        'string.max': 'Описание пользователя должно содержать не более 200 символов',
      }),
    avatar: Joi.string()
      .custom((value: string, helpers: any) => {
        if (urlValidation(value)) {
          return value;
        }

        return helpers.message('Неправильный формат ссылки на аватар пользователя');
      }),
    email: Joi.string().required().email()
      .messages({
        'string.email': 'Неправильный формат электронной почты',
        'any.required': 'Обязательное поле',
      }),
    password: Joi.string().required()
      .messages({
        'any.required': 'Обязательное поле',
      }),
  }),
});

export const validateUpdateProfileReq = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Имя пользователя должно содержать не менее 2 символов',
        'string.max': 'Имя пользователя должно содержать не более 30 символов',
      }),
    about: Joi.string().min(2).max(200)
      .messages({
        'string.min': 'Описание пользователя должно содержать не менее 2 символов',
        'string.max': 'Описание пользователя должно содержать не более 200 символов',
      }),
  }),
});

export const validateUpdateAvatarReq = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .custom((value: string, helpers: any) => {
        if (urlValidation(value)) {
          return value;
        }

        return helpers.message('Неправильный формат ссылки на аватар пользователя');
      }),
  }),
});