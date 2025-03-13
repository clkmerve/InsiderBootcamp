function fetchUsers() {
    return fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Veri alınamadı.");
        }
        return response.json();
      });
}

function saveToLocalStorage(users) {
    const now = new Date().getTime();
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("users_expiration", now);
}

function loadFromLocalStorage() {
    const users = localStorage.getItem("users");
    const savedTime = localStorage.getItem("users_expiration");

    if (!users || !savedTime) return null;

    const now = new Date().getTime();

    if (now - Number(savedTime) > (24 * 60 * 60 * 1000)) { 
        console.log("Süre doldu. Yeniden API'den veri çekilecek.");
        localStorage.removeItem("users");
        localStorage.removeItem("users_expiration");

        return null;
    }

    return JSON.parse(users);
}

function deleteUser(userId) {
    let users = loadFromLocalStorage();
    
    if (!users) return;

    users = users.filter(user => user.id !== userId); 
    saveToLocalStorage(users); 
    renderUsers(users); 
}


function renderUsers(users) {
    const container = $(".ins-api-users");
    container.html("");
    users.forEach((user) => {
      container.append(`
        <div class="user-card">
          <h4>${user.name}</h4>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Şehir:</strong> ${user.address.city}</p>                    
          <button class="delete-btn" data-id="${user.id}">Sil</button>

        </div>
      `);
    });

    $(".delete-btn").on("click", function() {
        const userId = Number($(this).attr("data-id"));
        deleteUser(userId);
    });
}

$(document).ready(function () {
    let users = loadFromLocalStorage();
    
    if (users) {
        console.log("Veriler LocalStorage'dan yüklendi.");
        renderUsers(users);
    } else {
        fetchUsers()
            .then((users) => {
                saveToLocalStorage(users);
                renderUsers(users);
            })
            .catch((error) => {
                $(".ins-api-users").html(
                    '<p class="error-message">Kullanıcı verileri alınamadı. Lütfen tekrar deneyin.</p>'
                );
                console.error("Hata:", error);
            });
    }

    // CSS ekleme
    $("head").append(`
      <style>
        .ins-api-users {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          padding: 20px;
          max-width: 800px;
          margin: auto;
        }

        .user-card {
          width: 25%;
          background: rgb(155, 170, 214);
          padding: 10px;
          border-radius: 5px;
          text-align: center;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .error-message {
          color: red;
          font-weight: bold;
        }
      </style>
    `);
});
