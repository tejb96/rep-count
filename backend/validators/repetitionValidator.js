import Joi from 'joi';


const createRepetitionSchema = Joi.object({
    user: Joi.string().required(),
    type: Joi.string().valid('PushUps', 'squat', 'pullup', 'SitUps', 'deadlift').required(),
    repetitions: Joi.number().integer().min(1).required(),
    date: Joi.date().required()
});

const updateRepetitionSchema = Joi.object({
    type: Joi.string().valid('PushUps', 'squat', 'pullup', 'SitUps', 'deadlift').optional(),
    repetitions: Joi.number().integer().min(1).optional(),
    date: Joi.date().optional()
}).min(1);

const repetitionSchemas = { createRepetitionSchema, updateRepetitionSchema };
export default repetitionSchemas;
