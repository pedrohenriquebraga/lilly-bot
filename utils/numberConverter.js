module.exports = {
  converterNumber(number) {
    if (!number) return false;
    const splitNumber = number.toLowerCase().split("");
    let separateNumber = "";
    let letterOperator = "";
    let converterNumber = 0;
    const operators = ["k", "kk", "m"];

    splitNumber.map((num) =>
      !isNaN(Math.floor(num))
        ? (separateNumber += num)
        : (letterOperator += num)
    );

    if (!letterOperator) {
      if (!isNaN(Math.floor(separateNumber))) return Math.floor(separateNumber);
      return false;
    }

    switch (operators.indexOf(letterOperator)) {
      case 0:
        converterNumber = Math.floor(separateNumber) * 1000;
        break;
      case 1:
        converterNumber = Math.floor(separateNumber) * 1000000;
        break;
      case 2:
        converterNumber = Math.floor(separateNumber) * 1000000;
        break;
      default:
        converterNumber = NaN;
        break;
    }

    if (!isNaN(converterNumber)) return converterNumber;
    return false;
  },
};
