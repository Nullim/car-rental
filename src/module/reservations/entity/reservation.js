module.exports = class Reservation {
  /**
   * @param {number} id
   * @param {date} startDate
   * @param {date} endDate
   * @param {number} rentalDailyPrice
   * @param {number} totalPrice
   * @param {string} paymentMethod
   * @param {boolean} paymentStatus
   * @param {string} status
   * @param {number} carId
   * @param {number} userId
   * @param {string} createdAt
   * @param {string} updatedAt
   */
  constructor(
    id,
    startDate,
    endDate,
    rentalDailyPrice,
    totalPrice,
    paymentMethod,
    paymentStatus,
    status,
    carId,
    userId,
    createdAt,
    updatedAt
  ) {
    this.id = id;
    this.startDate = startDate;
    this.endDate = endDate;
    this.formattedDates = this.formatDates();
    this.rentalDailyPrice = rentalDailyPrice;
    this.totalPrice = totalPrice;
    this.paymentMethod = paymentMethod;
    this.paymentStatus = paymentStatus;
    this.status = status;
    this.carId = carId;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  formatDates() {
    const [startDate, endDate] = [this.startDate, this.endDate].map((date) =>
      new Date(date).toLocaleString(false, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      })
    )
    return { startDate, endDate };
  }

  calculateLengthOfReservation() {
    const difference = new Date(this.endDate).getTime() - new Date(this.startDate).getTime();
    const milisecondsInOneSecond = 1000;
    const secondsInOneHour = 3600;
    const hoursInOneDay = 24
    const totalDays = Math.ceil(difference / (milisecondsInOneSecond * secondsInOneHour * hoursInOneDay) + 1)

    return totalDays;
  }

  /**
   * @param {import('../../car/entity/car')} car
   */
  calculateTotalPrice(car, rentalDailyPrice) {
    this.rentalDailyPrice = rentalDailyPrice || car.price
    this.totalPrice = this.rentalDailyPrice * this.calculateLengthOfReservation();
  }

  determineReservationStatus(isFinished) {
    if (isFinished) {
      if (this.paymentStatus !== true){
        throw new Error("Cannot finish an unpaid reservation")
      }
      this.status = 'Finished';
      return;
    }
    this.status = this.paymentStatus ? 'Confirmed' : 'Pending';
  }

  payReservation() {
    this.paymentStatus = true;
  }
};
