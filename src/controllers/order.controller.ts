import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';

export class OrderController {
  public static async checkout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cartId = req.headers['x-cart-id'] as string;
      const userId = req.user?.userId;
      const { customerEmail, customerPhone, shippingAddress, paymentMethod } = req.body;

      const result = await OrderService.checkout({
        cartId,
        customerEmail,
        customerPhone,
        shippingAddress,
        paymentMethod,
        userId,
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

  public static async getMyOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const result = await OrderService.getMyOrders(userId, page, limit);

      res.status(200).json({
        status: 'success',
        data: result.orders,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const requestingUserId = req.user?.userId;

      const order = await OrderService.getOrderById(id, requestingUserId);

      res.status(200).json({
        status: 'success',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
}
