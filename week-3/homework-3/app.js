$(document).ready(function () {
    $.getJSON('https://randomuser.me/api/?results=4')
    .done(function (data) {
        data.results.forEach(function (user, index) {
            const profileCard = `
                <div class="profile-card" id="user-${index}">
                    <img src="${user.picture.large}" alt="${user.name.first}">
                    <h4>${user.name.first} ${user.name.last}</h4>
                    <p>${user.email}</p>
                    <p>${user.location.country}</p>
                </div>
            `;

            $('.profile-container').append(profileCard);

            const modalContent = `
                <div style="display: none;" id="modal-user-${index}">
                    <div class="modal-content">
                        <img src="${user.picture.large}" alt="${user.name.first}">
                        <h2>${user.name.first} ${user.name.last}</h2>
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>Telefon:</strong> ${user.phone}</p>
                        <p><strong>Ülke:</strong> ${user.location.country}</p>
                        <p><strong>Şehir:</strong> ${user.location.city}</p>
                        <p><strong>Yaş:</strong> ${user.dob.age}</p>
                    </div>
                </div>
            `;

            $('body').append(modalContent);
        });

        $('.profile-card').click(function () {
            const userId = $(this).attr('id').replace('user-', ''); 
            $.fancybox.open({
                src: `#modal-user-${userId}`,
                type: 'inline'
            });
        });
    })
    .fail(function () {
        alert("Kullanıcıları yüklerken hata oluştu!");
    });
   
    $.getJSON('https://randomuser.me/api/?results=5')
        .done(function (data) {
            data.results.forEach(function (user) {
                const html = `
                    <div class="slide">
                        <img src="${user.picture.large}" alt="${user.name.first}">
                        <h4>${user.name.first} ${user.name.last}</h4>
                        <p>${user.email}</p>
                        <p>${user.location.country}</p>
                    </div>
                `;
                $('.multiple-slider').append(html);
            });

            $('.multiple-slider').slick({
                // dots: true,
                arrows: true,
                infinite: true,
                speed: 500,
                slidesToShow: 4,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 1000,
                responsive: [
                    {
                        breakpoint: 1024,
                        settings: { slidesToShow: 2 }
                    },
                    {
                        breakpoint: 600,
                        settings: { slidesToShow: 1 }
                    }
                ]
            });
        })
        .fail(function () {
            alert("Kullanıcıları yüklerken hata oluştu!");
        });


        function loadRandomUser() {
            $.getJSON('https://randomuser.me/api/', function (data) {
                const user = data.results[0];
                const imageUrl = user.picture.large;
                const name = user.name.first + ' ' + user.name.last;
                const email = user.email;
                const country = user.location.country;
    
                $('#randomImage').attr('src', imageUrl);
                $('#userName').text(name);
                $('#userEmail').text(email);
                $('#userCountry').text(country);
            });
        }
    
        loadRandomUser();
    
     
        // Shake (sallama) efekti
        $('#shakeBtn').click(function () {
            $('#userInfo').effect("shake", { times: 4, distance: 10 }, 500);
        });
    
        // Bounce (zıplama) efekti
        $('#bounceBtn').click(function () {
            $('#userInfo').effect("bounce", { times: 3, distance: 20 }, 500);
        });

          $('#toggleBtn').click(function () {
            $('#userInfo').toggle(3000);
        });

        $('#fadeInBtn').click(function() {
            $('#userInfo').fadeIn(3000);  
        });
        
        $('#fadeOutBtn').click(function() {
            $('#userInfo').fadeOut(3000);  
        });
        
        
});
