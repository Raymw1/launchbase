const { formatPrice } = require("./utils");

const Cart = {
  init(oldCart) {
    if (oldCart) {
      this.items = oldCart.items;
      this.total = oldCart.total;
    } else {
      this.items = [];
      this.total = {
        quantity: 0,
        price: 0,
        formattedPrice: formatPrice(0)
      }
    }
    return this;
  },
  addOne(product) {
    let inCart = this.getCartItem(product.id);
    if (!inCart) {
      inCart = {
        product: {
          ...product,
          formattedPrice: formatPrice(product.price)
        },
        quantity: 0,
        price: 0,
        formattedPrice: 0
      }
      this.items.push(inCart);
    }

    if (inCart.quantity >= product.quantity) return this;

    inCart.quantity++;
    inCart.price = inCart.product.price * inCart.quantity;
    inCart.formattedPrice = formatPrice(inCart.price);
    this.total.quantity++;
    this.total.price += inCart.product.price;
    this.total.formattedPrice = formatPrice(this.total.price);
    return this;
  },
  removeOne(productId) {
    const inCart = this.getCartItem(productId);
    if (!inCart) return this;
    inCart.quantity--;
    inCart.price = inCart.product.price - inCart.quantity;
    inCart.formattedPrice = formatPrice(inCart.price);

    this.total.quantity--;
    this.total.price -= inCart.product.price;
    this.total.formattedPrice = formatPrice(this.total.price);
    if (inCart.quantity <= 0) {
      this.items = this.items.filter(item => item.product.id != productId)
      // const itemIndex = this.items.indexOf(inCart);
      // this.items.splice(itemIndex, 1);
    }
    return this
  },
  delete(productId) {
    const inCart = this.getCartItem(productId);
    if (!inCart) return this;
    if (this.items.length > 0) {
      this.total.quantity -= inCart.quantity;
      this.total.price -= inCart.price; //
      this.total.formattedPrice = formatPrice(this.total.price);
    }
    this.items = this.items.filter(item => item.product.id != productId);
    return this;
  },
  getCartItem(productId) {
    return this.items.find(item => item.product.id == productId);
  }
}

module.exports = Cart;