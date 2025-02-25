// prompt() ile kullanıcıdan isim, yaş ve meslek almalı ve bir nesne 
//  (object) içinde saklamalı.

/* KULLANICI İŞLEMLERİ 

let userName = prompt("Adınız nedir? ")
let age = Number(prompt("Yaşınız kaç?"))
let job = prompt("Mesleğiniz nedir?")

let person = {
    userName : userName,
    age : age,
    job : job
};
alert(`Kullanıcı Bilgileri: {userName: ${userName}, age: ${age}, job: ${job}}`);
console.log("kullanıcı bilgileri" , person);

*/

/*  SEPET İŞLEMLERİ */

let sepet = [];

function addProduct() {
  let product = prompt("Ürün adı girin:");
  let price = Number(prompt("Ürün fiyatını girin:"));
  sepet.push({ name: product, price: price });
  console.log(`${product} sepete eklendi. Fiyatı: ${price} TL`);
}
addProduct();

function showSepet() {
  console.log("Sepetiniz:");
  sepet.forEach(item => {
    console.log(`${item.name} - ${item.price} TL`);
  });

  let total = sepet.reduce((sum, item) => sum + item.price, 0);
  console.log("Toplam Tutar: " + total + " TL");
}

let addMore = true;

while (confirm("Başka ürün eklemek ister misiniz?")) {
    addProduct();
  }
  
  showSepet();
  