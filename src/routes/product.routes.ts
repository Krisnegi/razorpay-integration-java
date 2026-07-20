import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { validate } from '../middleware/validate';
import { getProductsQuerySchema, getProductByIdSchema } from '../schemas/product.schema';

const router = Router();

router.get('/', validate(getProductsQuerySchema), ProductController.getProducts);
router.get('/:id', validate(getProductByIdSchema), ProductController.getProductById);

export default router;
