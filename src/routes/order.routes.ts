import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { validate } from '../middleware/validate';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import { checkoutOrderSchema, getOrderByIdSchema } from '../schemas/order.schema';

const router = Router();

router.post('/checkout', optionalAuthenticate, validate(checkoutOrderSchema), OrderController.checkout);
router.get('/my-orders', authenticate, OrderController.getMyOrders);
router.get('/:id', optionalAuthenticate, validate(getOrderByIdSchema), OrderController.getOrderById);

export default router;
