var currentUser = null;
var selectedProduct = null;
var ADMIN_NAME = "naserdel123";
var MOYASAR_KEY = "pk_live_uMadyRRfpzd5PsvGgLBeCHLHbyHs5tH9Z43Ax3g7";

function init() {
loadProducts();
checkLogin();
}

function showRegister() {
document.getElementById("authContainer").classList.add("hidden");
document.getElementById("registerContainer").classList.remove("hidden");
}

function showLogin() {
document.getElementById("registerContainer").classList.add("hidden");
document.getElementById("authContainer").classList.remove("hidden");
}

function register() {
var u = document.getElementById("newUsername").value;
var p = document.getElementById("newPassword").value;

if(u && p){
localStorage.setItem("user_"+u,p);
alert("تم التسجيل");
showLogin();
}
}

function login() {
var u = document.getElementById("username").value;
var p = document.getElementById("password").value;
var saved = localStorage.getItem("user_"+u);

if(saved && saved === p){
currentUser = u;
localStorage.setItem("loggedIn",u);
showMain();
}
}

function logout(){
localStorage.removeItem("loggedIn");
location.reload();
}

function checkLogin(){
var logged = localStorage.getItem("loggedIn");
if(logged){
currentUser = logged;
showMain();
}
}

function showMain(){
document.getElementById("authContainer").classList.add("hidden");
document.getElementById("mainContainer").classList.remove("hidden");

if(currentUser === ADMIN_NAME){
document.getElementById("addProductBtn").classList.remove("hidden");
}
renderProducts();
}

function loadProducts(){
var p = localStorage.getItem("products");
if(!p){
var defaults = [
{name:"حساب نادر",image:"https://tr.rbxcdn.com/180DAY-Avatar-Placeholder.png",price:50,method:"تريد"},
{name:"سكن اسطوري",image:"https://tr.rbxcdn.com/180DAY-Avatar-Placeholder.png",price:30,method:"هدية"}
];
localStorage.setItem("products",JSON.stringify(defaults));
}
}

function renderProducts(){
var container = document.getElementById("products");
if(!container) return;

container.innerHTML="";
var products = JSON.parse(localStorage.getItem("products"));

for(var i=0;i<products.length;i++){
var card = document.createElement("div");
card.className="card";

card.innerHTML =
"<img src='"+products[i].image+"'>" +
"<h4>"+products[i].name+"</h4>" +
"<p>"+products[i].price+" ريال</p>" +
"<p>"+products[i].method+"</p>" +
"<button onclick='buy("+i+")'>شراء</button>";

container.appendChild(card);
}
}

function showAddForm(){
document.getElementById("addProductForm").classList.remove("hidden");
}

function addProduct(){
var name = document.getElementById("pName").value;
var img = document.getElementById("pImage").value;
var price = document.getElementById("pPrice").value;
var method = document.getElementById("pMethod").value;

var products = JSON.parse(localStorage.getItem("products"));
products.push({name:name,image:img,price:price,method:method});
localStorage.setItem("products",JSON.stringify(products));
location.reload();
}

function buy(index){
selectedProduct = JSON.parse(localStorage.getItem("products"))[index];
document.getElementById("paymentModal").classList.remove("hidden");

Moyasar.init({
element:'.mysr-form',
amount: selectedProduct.price * 100,
currency:'SAR',
description:selectedProduct.name,
publishable_api_key:MOYASAR_KEY,
callback_url: window.location.href
});
}

function confirmOrder(){
var roblox = document.getElementById("robloxName").value;
if(roblox){
var orders = localStorage.getItem("orders");
if(!orders){ orders="[]"; }
var arr = JSON.parse(orders);
arr.push({user:currentUser,product:selectedProduct.name,roblox:roblox});
localStorage.setItem("orders",JSON.stringify(arr));

alert("تم إرسال الطلب للإيميل: naseradmmhmd12@gmail.com");
location.reload();
}
}

window.onload = init;
