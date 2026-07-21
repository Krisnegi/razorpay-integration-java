import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { validate } from '../middleware/validate';
import { verifyPaymentSchema } from '../schemas/payment.schema';

const router = Router();

router.post('/verify', validate(verifyPaymentSchema), PaymentController.verifyPayment);
router.post('/webhook', PaymentController.handleWebhook);

export default router;
