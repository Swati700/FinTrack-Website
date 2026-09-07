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

// DEMO TRANSACTIONS
const demoTransactions = [
  {
    id: 1,
    name: "Tech Corp Inc.",
    description: "Monthly Salary",
    category: "Salary",
    amount: 6500,
    type: "income",
    date: "2023-10-25",
    paymentMethod: "Direct Deposit",
  },

  {
    id: 2,
    name: "Downtown Apartments",
    description: "November Rent",
    category: "Housing",
    amount: 1800,
    type: "expense",
    date: "2023-10-26",
    paymentMethod: "Bank Transfer",
  },

  {
    id: 3,
    name: "Whole Foods Market",
    description: "Weekly Groceries",
    category: "Food",
    amount: 145.20,
    type: "expense",
    date: "2023-10-28",
    paymentMethod: "Credit Card ..1234",
  },
];


// GET TRANSACTIONS
const getTransactions = () => {
  const storedTransactions =
    JSON.parse(localStorage.getItem("transactions"));

  // First time only → add demo data
  if (!storedTransactions) {
    localStorage.setItem(
      "transactions",
      JSON.stringify(demoTransactions)
    );

    return demoTransactions;
  }

  return storedTransactions;
};

// SAVE TRANSACTIONS
const saveTransactions = (transactions) => {
  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );
};


// TRANSACTION LIST
const transactionList =
  document.querySelector("#transactionList");


// FORMAT DATE
const formatDate = (date) => {
  const transactionDate = new Date(date);

  return transactionDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};


// CREATE TRANSACTION ROW
const createTransactionRow = (transaction) => {
  const row = document.createElement("tr");

  const isIncome = transaction.type === "income";

  const amountSign = isIncome ? "+" : "-";
  const amountClass = isIncome ? "green" : "";

  const typeIcon = isIncome
    ? "arrow-up"
    : "arrow-down";

  const typeColor = isIncome
    ? "#006c49"
    : "#BA1A1A";

  const config =
    categoryConfig[transaction.category] || {
      icon: "circle-help",
      iconClass: '#5642f4',
      color: "#1D2637",
    };


  row.innerHTML = `
    <td>
      <div class="transaction-info">

        <div class="transaction-icon icon-box ${config.iconClass}">
          <i
            data-lucide="${config.icon}"
            color="${config.color}"
          ></i>
        </div>

        <div>
          <h4>${transaction.name}</h4>
          <p>${transaction.description}</p>
        </div>

      </div>
    </td>


    <td>
      <span class="category">
        ${transaction.category}
      </span>
    </td>


    <td>
      ${formatDate(transaction.date)}
    </td>


    <td>
      ${transaction.paymentMethod}
    </td>


    <td class="income ${amountClass}">
      ${amountSign}$${Number(transaction.amount).toFixed(2)}
    </td>


    <td class="income">
      <i
        data-lucide="${typeIcon}"
        color="${typeColor}"
      ></i>
    </td>


    <td>
      <i
        data-lucide="pencil"
        class="edit-transaction"
      ></i>
    </td>
  `;


  transactionList.appendChild(row);
};


// CALCULATE TOP CARDS
const updateTransactionSummary = () => {

  const transactions = getTransactions();

  const incomeValue = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount),
      0
    );


  const expenseValue = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount),
      0
    );


  const balanceValue =
    incomeValue - expenseValue;


  document.querySelector(".income").textContent =
    `$${incomeValue.toFixed(2)}`;

  document.querySelector(".expense").textContent =
    `$${expenseValue.toFixed(2)}`;

  document.querySelector(".balance").textContent =
    `$${balanceValue.toFixed(2)}`;
};


// PAGINATION

const rowsPerPage = 6;
let currentPage = 1;


// SEARCH / FILTERS

const searchInput = document.querySelector("#searchTransaction");
const typeFilters = document.querySelectorAll(".filter-type");
const categoryFilter = document.querySelector("#categoryFilter");

let selectedType = "all";
let selectedCategory = "all";


// GET FILTERED TRANSACTIONS

function getFilteredTransactions() {
  const transactions = getTransactions();

  const searchValue =
    searchInput.value.toLowerCase().trim();

  return transactions.filter((transaction) => {

    // SEARCH
    const matchesSearch =
      transaction.name.toLowerCase().includes(searchValue) ||
      transaction.description.toLowerCase().includes(searchValue);


    // TYPE
    const matchesType =
      selectedType === "all" ||
      transaction.type === selectedType;


    // CATEGORY
    const matchesCategory =
      selectedCategory === "all" ||
      transaction.category.toLowerCase() === selectedCategory;


    return (
      matchesSearch &&
      matchesType &&
      matchesCategory
    );
  });
}


// RENDER TRANSACTIONS

const renderTransactions = () => {

  const transactions = getFilteredTransactions();

  transactionList.innerHTML = "";


  // TOTAL PAGES

  const totalPages =
    Math.ceil(transactions.length / rowsPerPage);


  // If current page becomes invalid
  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
  }


  // START / END

  const startIndex =
    (currentPage - 1) * rowsPerPage;

  const endIndex =
    startIndex + rowsPerPage;


  // ONLY 6 TRANSACTIONS

  const pageTransactions =
    transactions.slice(startIndex, endIndex);


  // CREATE ROWS

  pageTransactions.forEach((transaction) => {

    const row = document.createElement("tr");

    row.classList.add("dynamic-row");

    const isIncome =
      transaction.type === "income";

    const amountSign =
      isIncome ? "+" : "-";

    const amountClass =
      isIncome ? "green" : "";

    const typeIcon =
      isIncome ? "arrow-up" : "arrow-down";

    const typeColor =
      isIncome ? "#006c49" : "#BA1A1A";

    const config =
      categoryConfig[transaction.category] || {
        icon: "circle-help",
        iconClass: "balance-icon",
        color: "#1D2637",
      };


    row.innerHTML = `
      <td>
        <div class="transaction-info">

          <div class="transaction-icon icon-box ${config.iconClass}">
            <i
              data-lucide="${config.icon}"
              color="${config.color}"
            ></i>
          </div>

          <div>
            <h4>${transaction.name}</h4>
            <p>${transaction.description}</p>
          </div>

        </div>
      </td>

      <td>
        <span class="category">
          ${transaction.category}
        </span>
      </td>

      <td>
        ${formatDate(transaction.date)}
      </td>

      <td>
        ${transaction.paymentMethod}
      </td>

      <td class="income ${amountClass}">
        ${amountSign}$${Number(transaction.amount).toFixed(2)}
      </td>

      <td class="income">
        <i
          data-lucide="${typeIcon}"
          color="${typeColor}"
        ></i>
      </td>

      <td>
        <i
          data-lucide="pencil"
          class="edit-transaction"
        ></i>
      </td>
    `;

    transactionList.appendChild(row);
  });


  // UPDATE PAGINATION

  updatePagination(
    transactions.length,
    totalPages,
    startIndex,
    pageTransactions.length
  );


  lucide.createIcons();
};


// PAGINATION UI

function updatePagination(
  totalTransactions,
  totalPages,
  startIndex,
  showingCount
) {

  const pagination =
    document.querySelector("#pagination");

  const paginationInfo =
    document.querySelector("#paginationInfo");

  const prevPage =
    document.querySelector("#prevPage");

  const nextPage =
    document.querySelector("#nextPage");


  // SHOWING TEXT

  if (totalTransactions === 0) {

    paginationInfo.textContent =
      "Showing 0 to 0 of 0 transactions";

  } else {

    paginationInfo.textContent =
      `Showing ${startIndex + 1} to ${startIndex + showingCount
      } of ${totalTransactions} transactions`;
  }


  // REMOVE OLD PAGE BUTTONS

  pagination
    .querySelectorAll(".page-btn")
    .forEach((button) => button.remove());


  // PAGE BUTTONS

  for (let page = 1; page <= totalPages; page++) {

    const button =
      document.createElement("button");

    button.type = "button";

    button.className = "page-btn";

    button.textContent = page;


    if (page === currentPage) {
      button.classList.add("active");
    }


    button.addEventListener("click", () => {

      currentPage = page;

      renderTransactions();
    });


    // Insert before next button

    pagination.insertBefore(
      button,
      nextPage
    );
  }


  // PREVIOUS

  prevPage.disabled =
    currentPage === 1 ||
    totalPages === 0;


  prevPage.onclick = () => {

    if (currentPage > 1) {

      currentPage--;

      renderTransactions();
    }
  };


  // NEXT

  nextPage.disabled =
    currentPage === totalPages ||
    totalPages === 0;


  nextPage.onclick = () => {

    if (currentPage < totalPages) {

      currentPage++;

      renderTransactions();
    }
  };
}


// SEARCH

searchInput.addEventListener("input", () => {

  currentPage = 1;

  renderTransactions();
});


// INCOME / EXPENSE

typeFilters.forEach((filter) => {

  filter.addEventListener("click", () => {

    typeFilters.forEach((item) => {
      item.classList.remove("active");
    });

    filter.classList.add("active");

    selectedType =
      filter.dataset.type;

    currentPage = 1;

    renderTransactions();
  });
});


// CATEGORY

categoryFilter.addEventListener("change", () => {

  selectedCategory =
    categoryFilter.value;

  currentPage = 1;

  renderTransactions();
});


renderTransactions();
updateTransactionSummary();