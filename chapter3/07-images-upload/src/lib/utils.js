module.exports = {
  parseDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    return {
      day,
      month,
      year,
      hour,
      minutes,
      birthday: `${day}/${month}`,
      format: `${day}/${month}/${year}`,
      iso: `${year}-${month}-${day}`,
    };
  },
  formatPrice(price) {
    return new Intl.NumberFormat("pt-BR", {
      // TO R$
      style: "currency",
      currency: "BRL",
    }).format(price / 100);
  },
};
