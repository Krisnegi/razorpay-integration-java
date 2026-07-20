import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { validate } from '../middleware/validate';
import {
  getCartHeaderSchema,
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
  clearCartSchema,
} from '../schemas/cart.schema';

const router = Router();

router.get('/', validate(getCartHeaderSchema), CartController.getCart);
router.post('/items', validate(addToCartSchema), CartController.addItem);
router.patch('/items/:productId', validate(updateCartItemSchema), CartController.updateItemQuantity);
router.delete('/items/:productId', validate(removeCartItemSchema), CartController.removeItem);
router.delete('/', validate(clearCartSchema), CartController.clearCart);

export default router;
