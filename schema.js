const Joi = require("joi");

module.exports.productValidationSchema = Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().optional(), // Optional
    price: Joi.number().required().min(0),
    originalPrice: Joi.number().min(0).optional(), // Optional
    stock: Joi.number().required().min(0),
    sku: Joi.string().trim().required(),
    categories: Joi.array().items(Joi.string().trim()).unique().optional(), // Optional
    tags: Joi.array().items(Joi.string().trim()).unique().optional(), // Optional
    brand: Joi.string().trim().optional(), // Optional
    attributes: Joi.object().pattern(Joi.string(), Joi.string()).optional(), // Optional
    specifications: Joi.object().pattern(Joi.string(), Joi.string()).optional(), // Optional
    rating: Joi.object().keys({
        average: Joi.number().default(0),
        reviewsCount: Joi.number().default(0),
        totalSold: Joi.number().default(0)
    }).default({ average: 0, reviewsCount: 0, totalSold: 0 }).optional(),
    imageUrl: Joi.string().uri().optional(), // Optional
    createdAt: Joi.date().default(() => new Date()),
});

// ✅ Add this below your productValidationSchema
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5), // Rating from 1 to 5
        Comment: Joi.string().trim().required(), // Ensure comment is required and trimmed
    }).required(),
});
