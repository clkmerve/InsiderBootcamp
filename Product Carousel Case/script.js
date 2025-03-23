(() => {
    const isHomePage = () => {
        return window.location.href === "https://www.e-bebek.com/";
    };

    const init = () => {
        if (!isHomePage()) {
            console.log("wrong page");
            return;
        }

        buildHTML();
        buildCSS();
        setEvents();
    };

    const buildHTML = async () => {
        const container = document.createElement("div");
        container.classList.add("carousel-container");

        const title = document.createElement("h2");
        title.textContent = "Beğenebileceğinizi düşündüklerimiz"; 
        container.appendChild(title);

        const carouselWrapper = document.createElement("div");
        carouselWrapper.classList.add("carousel-wrapper");

        const carousel = document.createElement("div");
        carousel.classList.add("carousel");
        carouselWrapper.appendChild(carousel);

        container.appendChild(carouselWrapper);

        const prevButton = document.createElement("button");
        prevButton.classList.add("carousel-btn", "prev");
        prevButton.innerHTML = `<img src="https://cdn06.e-bebek.com/assets/svg/prev.svg" alt="Previous">`;
        container.appendChild(prevButton);

        const nextButton = document.createElement("button");
        nextButton.classList.add("carousel-btn", "next");
        nextButton.innerHTML = `<img src="https://cdn06.e-bebek.com/assets/svg/next.svg" alt="Next">`;
        container.appendChild(nextButton);

        const target = document.querySelector("eb-product-carousel .container");
        if (target) {
            target.appendChild(container);
        } else {
            console.error("Hedef element bulunamadı.");
        }

        await loadProducts(carousel);
    };

    const buildCSS = () => {
        const css = `
            // .container { width: 100%; }
            .carousel-container h2 {
                background-color: #fef6eb;
                padding: 10px;
                border-radius: 10px 10px 0 0;
                text-align: left;
                font-size: 30px;
                font-weight: bold;
                color: orange;
                margin-bottom: 10px;
            }
            .carousel-container {
                margin-top: 20px;
                overflow: visible;
                width: 100%;
                margin-left: 20px;
                position: relative; 
            }
            .carousel-wrapper {
                display: flex;
                align-items: center;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
            }
            .carousel {
                display: flex;
                overflow-x: hidden;
                scroll-behavior: smooth;
                padding-bottom: 10px;
            }
            .carousel-btn {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: #fff6eb;
                border: none;
                border-radius: 50%;
                padding: 10px;
                cursor: pointer;
                z-index: 1000; 
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            .carousel-btn:hover {
                background-color: #fff;
                border: 1px solid #f28e00;
            }
            .carousel-btn img {
                width: 25px;
                height: 25px;
            }
            .prev {
                left: -65px;
            }
            .next {
                right: -65px; 
            }
            .product-card {
                position: relative;
                flex: 0 0 auto;
                width: 250px;
                margin-right: 10px;
                border: 1px solid #ddd;
                padding: 10px;
                border-radius: 10px;
            }
            .product-card:hover { border: 2px solid orange; }
            .product-card img { width: 100%; border-radius: 5px; }
           .heart {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    width: 25px; /* Genişlik küçültüldü */
    height: 25px; /* Yükseklik küçültüldü */
    background-image: url('https://www.e-bebek.com/assets/svg/default-favorite.svg');
    background-size: cover; /* İkonun tamamen görünmesini sağlar */
}
            .heart.filled {
                background-image: url('https://www.e-bebek.com/assets/svg/added-favorite.svg');
            }
            .add-to-cart-btn {
                width: 100%;
                padding: 10px;
                background-color: #f28e00;
                color: white;
                border: none;
                border-radius: 25px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                transition: background-color 0.3s ease;
                margin-top:50px;
            }
            .add-to-cart-btn:hover {
                background-color: #e67e00;
            }
            .carousel::-webkit-scrollbar { display: none; }
        `;

        const style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
    };

    const loadProducts = async (carousel) => {
        let products = JSON.parse(localStorage.getItem("cachedProducts")); 

        if (!products) {
            const response = await fetch("https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json"); 
            products = await response.json();
            localStorage.setItem("cachedProducts", JSON.stringify(products)); 
        }

        const favorites = JSON.parse(localStorage.getItem("favoriteProducts")) || []; 

        products.forEach(product => {
            const card = document.createElement("div");
            card.classList.add("product-card");

            const isFavorite = favorites.includes(product.id);

            card.innerHTML = `
                <img src="${product.img}" alt="${product.name}">
                <p>${product.name}</p>
                <p>
                    <strong>${product.price}₺</strong> 
                    ${product.original_price > product.price ? `<span style="text-decoration: line-through;">${product.original_price}₺</span>` : ""}
                </p>
                <div class="heart ${isFavorite ? "filled" : ""}" data-id="${product.id}"></div>
                <button class="add-to-cart-btn">Sepete Ekle</button>
            `;

            card.addEventListener("click", () => {
                window.open(product.url, "_blank");
            });

            card.querySelector(".heart").addEventListener("click", (e) => {
                e.stopPropagation();
                toggleFavorite(e.target, product.id);
            });

            card.querySelector(".add-to-cart-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                addToCart(product);
            });

            carousel.appendChild(card);
        });
    };

    const getFavorites = () => JSON.parse(localStorage.getItem("favoriteProducts")) || [];

    const toggleFavorite = (heartElement, productId) => {
        let favorites = getFavorites();

        if (favorites.includes(productId)) {
            favorites = favorites.filter(id => id !== productId);
            heartElement.classList.remove("filled");
        } else {
            favorites.push(productId);
            heartElement.classList.add("filled");
        }

        localStorage.setItem("favoriteProducts", JSON.stringify(favorites)); 
    };

    const addToCart = (product) => {
        console.log("Ürün sepete eklendi:", product);
        alert(`${product.name} sepete eklendi!`);
    };

    const setEvents = () => {
        const prevButton = document.querySelector(".carousel-btn.prev");
        const nextButton = document.querySelector(".carousel-btn.next");
        const carousel = document.querySelector(".carousel");

        if (prevButton && nextButton && carousel) {
            prevButton.addEventListener("click", () => {
                carousel.scrollBy({ left: -210, behavior: 'smooth' });
            });

            nextButton.addEventListener("click", () => {
                carousel.scrollBy({ left: 210, behavior: 'smooth' });
            });

            console.log("Carousel initialized");
        } else {
            console.error("Carousel butonları veya container bulunamadı.");
        }
    };

    init();
})();