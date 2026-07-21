import { Request, Response, NextFunction } from 'express';
import { CartService } from '../services/cart.service';

export class CartController {
  public static async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cartId = req.headers['x-cart-id'] as string | undefined;
      const userId = req.user?.userId;
      const cart = await CartService.getCart(cartId, userId);

      res.status(200).json({
        status: 'success',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cartId = req.headers['x-cart-id'] as string | undefined;
      const userId = req.user?.userId;
      const { productId, quantity } = req.body;

      const cart = await CartService.addItem(cartId, productId, quantity, userId);

      res.status(200).json({
        status: 'success',
        message: 'Item added to cart',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateItemQuantity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cartId = req.headers['x-cart-id'] as string;
      const productId = parseInt(req.params.productId, 10);
      const { quantity } = req.body;

      const cart = await CartService.updateItemQuantity(cartId, productId, quantity);

      res.status(200).json({
        status: 'success',
        message: 'Cart item updated',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cartId = req.headers['x-cart-id'] as string;
      const productId = parseInt(req.params.productId, 10);

      const cart = await CartService.removeItem(cartId, productId);

      res.status(200).json({
        status: 'success',
        message: 'Item removed from cart',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async clearCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cartId = req.headers['x-cart-id'] as string;

      const cart = await CartService.clearCart(cartId);

      res.status(200).json({
        status: 'success',
        message: 'Cart cleared',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }
}
