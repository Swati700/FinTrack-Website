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

// GET TRANSACTIONS
const transactions =
  JSON.parse(localStorage.getItem("transactions")) || [];


// TOP CARDS
const totalIncome = transactions
  .filter((transaction) => transaction.type === "income")
  .reduce((sum, transaction) => {
    return sum + transaction.amount;
  }, 0);


const totalExpenses = transactions
  .filter((transaction) => transaction.type === "expense")
  .reduce((sum, transaction) => {
    return sum + transaction.amount;
  }, 0);


const totalBalance = totalIncome - totalExpenses;

// For now savings = balance
const totalSavings = totalBalance;

// Trend Data
const trendData = {
  balance: 12.5,
  income: 8.2,
  expense: -4.5,
  saving: 10.4,
};

const trendCards = document.querySelectorAll(".small-cards .card");

const updateTrend = (card, value) => {
  const trend = card.querySelector(".extra p");

  const positive = value >= 0;

  trend.style.color = positive ? "#006C49" : "#BA1A1A";

  trend.innerHTML = `
    <i data-lucide="${positive ? "trending-up" : "trending-down"}"></i>
    ${positive ? "+" : ""}${value}% 
  `;
  // vs last month
};

updateTrend(trendCards[0], trendData.balance);
updateTrend(trendCards[1], trendData.income);
updateTrend(trendCards[2], trendData.expense);
updateTrend(trendCards[3], trendData.saving);

lucide.createIcons();

// DOM
document.querySelector(".income").textContent =
  `$${totalIncome.toFixed(2)}`;

document.querySelector(".expense").textContent =
  `$${totalExpenses.toFixed(2)}`;

document.querySelector(".balance").textContent =
  `$${totalBalance.toFixed(2)}`;

document.querySelector(".saving").textContent =
  `$${totalSavings.toFixed(2)}`;


// EXPENSE BREAKDOWN
const expenseData = {};
transactions
  .filter((transaction) => transaction.type === "expense")
  .forEach((transaction) => {

    if (!expenseData[transaction.category]) {
      expenseData[transaction.category] = 0;
    }

    expenseData[transaction.category] += transaction.amount;
  });


// Total expenses
const expenseTotal = Object.values(expenseData)
  .reduce((sum, amount) => sum + amount, 0);


// Total DOM
document.querySelector(".expense-total").textContent =
  `$${expenseTotal.toFixed(0)}`;


// Category percentages
const categoryTexts = document.querySelectorAll(".categories p");

categoryTexts.forEach((element) => {
  const categoryText = element.textContent
    .replace(element.querySelector("span").textContent, "")
    .trim();

  let category = categoryText;

  if (category === "Ent.") {
    category = "Entertainment";
  }

  const amount = expenseData[category] || 0;

  const percentage =
    expenseTotal === 0
      ? 0
      : (amount / expenseTotal) * 100;

  element.querySelector("span").textContent =
    `${percentage.toFixed(0)}%`;
});


// RECENT TRANSACTIONS
const recentTransactions =
  document.querySelector("#recentTransactions");

const recentData = transactions.slice(-4).reverse();

recentData.forEach((transaction) => {
  const isIncome = transaction.type === "income";

  const config = categoryConfig[transaction.category] || {
    icon: "circle-help",
    color: "#1D2637",
  };

  const div = document.createElement("div");

  div.className = "types";

  div.innerHTML = `
    <div class="icon-box ${config.iconClass}">
      <i
        data-lucide="${config.icon}"
        color="${config.color}"
      ></i>
    </div>

    <h4>
      ${transaction.name}
      <span>${transaction.date}</span>
    </h4>

    <p class="${isIncome ? "green" : ""}">
      ${isIncome ? "+" : "-"}$${Number(transaction.amount).toFixed(2)}
    </p>
  `;

  recentTransactions.appendChild(div);
});

lucide.createIcons();


// BUDGET OVERVIEW

const budgetOverview =
  document.querySelector("#budgetOverview");

const budgets =
  JSON.parse(localStorage.getItem("budgets")) || [];

// GET SPENT FOR CATEGORY

const getSpentAmount = (category) => {
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


// CREATE BUDGET OVERVIEW
if (budgetOverview) {

  budgetOverview.innerHTML = "";

  budgets.slice(0, 3).forEach((budget) => {

    const spent = getSpentAmount(budget.category);

    const percentage =
      Number(budget.budget) === 0
        ? 0
        : (spent / Number(budget.budget)) * 100;

    const config =
      categoryConfig[budget.category] || {
        color: "#4648d4",
      };

    const div = document.createElement("div");

    div.innerHTML = `
      <div class="spending">
        <p>${budget.category}</p>

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
    `;

    budgetOverview.appendChild(div);
  });
}


// DASHBOARD FINANCIAL GOALS
const dashboardGoals = document.querySelector("#dashboardGoals");

const goals = JSON.parse(localStorage.getItem("goals")) || [];

goals.slice(0, 3).forEach((goal) => {

  const percentage =
    goal.target === 0
      ? 0
      : (Number(goal.current) / Number(goal.target)) * 100;

  const goalItem = document.createElement("div");

  goalItem.className = "goals";

  goalItem.innerHTML = `
    <div
      class="circle-bar"
      style="
        background: conic-gradient(
          #4648d4 ${Math.min(percentage, 100)}%,
          #dce2f7 ${Math.min(percentage, 100)}%
        );
      "
    >
      <div class="circle-progress">
        <i data-lucide="goal" color="#4648d4"></i>
      </div>
    </div>

    <p>
      ${goal.name}
      <span>${percentage.toFixed(0)}% reached</span>
    </p>
  `;

  dashboardGoals.appendChild(goalItem);
});

lucide.createIcons();