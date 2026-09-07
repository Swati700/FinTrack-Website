// CATEGORY CONFIG
const categoryConfig = {
  Housing: {
    icon: "house",
    iconClass: "balance-icon",
    color: "#4648d4",
  },

  Food: {
    icon: "utensils",
    iconClass: "income-icon",
    color: "#006c49",
  },

  Transport: {
    icon: "car",
    iconClass: "balance-icon",
    color: "#4648d4",
  },

  Shopping: {
    icon: "shopping-bag",
    iconClass: "expense-icon",
    color: "#BA1A1A",
  },

  Entertainment: {
    icon: "clapperboard",
    iconClass: "saving-icon",
    color: "#4648d4",
  },

  Bills: {
    icon: "receipt",
    iconClass: "bill-icon",
    color: "#464554",
  },

  Utilities: {
    icon: "plug",
    iconClass: "utilities-icon",
    color: "#FFD700",
  },

  Health: {
    icon: "heart-pulse",
    iconClass: "balance-icon",
    color: "#4648d4",
  },

  Travel: {
    icon: "plane",
    iconClass: "income-icon",
    color: "#006c49",
  },

  Salary: {
    icon: "wallet",
    iconClass: "balance-icon",
    color: "#4648d4",
  },

  Freelance: {
    icon: "briefcase",
    iconClass: "income-icon",
    color: "#006c49",
  },

  Others: {
    icon: "circle-help",
    iconClass: "other-icon",
    color: "#1D2637",
  },
};

// GET BUDGETS FROM LOCAL STORAGE
const getBudgets = () => {
  return JSON.parse(localStorage.getItem("budgets")) || [];
};

// GET TRANSACTIONS
const getTransactions = () => {
  return JSON.parse(localStorage.getItem("transactions")) || [];
};

// GET ACTUAL SPENT FOR EACH BUDGET
const getSpentAmount = (category) => {
  const transactions = getTransactions();

  return transactions
    .filter(
      (transaction) =>
        transaction.type === "expense" &&
        transaction.category === category
    )
    .reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount),
      0
    );
};

// BUDGET LIST
const budgetList = document.querySelector("#budgetList");

// CREATE BUDGET CARD
const createBudgetCard = (budget) => {

  const config = categoryConfig[budget.category] || {
    icon: "circle-help",
    iconClass: "balance-icon",
    color: "#1D2637",
  };

  const card = document.createElement("div");

  card.className = "small-card";

  const spent = getSpentAmount(budget.category);

  const percentage =
    budget.budget === 0
      ? 0
      : (spent / budget.budget) * 100;

  card.innerHTML = `
    <div class="content">

      <div class="cover icon-box ${config.iconClass}">
        <i
          data-lucide="${config.icon}"
          color="${config.color}"
        ></i>
      </div>

      <h4>${budget.category}</h4>

      <p>
        $${spent.toFixed(2)}
        /
        $${Number(budget.budget).toFixed(2)}
      </p>

    </div>

    <div class="bar">

      <div
        class="progress"
        style="
          width: ${Math.min(percentage, 100)}%;
          background: ${config.color};
        "
      ></div>

    </div>

    <p class="percent">
      ${percentage.toFixed(0)}%
    </p>
  `;

  budgetList.appendChild(card);

  lucide.createIcons();
};

// RENDER BUDGETS
const renderBudgets = () => {

  if (!budgetList) return;

  budgetList.innerHTML = "";

  const budgets = getBudgets();

  budgets.forEach((budget) => {
    createBudgetCard(budget);
  });
};

// UPDATE TOP CARDS
const updateBudgetSummary = () => {
  const budgets = getBudgets();

  const totalBudget = budgets.reduce(
    (sum, item) => sum + Number(item.budget),
    0
  );

  // Actual spent from transactions
  const totalSpent = budgets.reduce(
    (sum, item) => sum + getSpentAmount(item.category),
    0
  );

  const remaining = totalBudget - totalSpent;

  // Total Budget
  const totalBudgetElement =
    document.querySelector(".total-budget");

  if (totalBudgetElement) {
    totalBudgetElement.textContent =
      `$${totalBudget.toFixed(2)}`;
  }

  // Total Spent
  const totalSpentElement =
    document.querySelector(".total-spent");

  if (totalSpentElement) {
    totalSpentElement.textContent =
      `$${totalSpent.toFixed(2)}`;
  }

  // Remaining
  const remainingElement =
    document.querySelector(".remaining");

  if (remainingElement) {
    remainingElement.textContent =
      `$${remaining.toFixed(2)}`;
  }

  // Spent Percentage
  const spentPercentage =
    totalBudget === 0
      ? 0
      : (totalSpent / totalBudget) * 100;

  const spentPercentageElement =
    document.querySelector(".spent-percentage");

  if (spentPercentageElement) {
    spentPercentageElement.textContent =
      `${spentPercentage.toFixed(0)}%`;
  }

  // Remaining Progress
  const remainingPercentage =
    totalBudget === 0
      ? 0
      : (remaining / totalBudget) * 100;

  const remainingProgress =
    document.querySelector(".remaining-progress");

  if (remainingProgress) {
    remainingProgress.style.width =
      `${Math.max(remainingPercentage, 0)}%`;
  }
};


// INITIAL LOAD
renderBudgets();
updateBudgetSummary();



// GET GOALS FROM LOCAL STORAGE
const getGoals = () => {
  return JSON.parse(localStorage.getItem("goals")) || [];
};

const goalList = document.querySelector("#goalList");

const createGoalCard = (goal) => {
  const percentage =
    goal.target === 0
      ? 0
      : (goal.current / goal.target) * 100;

  const card = document.createElement("div");

  card.className = "goal-card";

  card.innerHTML = `
    <div class="section-1">
      <div>
        <i
          data-lucide="goal"
          color="#4648d4"
          width="20px"
        ></i>

        <h4>${goal.name}</h4>
      </div>

      <div class="card-actions">
        <button class="edit-btn" type="button">
          <i data-lucide="pencil" width="15"></i>
        </button>

        <button class="delete-btn" type="button">
          <i data-lucide="trash-2" width="15"></i>
        </button>
      </div>
    </div>

    <div class="section-2">
      <p class="text-1">Current</p>
      <p class="text-2">Target</p>
    </div>

    <div class="section-3">
      <h3 class="text-1 current">
        $${goal.current.toLocaleString()}
      </h3>

      <p class="text-2 target">
        $${goal.target.toLocaleString()}
      </p>
    </div>

    <div class="bar">
      <div
        class="progress"
        style="width: ${Math.min(percentage, 100)}%"
      ></div>
    </div>

    <div class="section-4">
      <p class="text-1">
        ${goal.status === "on-track"
      ? "On Track"
      : "Need Attention"}
      </p>

      <p class="text-2">
        <i data-lucide="calendar-days" width="15px"></i>
        ${goal.date}
      </p>
    </div>
  `;

  goalList.appendChild(card);

  lucide.createIcons();
};


const renderGoals = () => {

  if (!goalList) return;

  goalList.innerHTML = "";

  const goals = getGoals();

  goals.forEach((goal) => {
    createGoalCard(goal);
  });
};


renderGoals();