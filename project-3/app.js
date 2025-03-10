$(document).ready(function() {
    $.getJSON('https://fakestoreapi.com/products?limit=15')
      .done(function(data) {
        data.forEach(function(product) {
          const html = `
            <div class="slider">
              <a href="#" class="category-item">
                <img src="${product.image}" alt="${product.title}" class="category-img">
                <h3 class="category-title">${product.category}</h3>
              </a>
            </div>
          `;
          $('.categories-slider').append(html);
        });
  
        $('.categories-slider').slick({
          slidesToShow: 6,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2000,
          arrows: true,
          dots: true,
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 5,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 550,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1
              }
            }
          ]
        });
      })
      .fail(function() {
        alert('Ürünler yüklenirken bir hata oluştu!');
      });
  
    $.ajax({
      url: "https://fakestoreapi.com/products",
      method: "GET",
      success: function(products) {
        products.forEach(function(product) {
          $(".products-container").append(`
            <div class="product-item" data-id="${product.id}">
              <div class="product-banner">
                <img src="${product.image}" alt="${product.title}" class="product-img">
              </div>
              <div class="product-content">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">$${product.price}</p>
                <button class="add-to-cart">Sepete Ekle</button>
                <button class="show-details-btn" id="open-modal">Detay</button>
              </div>
            </div>
          `);
        });
  
        loadCart();
      },
      error: function() {
        console.log("Ürünler yüklenirken hata oluştu.");
      }
    });
  
    $(document).on("click", ".add-to-cart", function() {
      let productElement = $(this).closest(".product-item");
      let productId = productElement.data("id");
  
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
      if (!cart.includes(productId)) {
        cart.push(productId);
        localStorage.setItem("cart", JSON.stringify(cart));
      }
  
      let clonedProduct = productElement.clone();
      clonedProduct.find(".add-to-cart").remove();
      clonedProduct.find(".show-details-btn").remove();
      clonedProduct.append('<button class="remove-btn">Sil</button>');
      $("#cart-container").append(clonedProduct);

      $("#cart-title").show();
    });
  
    $(document).on("click", ".remove-btn", function() {
      let productElement = $(this).closest(".product-item");
      let productId = productElement.data("id");
  
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart = cart.filter(function(id) {
        return id !== productId;
      });
      localStorage.setItem("cart", JSON.stringify(cart));
  
      productElement.slideUp(500, function() {
        $(this).remove();
      });
    });
  
    function loadCart() {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.forEach(function(id) {
        let productElement = $(`.product-item[data-id="${id}"]`).clone();
        productElement.find(".add-to-cart").remove();
        productElement.find(".show-details-btn").remove();
        productElement.append('<button class="remove-btn">Sil</button>');
        $("#cart-container").append(productElement);
      });
    }
  
    $(document).on("click", "#open-modal", function() {
      let productId = $(this).closest(".product-item").data("id");
  
      $.get(`https://fakestoreapi.com/products/${productId}`, function(product) {
        $('#modal-title').text(product.title);
        $('#modal-description').text(product.description);
        $('#modal-image').attr('src', product.image);
  
        $('#product-modal').slideDown("slow");
      });
    });
  
    $(document).on("click", ".close-btn", function() {
      $('#product-modal').slideUp("slow");
    });
  });
  