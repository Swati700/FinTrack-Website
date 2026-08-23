// TRANSACTION FORM
const transactionForm = document.querySelector("#transactionForm");

if (transactionForm) {
  const transactionName = document.querySelector("#transaction-name");
  const description = document.querySelector("#description");
  const transactionCategory = document.querySelector("#transaction-category");
  const transactionAmount = document.querySelector("#transaction-amount");
  const transactionType = document.querySelector("#transaction-type");
  const transactionDate = document.querySelector("#transaction-date");
  const paymentMethod = document.querySelector("#payment-method");

  transactionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const transactionData = {
      id: Date.now(),
      name: transactionName.value.trim(),
      description: description.value.trim(),
      category: transactionCategory.value,
      amount: Number(transactionAmount.value),
      type: transactionType.value,
      date: transactionDate.value,
      paymentMethod: paymentMethod.value,
    };

    // Get existing transactions
    const transactions =
      JSON.parse(localStorage.getItem("transactions")) || [];

    // Add new transaction
    transactions.push(transactionData);

    // Save updated transactions
    localStorage.setItem(
      "transactions",
      JSON.stringify(transactions)
    );

    // Go back to transactions page
    window.location.href = "../transaction.html";
  });
}