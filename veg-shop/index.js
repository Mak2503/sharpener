let vegName = document.getElementById("name");
let vegPrice = document.getElementById("price");
let vegQuantity = document.getElementById("quantity");
let addToShopButton = document.getElementById("addToShop");

addToShopButton.addEventListener("click", () => {
  let name = vegName.value;
  let price = vegPrice.value;
  let quantity = vegQuantity.value;

  axios
    .post("https://crudcrud.com/api/9de55e86973548008040dbc2c083ee92/shop", {
      name: name,
      price: price,
      quantity: quantity,
    })
    .then(() => getData())
    .catch((error) => console.log(error));
});

function displayData(data) {
  let shopList = document.getElementById("shopList");
  shopList.innerHTML = "";

  // update total count at the bottom
  let totalDiv = document.getElementById("total");
  if (totalDiv) {
    totalDiv.textContent = `Total: ${data.length}`;
  }

  data.forEach((item) => {
    let div = document.createElement("div");
    div.style.display = "flex";
    div.style.gap = "10px";
    div.innerHTML = `
            <p>${item.name}</p>
            <p>$${item.price}</p>
            <p>${item.quantity} kg</p>
            <input type="number" class="buy" placeholder="Buy quantity" />
            <button class="buyButton">Buy</button>
            <button class="deleteButton">Delete</button>
          `;

    // attach event listeners for this specific item
    let buyInput = div.querySelector(".buy");
    let buyButton = div.querySelector(".buyButton");
    let deleteButton = div.querySelector(".deleteButton");

    buyButton.addEventListener("click", () => {
      let buyQuantity = parseInt(buyInput.value, 10);
      if (isNaN(buyQuantity) || buyQuantity <= 0) {
        alert("Please enter a valid quantity to buy.");
        return;
      }
      let remaining = parseInt(item.quantity, 10) - buyQuantity;
      if (remaining < 0) {
        alert("Not enough stock.");
        return;
      }
      axios
        .put(
          `https://crudcrud.com/api/9de55e86973548008040dbc2c083ee92/shop/${item._id}`,
          {
            name: item.name,
            price: item.price,
            quantity: remaining,
          },
        )
        .then(() => getData())
        .catch((err) => console.log(err));
    });

    deleteButton.addEventListener("click", () => {
      axios
        .delete(
          `https://crudcrud.com/api/9de55e86973548008040dbc2c083ee92/shop/${item._id}`,
        )
        .then(() => getData())
        .catch((err) => console.log(err));
    });

    shopList.appendChild(div);
  });
}

// helper to load data from API
function getData() {
  axios
    .get("https://crudcrud.com/api/9de55e86973548008040dbc2c083ee92/shop")
    .then((response) => displayData(response.data))
    .catch((err) => console.log(err));
}

// initial fetch on page load
document.addEventListener("DOMContentLoaded", getData);
