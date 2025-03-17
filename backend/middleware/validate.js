const validate = (schema) => async (req, res, next) => {
    try {
        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.details.map(d => d.message)
        });
    }
};

export default validate;