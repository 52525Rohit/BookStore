import Cart from "../models/cart.model.js";

export const addToCart = async (req, res) => {
  try {
    const { bookId, quantity = 1 } = req.body;
    if (!bookId) {
      return res.status(400).json({ message: "bookId is required" });
    }
    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }
    const existing = cart.items.find((item) => item.book.toString() === bookId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ book: bookId, quantity });
    }
    await cart.save();
    await cart.populate("items.book");
    res.status(200).json({ message: "Item added to cart successfully.", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate("items.book");
    res.status(200).json({ message: "User cart retrieved successfully.", cart: cart || { items: [] } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "quantity must be at least 1" });
    }
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const item = cart.items.find((i) => i.book.toString() === itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.book");
    res.status(200).json({ message: "Cart item updated successfully.", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    cart.items = cart.items.filter((i) => i.book.toString() !== itemId);
    await cart.save();
    await cart.populate("items.book");
    res.status(200).json({ message: "Cart item removed successfully.", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
