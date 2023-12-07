//All inputs

let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");
let tbody = document.querySelector("#tbody");
let deleteAllBtn = document.getElementById("delete-all");
let search = document.getElementById("search");
let tmp;
let mode = "create";
let error = document.querySelector(".error");
error.innerText = "";
//calculate total pice

price.onkeyup = getTotal;
taxes.onkeyup = getTotal;
ads.onkeyup = getTotal;
discount.onkeyup = getTotal;

function getTotal(){
    if(price.value !=""){
      //- (taxes != '' ? taxes : 0)
      let result = +price.value + +taxes.value + +ads.value - +discount.value ;
      total.innerText = `Total: ${result}`;
    }
    else{
      total.innerText = `Total: `;
    }
}

// create new product and save it to local storage
let productId;
if(localStorage.productId != null){
  productId = localStorage.productId;
}
else{
  productId = 1;
}

// localStorage.removeItem("product");
// localStorage.removeItem("productId");
let productsData;
if(localStorage.product != null){
  
  productsData = JSON.parse(localStorage.product);
  if(productsData.length > 0){
    deleteAllBtn.style.display = "block";
    deleteAllBtn.innerText=`Delete all (${productsData.length} products)`
  }
  let localId = 1;
  for(let i = 0; i < productsData.length; i++){
      let singleProduct = productsData[i];
      let tr = document.createElement("tr");
      tr.innerHTML = `
      <td>${localId++}</td>
      <td>${singleProduct.title}</td>
      <td>${singleProduct.price}</td>
      <td>${singleProduct.taxes}</td>
      <td>${singleProduct.ads}</td>
      <td>${singleProduct.discount}</td>
      <td>${singleProduct.total}</td>
      <td>${singleProduct.category}</td>
      <td><button onclick = updateData(${localId - 1}) id="update">Update</button></td>
      <td><button onclick = deleteData(${localId - 1}) id="delete">Delete</button></td>
      `
      tbody.appendChild(tr);
  }
} else{
  productsData = [];
}

submit.onclick = ()=>{
  
  let product = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: +price.value + +taxes.value + +ads.value - +discount.value,
    category: category.value.toLowerCase()
  }
let clean = true;
  if(product.title.length < 3){
    error.innerText = "Title must be at least 3 characters";
    clean = false;
  }
  else if(product.price < 1){
    error.innerText = "Price can't be less than 1";
    clean = false;
  }
  else if(product.total < 0){
    error.innerText = "Product total price can't be negative";
    clean = false;
  }
  else if(+count.value < 1 && mode == "create"){
    error.innerText = "Count must be at least one";
    clean = false;
  }
  else if(product.category.length < 3){
    error.innerText = "Product category must be at least 3 characters";
    clean = false;
  }
  if(clean){
    error.innerText = "";
    if(mode === "create"){
      for(let i = 0; i < count.value; i++){
        productsData.push(product);
      }
      if(productsData.length> 0){
        deleteAllBtn.style.display = "block";
        deleteAllBtn.innerText=`Delete all (${productsData.length} products)`
      }
      
      localStorage.setItem("product", JSON.stringify(productsData));
      //show data
      
      for(let i = 0; i < count.value; i++){
        let tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${productId++}</td>
        <td>${product.title}</td>
        <td>${product.price}</td>
        <td>${product.taxes}</td>
        <td>${product.ads}</td>
        <td>${product.discount}</td>
        <td>${product.total}</td>
        <td>${product.category}</td>
        <td><button onclick = updateData(${productId - 1}) id="update">Update</button></td>
        <td><button onclick = deleteData(${productId - 1}) id="delete">Delete</button></td>
        `
        tbody.appendChild(tr);
      }
      localStorage.setItem("productId", productId);
      clearData();
    }
    else{
      productsData[tmp - 1] = product;
      localStorage.setItem("product", JSON.stringify(productsData));
      if(search.value != ""){
        searchForProduct();
      }
      else{
        tbody.innerHTML = "";
        let localId = 1;
        for(let i = 0; i < productsData.length; i++){
            let singleProduct = productsData[i];
            let tr = document.createElement("tr");
            tr.innerHTML = `
            <td>${localId++}</td>
            <td>${singleProduct.title}</td>
            <td>${singleProduct.price}</td>
            <td>${singleProduct.taxes}</td>
            <td>${singleProduct.ads}</td>
            <td>${singleProduct.discount}</td>
            <td>${singleProduct.total}</td>
            <td>${singleProduct.category}</td>
            <td><button onclick = updateData(${localId - 1}) id="update">Update</button></td>
            <td><button onclick = deleteData(${localId - 1}) id="delete">Delete</button></td>
            `
            tbody.appendChild(tr);
        }
      }
      
      clearData();
      count.style.display = "block";
      submit.innerText = "Create";
      mode = "create";
    }
  }
  
  
}

//Clear inputs

function clearData(){
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  count.value = "";
  category.value = "";
  total.innerText = "Total: ";

}

//delete

function deleteData(id){
  mode = "create";
  count.style.display = "block";
  clearData();
  productsData.splice(id - 1, 1);
  if(productsData.length > 0){
    deleteAllBtn.innerText=`Delete all (${productsData.length} products)`
  }
  else{
    deleteAllBtn.style.display = "none";
  }
  localStorage.setItem("product", JSON.stringify(productsData));
  localStorage.setItem("productId", productsData.length + 1);
  productId = localStorage.getItem("productId");
  if(search.value != ""){
    searchForProduct();
  }
  else{
    tbody.innerHTML = "";
    let localId = 1;
    for(let i = 0; i < productsData.length; i++){
        let singleProduct = productsData[i];
        let tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${localId++}</td>
        <td>${singleProduct.title}</td>
        <td>${singleProduct.price}</td>
        <td>${singleProduct.taxes}</td>
        <td>${singleProduct.ads}</td>
        <td>${singleProduct.discount}</td>
        <td>${singleProduct.total}</td>
        <td>${singleProduct.category}</td>
        <td><button onclick = updateData(${localId - 1}) id="update">Update</button></td>
        <td><button onclick = deleteData(${localId - 1}) id="delete">Delete</button></td>
        `
        tbody.appendChild(tr);
    }
  }
 
}

//delete all btn

deleteAllBtn.addEventListener("click", ()=>{
  productsData = [];
  localStorage.setItem("product", JSON.stringify(productsData));
  productId = 1;
  localStorage.setItem("productId", 1);
  tbody.innerHTML = "";
  deleteAllBtn.style.display = "none";
})

// Update

function updateData(i){
  title.value = productsData[i - 1].title;
  price.value = productsData[i - 1].price;
  taxes.value = productsData[i - 1].taxes;
  ads.value = productsData[i - 1].ads;
  discount.value = productsData[i - 1].discount;
  total.innerText = `Total: ${productsData[i - 1].total}`;
  category.value = productsData[i - 1].category;
  count.style.display = "none";
  submit.innerText = "Update";
  mode = "update";
  tmp = i;
  scroll({
    top:0,
    behavior: "smooth"
  })
}

//Search
let searchMode = "title";
let searchByTitle = document.getElementById("search-title");
let searchByCategory = document.getElementById("search-category");
searchByCategory.onclick = getSearchMode;
searchByTitle.onclick = getSearchMode;

function getSearchMode(){
  
  if(this.id === "search-title"){
    searchMode = "title";
    search.placeholder = "search by title"
    searchForProduct();
  }
  else{
    searchMode = "Category";
    search.placeholder = "search by category"
    searchForProduct();
  }
  search.focus();
  console.log(searchMode);
}

search.addEventListener("keyup", searchForProduct )


function searchForProduct() {
  tbody.innerHTML = "";
  if(searchMode === "title"){
    for(let i = 0; i < productsData.length; i++){
      if(productsData[i].title.toLowerCase().includes(search.value.toLowerCase())){
        let tr = document.createElement("tr");
      tr.innerHTML = `
      <td>${i+1}</td>
      <td>${productsData[i].title}</td>
      <td>${productsData[i].price}</td>
      <td>${productsData[i].taxes}</td>
      <td>${productsData[i].ads}</td>
      <td>${productsData[i].discount}</td>
      <td>${productsData[i].total}</td>
      <td>${productsData[i].category}</td>
      <td><button onclick = updateData(${i + 1}) id="update">Update</button></td>
      <td><button onclick = deleteData(${i + 1}) id="delete">Delete</button></td>
      `
      tbody.appendChild(tr);
      }
    }
  }




  else{
    for(let i = 0; i < productsData.length; i++){
      if(productsData[i].category.toLowerCase().includes(search.value.toLowerCase())){
        let tr = document.createElement("tr");
      tr.innerHTML = `
      <td>${i+1}</td>
      <td>${productsData[i].title}</td>
      <td>${productsData[i].price}</td>
      <td>${productsData[i].taxes}</td>
      <td>${productsData[i].ads}</td>
      <td>${productsData[i].discount}</td>
      <td>${productsData[i].total}</td>
      <td>${productsData[i].category}</td>
      <td><button onclick = updateData(${i + 1}) id="update">Update</button></td>
      <td><button onclick = deleteData(${i + 1}) id="delete">Delete</button></td>
      `
      tbody.appendChild(tr);
      }
    }
  }
}