if (typeof jQuery === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.7.1.min.js'; 
    script.onload = () => {
        initializeApp();
    };
    document.head.appendChild(script);
} else {
    initializeApp();
}

let appendLocation;

function deleteUser(userId) {
    let users = loadFromLocalStorage();
    if (!users) return;

    users = users.filter(user => user.id !== userId);
    saveToLocalStorage(users);
    renderUsers(users);
}

function initializeApp() {
    $(document).ready(function () {
        appendLocation = $(".ins-api-users");

        function fetchUsers() {
            return fetch("https://jsonplaceholder.typicode.com/users")
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Veri alınamadı.");
                    }
                    return response.json();
                })
                .catch((error) => {
                    console.error("API Hatası:", error);
                    showError("Veriler alınamadı. Lütfen tekrar deneyin.");
                });
        }

        function saveToLocalStorage(users) {
            try {
                const now = new Date().getTime();
                localStorage.setItem("users", JSON.stringify(users));
                localStorage.setItem("users_expiration", now);
                console.log("Veriler başarıyla LocalStorage'a kaydedildi.");
            } catch (error) {
                console.error("LocalStorage'a kaydetme hatası:", error);
                showError("Veriler kaydedilemedi. Lütfen tekrar deneyin.");
            }
        }

        function loadFromLocalStorage() {
            const users = localStorage.getItem("users");
            if (!users) return null;
            return JSON.parse(users);
        }

        function renderUsers(users) {
            appendLocation.html(""); 

            if (users.length === 0) {
                appendLocation.append(
                    `<p>Tüm kullanıcılar silindi.</p>
                     <button id="load-users">Kullanıcıları Yeniden Yükle</button>`
                );
                observeLoadButton();
                return;
            }

            users.forEach((user) => {
                appendLocation.append(
                    `<div class="user-card">
                        <h4>${user.name}</h4>
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>Şehir:</strong> ${user.address.city}</p>
                        <button class="delete-btn" data-id="${user.id}">Sil</button>
                    </div>`
                );
            });

            $(".delete-btn").on("click", function () {
                const userId = Number($(this).attr("data-id"));
                deleteUser(userId);
            });
        }

        function observeLoadButton() {
            const loadButton = document.getElementById("load-users");

            if (loadButton) {
                loadButton.addEventListener("click", () => {
                    sessionStorage.setItem("reloadClicked", "true");
                    fetchUsers()
                        .then((users) => {
                            saveToLocalStorage(users);
                            renderUsers(users);
                        })
                        .catch((error) => {
                            showError("Kullanıcıları yüklerken bir hata oluştu.");
                        });
                });
            }
        }

        function showError(message) {
            appendLocation.html(
                `<p class="error-message">${message}</p>`
            );
        }
        const observer = new MutationObserver(() => {
            const usersDiv = document.querySelector(".ins-api-users");
            if (usersDiv && usersDiv.innerHTML.includes("Tüm kullanıcılar silindi")) {
                const loadButton = document.getElementById("load-users");
                if (!loadButton) {
                    usersDiv.insertAdjacentHTML('beforeend', `<button id="load-users">Yeniden Yükle</button>`);
                    observeLoadButton();
                }
            }
        });

        const config = { childList: true, subtree: true };
        if (appendLocation[0]) {
            observer.observe(appendLocation[0], config);
        } else {
            console.error("appendLocation öğesi bulunamadı.");
        }

        if (sessionStorage.getItem("reloadClicked") !== "true") {
            let users = loadFromLocalStorage();
            if (users) {
                console.log("Veriler LocalStorage'dan yüklendi.");
                renderUsers(users);
            } else {
                fetchUsers()
                    .then((users) => {
                        if (users && users.length > 0) {
                            saveToLocalStorage(users);
                            renderUsers(users);
                        } else {
                            showError("API'den veri alınamadı veya veri yok.");
                        }
                    })
                    .catch((error) => {
                        showError("Kullanıcı verileri alınamadı. Lütfen tekrar deneyin.");
                    });
            }
        }
    });
}