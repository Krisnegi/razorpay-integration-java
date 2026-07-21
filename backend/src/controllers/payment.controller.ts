import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';

export class PaymentController {
  public static async verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payment = await PaymentService.verifySignature(req.body);
      res.status(200).json({
        status: 'success',
        message: 'Payment verified and captured successfully',
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      if (!signature) {
        res.status(400).json({
          status: 'error',
          message: 'Missing x-razorpay-signature header',
        });
        return;
      }

      const rawBody = (req as any).rawBody;
      if (!rawBody) {
        res.status(400).json({
          status: 'error',
          message: 'Raw body required for webhook verification',
        });
        return;
      }

      const result = await PaymentService.handleWebhook(rawBody, signature);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
