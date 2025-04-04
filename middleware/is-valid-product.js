const {body, check} = require("express-validator")

exports.titleCheck = [
    body("title")
        .trim()
        .isAlpha()
]

exports.priceCheck = [
    body("price")
        .trim()
        .isNumeric()
]