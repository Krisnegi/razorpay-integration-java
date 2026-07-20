import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { validate } from '../middleware/validate';
import { checkoutOrderSchema, getOrderByIdSchema } from '../schemas/order.schema';

const router = Router();

router.post('/checkout', validate(checkoutOrderSchema), OrderController.checkout);
router.get('/:id', validate(getOrderByIdSchema), OrderController.getOrderById);

export default router;
