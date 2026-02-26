const addExpenseButton = document.getElementById("addExpense");
const expenseList = document.getElementById("expenseList");
const expenseInput = document.getElementById("expense");
const descriptionInput = document.getElementById("description");
const categorySelect = document.getElementById("category");

function deleteExpense(expenseItem) {
  let localExpenses = JSON.parse(localStorage.getItem("localExpenses")) || [];
  localExpenses = localExpenses.filter((e) => e.id !== expenseItem.id);
  localStorage.setItem("localExpenses", JSON.stringify(localExpenses));
  expenseItem.remove();
}

// createExpenseItem builds a list item with delete/edit buttons
function createExpenseItem({ id, expense, description, category }) {
  const expenseItem = document.createElement("li");
  expenseItem.textContent = `${description} - $${expense} [${category}]`;
  expenseItem.id = id;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete Expense";
  deleteButton.addEventListener("click", () => {
    deleteExpense(expenseItem);
  });

  const editButton = document.createElement("button");
  editButton.textContent = "Edit Expense";
  editButton.addEventListener("click", () => {
    expenseInput.value = expense;
    descriptionInput.value = description;
    categorySelect.value = category;

    let localExpenses = JSON.parse(localStorage.getItem("localExpenses")) || [];
    localExpenses = localExpenses.filter((e) => e.id !== expenseItem.id);
    localStorage.setItem("localExpenses", JSON.stringify(localExpenses));
    expenseItem.remove();
  });

  expenseItem.appendChild(deleteButton);
  expenseItem.appendChild(editButton);
  return expenseItem;
}

let localExpenses = localStorage.getItem("localExpenses");

addExpenseButton.addEventListener("click", () => {
  const expense = expenseInput.value;
  const description = descriptionInput.value;
  const category = categorySelect.value;

  if (expense && description && category) {
    // Create Expense
    const expenseItem = createExpenseItem({
      id: `expense-${Date.now()}`,
      expense,
      description,
      category,
    });
    let localExpenses = JSON.parse(localStorage.getItem("localExpenses")) || [];
    localExpenses.push({
      id: expenseItem.id,
      expense,
      description,
      category,
    });
    localStorage.setItem("localExpenses", JSON.stringify(localExpenses));
    expenseList.querySelector("ul").appendChild(expenseItem);

    // Reset values
    expenseInput.value = "";
    descriptionInput.value = "";
    categorySelect.value = "movie";
  }
});

// Load expenses from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
  const localExpenses = JSON.parse(localStorage.getItem("localExpenses")) || [];
  localExpenses.forEach((expense) => {
    const expenseItem = createExpenseItem(expense);
    expenseList.querySelector("ul").appendChild(expenseItem);
  });
});
