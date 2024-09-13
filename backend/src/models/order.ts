import mongoose, { Document, Schema } from "mongoose";

export interface ICartItem {
  cartID: number;
  productID: number;
  amount: number;
  company: string;
  image: string;
  price: string;
  title: string;
}

export interface IOrderData {
  name: string;
  address: string;
  chargeTotal: number;
  orderTotal: string;
  numItemsInCart: number;
  cartItems: ICartItem[];
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  data: IOrderData;
}

const CartItemSchema = new Schema<ICartItem>({
  productID: {
    type: Number,
    required: [true, "Product ID must be provided"],
  },
  amount: {
    type: Number,
    required: [true, "Amount must be provided"],
    min: [1, "Amount must be at least 1"],
  },
  company: {
    type: String,
    required: [true, "Company must be provided"],
  },
  image: {
    type: String,
    required: [true, "Image URL must be provided"],
  },
  price: {
    type: String,
    required: [true, "Price must be provided"],
  },
  title: {
    type: String,
    required: [true, "Title must be provided"],
  },
});

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    data: {
      name: {
        type: String,
        required: [true, "Customer name must be provided"],
      },
      address: {
        type: String,
        required: [true, "Shipping address must be provided"],
      },
      chargeTotal: {
        type: Number,
        required: [true, "Charge total must be provided"],
      },
      orderTotal: {
        type: String,
        required: [true, "Order total must be provided"],
      },
      numItemsInCart: {
        type: Number,
        required: [true, "Number of items in cart must be provided"],
        min: [1, "Number of items must be at least 1"],
      },
      cartItems: {
        type: [CartItemSchema],
        required: true,
        validate: [
          {
            validator: function (items: ICartItem[]) {
              return items && items.length > 0;
            },
            message: "Cart items array cannot be empty",
          },
          {
            validator: function (items: ICartItem[]) {
              const totalItems = items.reduce(
                (sum, item) => sum + item.amount,
                0
              );
              return totalItems === this.data.numItemsInCart;
            },
            message:
              "Total number of items (including amounts) must match numItemsInCart",
          },
        ],
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
