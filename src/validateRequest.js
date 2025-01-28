const Joi = require('joi');

const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

const validateQuery = Joi.object({
    ipAddress: Joi.string().regex(ipPattern).required(),
    periodDays: Joi.number().required(),
    period: Joi.number().required()
});

function validateRequestQuery({query}){
    const { error } = validateQuery.validate(query);
    if (error) return { success: false, status: 400, error: error.details[0].message };
    return { success: true, status: 200 }
}
  
module.exports = {
    validateRequestQuery
};