const {validationResult} = require("express-validator");

const validationController = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
        validationErrors: errors.mapped()
        });
    }
    next();
}

module.exports = validationController;