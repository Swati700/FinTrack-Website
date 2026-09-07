const budgetForm = document.querySelector("#budgetForm");

if (budgetForm) {
  const category = document.querySelector("#category");
  const budgetAmount = document.querySelector("#budget-amount");

  budgetForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const budgets =
      JSON.parse(localStorage.getItem("budgets")) || [];

    const newBudget = {
      id: Date.now(),
      category: category.value,
      budget: Number(budgetAmount.value),
      spent: 0,
    };

    budgets.push(newBudget);

    localStorage.setItem(
      "budgets",
      JSON.stringify(budgets)
    );

    window.location.href = "../budgets.html";
  });
}