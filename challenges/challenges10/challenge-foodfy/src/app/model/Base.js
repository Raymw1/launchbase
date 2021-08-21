const Base = {
  init({ table }) {
    if (!table) throw new Error("Invalid params! No database");
    this.table = table;
    return this;
  },
};
