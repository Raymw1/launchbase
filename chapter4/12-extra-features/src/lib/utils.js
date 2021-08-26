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
  formatCpfCnpj(value) {
    value = value.replace(/\D/g, "");

    if (value.length > 14) {
      value = value.slice(0, -1);
    }
    if (value.length > 11) {
      value = value.replace(/(\d{2})(\d)/, "$1.$2"); // '11.222333444455'
      value = value.replace(/(\d{3})(\d)/, "$1.$2"); // '11.222.333444455'
      value = value.replace(/(\d{3})(\d)/, "$1/$2"); // '11.222.333/444455'
      value = value.replace(/(\d{4})(\d)/, "$1-$2"); // '11.222.333/4444-55'
    } else {
      value = value.replace(/(\d{3})(\d)/, "$1.$2"); // '112.22333444'
      value = value.replace(/(\d{3})(\d)/, "$1.$2"); // '112.223.33444'
      value = value.replace(/(\d{3})(\d)/, "$1-$2"); // '112.223.334-44'
    }
    return value;
  },
  formatCep(value) {
    value = value.replace(/\D/g, "");

    if (value.length > 8) {
      value = value.slice(0, -1);
    }
    value = value.replace(/(\d{5})(\d)/, "$1-$2"); // '11222-333'
    return value;
  },
};
