class Discount{
  apply(order){}
  extraFunction(order){}
}

class SeasonalDiscount extends Discount{
  apply(order){
    return order.total * 0.1
  }

  extraFunction(order){
    return order.extra * 2;
  }
}

class HolidayDiscount extends Discount{
  apply(order){
    return order.total * 0.15 + order.extra;
  }

  extraFunction(order){
    return order.extra * 52
  }
}

class DiscountCalculator{
  calculate(order, discount){
    return discount.apply(order) + discount.extraFunction(order);
  }
}

const order = {total: 1000, extra: 52}

const seasonalDiscount = new SeasonalDiscount();
const holidayDiscount = new HolidayDiscount();

dc = new DiscountCalculator()

console.log('SeasonalDiscount', dc.calculate(order, seasonalDiscount));
console.log('HolidayDiscount', dc.calculate(order, holidayDiscount));
