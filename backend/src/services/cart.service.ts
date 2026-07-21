import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error';

export class CartService {
  private static async getOrCreateCart(cartId?: string, userId?: number) {
    if (cartId) {
      const existingCart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: {
          items: {
            include: {
              product: true,
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (existingCart) {
        if (userId && existingCart.userId !== userId) {
          await prisma.cart.update({
            where: { id: existingCart.id },
            data: { userId },
          });
        }
        return existingCart;
      }
    }

    return await prisma.cart.create({
      data: {
        userId: userId || null,
      },
      include: {
        items: {
          include: {
            product: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  public static async getCart(cartId?: string, userId?: number) {
    const cart = await this.getOrCreateCart(cartId, userId);
    return this.formatCartResponse(cart);
  }

  public static async addItem(cartId: string | undefined, productId: number, quantity: number, userId?: number) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError(`Product with ID ${productId} not found`, 404);
    }

    const cart = await this.getOrCreateCart(cartId, userId);

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    const newQuantity = (existingItem ? existingItem.quantity : 0) + quantity;

    if (newQuantity > product.stock) {
      throw new AppError(
        `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested total: ${newQuantity}`,
        400
      );
    }

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return this.getCart(cart.id);
  }

  public static async updateItemQuantity(cartId: string, productId: number, quantity: number) {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
    });

    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError(`Product with ID ${productId} not found`, 404);
    }

    if (quantity > product.stock) {
      throw new AppError(
        `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${quantity}`,
        400
      );
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });

    if (!existingItem) {
      throw new AppError(`Product is not in your cart`, 404);
    }

    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity },
    });

    return this.getCart(cartId);
  }

  public static async removeItem(cartId: string, productId: number) {
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });

    if (!existingItem) {
      throw new AppError(`Product is not in your cart`, 404);
    }

    await prisma.cartItem.delete({
      where: { id: existingItem.id },
    });

    return this.getCart(cartId);
  }

  public static async clearCart(cartId: string) {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
    });

    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    await prisma.cartItem.deleteMany({
      where: { cartId },
    });

    return this.getCart(cartId);
  }

  private static formatCartResponse(cart: any) {
    let totalAmount = 0;
    let itemCount = 0;

    const items = cart.items.map((item: any) => {
      const priceNum = Number(item.product.price);
      const itemTotal = priceNum * item.quantity;

      totalAmount += itemTotal;
      itemCount += item.quantity;

      return {
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        price: priceNum,
        imageUrl: item.product.imageUrl,
        quantity: item.quantity,
        stock: item.product.stock,
        itemTotal,
      };
    });

    return {
      cartId: cart.id,
      items,
      itemCount,
      totalAmount,
    };
  }
}
