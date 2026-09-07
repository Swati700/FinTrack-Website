// BUDGET FORM 
const budgetForm = document.querySelector("#budgetForm");

if (budgetForm) {
  const category = document.querySelector("#category");
  const budgetAmount = document.querySelector("#budget-amount");

  budgetForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const budgetData = {
      category: category.value,
      amount: budgetAmount.value,
    };

    console.log(budgetData);

    const params = new URLSearchParams({
      category: budgetData.category,
      amount: budgetData.amount,
    });

    window.location.href = `../budgets.html?${params}`;
  });
}



// GOAL FORM 
const goalForm = document.querySelector("#goalForm");

if (goalForm) {
  const goalName = document.querySelector("#goal-name");
  const targetAmount = document.querySelector("#target-amount");
  const currentAmount = document.querySelector("#current-amount");
  const targetDate = document.querySelector("#target-date");
  const status = document.querySelector("#status");

  // Check if editing
  const editParams = new URLSearchParams(window.location.search);

  if (editParams.has("name")) {
    goalName.value = editParams.get("name");
    targetAmount.value = editParams.get("targetAmount");
    currentAmount.value = editParams.get("currentAmount");
    targetDate.value = editParams.get("targetDate");
    status.value = editParams.get("status");
  }

  goalForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const goalData = {
      name: goalName.value,
      targetAmount: targetAmount.value,
      currentAmount: currentAmount.value,
      targetDate: targetDate.value,
      status: status.value,
    };

    const goalParams = new URLSearchParams({
      name: goalData.name,
      targetAmount: goalData.targetAmount,
      currentAmount: goalData.currentAmount,
      targetDate: goalData.targetDate,
      status: goalData.status,
    });

    window.location.href = `../budgets.html?${goalParams}`;
  });
}
