module.exports = {
  converterNumber(number) {
    if (!number) return false;
    const splitNumber = number.toString().toLowerCase().split("");
    let separateNumber = "";
    let letterOperator = "";
    let converterNumber = 0;
    const operators = ["k", "kk", "m"];

    splitNumber.map((num) =>
      !isNaN(Number(num)) || num == "."
        ? (separateNumber += num)
        : (letterOperator += num)
    );

    if (!letterOperator) {
      if (!isNaN(Number(separateNumber)))
        return Number.parseInt(separateNumber);
      return false;
    }

    switch (operators.indexOf(letterOperator)) {
      case 0:
        converterNumber = Number(separateNumber) * 1000;
        break;
      case 1:
        converterNumber = Number(separateNumber) * 1000000;
        break;
      case 2:
        converterNumber = Number(separateNumber) * 1000000;
        break;
      default:
        converterNumber = NaN;
        break;
    }

    if (!isNaN(converterNumber)) return converterNumber;
    return false;
  },
};
