class Item {
  constructor(name, id, price, quantity, stackable = true, soulbound = false) {
    this.name = name;
    this.id = id;
    this.price = price;
    this.quantity = quantity;
    this.stackable = stackable;
    this.soulbound = soulbound;
  }
}

module.exports = Item;
