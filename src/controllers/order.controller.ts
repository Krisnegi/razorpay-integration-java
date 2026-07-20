import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';

export class OrderController {
  public static async checkout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cartId = req.headers['x-cart-id'] as string;
      const { customerEmail, customerPhone, shippingAddress, paymentMethod } = req.body;

      const result = await OrderService.checkout({
        cartId,
        customerEmail,
        customerPhone,
        shippingAddress,
        paymentMethod,
      });

      res.status(201).json({
        status: 'success',
        message: 'Order created successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const order = await OrderService.getOrderById(id);

      res.status(200).json({
        status: 'success',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
}
