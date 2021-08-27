const { parseDate, formatPrice } = require("../../lib/utils");
const Order = require("../models/Order");
const User = require("../models/User");
const LoadProductService = require("./LoadProductService");

async function format(order) {
  order.product = await LoadProductService.load('product', { where: { id: order.product_id } });
  order.buyer = await User.find(order.buyer_id);
  order.seller = await User.find(order.seller_id);
  order.formattedPrice = formatPrice(order.price);
  order.formattedTotal = formatPrice(order.total);
  const statuses = {
    open: "Aberto",
    sold: "Vendido",
    canceled: "Cancelado",
  }
  order.formattedStatus = statuses[order.status];
  const updatedAt = parseDate(order.updated_at);
  order.formattedUpdatedAt = `${order.formattedStatus} em ${updatedAt.format} às ${updatedAt.time}`;
  return order
}

const LoadService = {
  load(service, filters) {
    this.filters = filters;
    return this[service]();
  },
  // async product() {
  //   try {
  //     let product = await Product.findOne(this.filters);
  //     return format(product);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // },
  async orders() {
    try {
      let orders = await Order.findAll(this.filters);
      const ordersPromise = orders.map(format);
      return Promise.all(ordersPromise);
    } catch (err) {
      console.error(err);
    }
  },
  format,
};

module.exports = LoadService;
