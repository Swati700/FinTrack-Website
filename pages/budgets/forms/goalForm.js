const goalForm = document.querySelector("#goalForm");

if (goalForm) {
  const goalName = document.querySelector("#goal-name");
  const targetAmount = document.querySelector("#target-amount");
  const currentAmount = document.querySelector("#current-amount");
  const targetDate = document.querySelector("#target-date");
  const status = document.querySelector("#status");

  goalForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const goals =
      JSON.parse(localStorage.getItem("goals")) || [];

    const newGoal = {
      id: Date.now(),
      name: goalName.value,
      target: Number(targetAmount.value),
      current: Number(currentAmount.value),
      date: targetDate.value,
      status: status.value,
    };

    goals.push(newGoal);

    localStorage.setItem(
      "goals",
      JSON.stringify(goals)
    );

    window.location.href = "../budgets.html";
  });
}