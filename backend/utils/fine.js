function calculateFine(dueDate, returnDate = new Date(), ratePerDay = 5) {
  const due = new Date(dueDate);
  const end = new Date(returnDate);
  const daysLate = Math.max(0, Math.ceil((end - due) / 86400000));
  return { daysLate, fine: daysLate * ratePerDay };
}

module.exports = calculateFine;
