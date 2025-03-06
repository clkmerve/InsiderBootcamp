$(document).ready(function () {
    $(document).ajaxStart(function() {
        updateStatus('İstek gönderiliyor...', 'pending');
    }).ajaxSuccess(function() {
        updateStatus('İstek başarılı!', 'success');
    }).ajaxError(function() {
        updateStatus('Hata oluştu!', 'error');
    }).ajaxComplete(function() {
        setTimeout(() => {
            updateStatus('Hazır', 'ready');
        }, 2000);
    });

    // Get işlemleri
    $('#getPostsBtn').click(function(){
        $.getJSON('https://jsonplaceholder.typicode.com/posts?_start=0&_limit=2')
            .done(function(data) {
                data.forEach(function(post) {
                    const html = `
                        <div class="result-item">
                            <h3>${post.title}</h3>
                            <p>${post.body}</p>
                            <small>Post ID: ${post.id}</small>
                        </div>
                    `;
                    $('#postList').prepend(html);
                });
            })
            .fail(function() {
                alert("Postları yüklerken hata oluştu!");
            });
    });

    
    $('#getUsersBtn').click(function() {
        $.getJSON('https://jsonplaceholder.typicode.com/users?_start=0&_limit=2')
            .done(function(data) {
                data.forEach(function(user) {
                    const html = `
                        <div class="result-item">
                            <h3>${user.name}</h3>
                            <p><strong>Email:</strong> ${user.email}</p>
                            <p><strong>Telefon:</strong> ${user.phone}</p>
                            <p><strong>Website:</strong> ${user.website}</p>
                            <small>Kullanıcı ID: ${user.id}</small>
                        </div>
                    `;
                    $('#postList').prepend(html);
                });
            })
            .fail(function() {
                alert("Kullanıcıları yüklerken hata oluştu!");
            });
    });

    // verileri temizler
    $("#clearBtn").click(function(){
        $("#postList").empty();
    });

    // Post işlemleri 
    $('#postUserBtn').click(function() {
        const userData = {
            name: $('#nameInput').val(),
            age: $('#ageInput').val(),
            bio: $('#bioInput').val()
        };

        $.post('https://jsonplaceholder.typicode.com/users', userData)
            .done(function(response) {
                const html = `
                    <div class="result-item success">
                        <h5>Yeni Kullanıcı Eklendi</h5>
                        <p><strong>İsim:</strong> ${response.name}</p>
                        <p><strong>Yaş:</strong> ${response.age}</p>
                        <p><strong>Hakkında:</strong> ${response.bio}</p>
                        <small>Yeni ID: ${response.id}</small>
                    </div>
                `;
                $('#postResults').prepend(html);

                $('#nameInput').val('');
                $('#ageInput').val('');
                $('#bioInput').val('');
            })
            .fail(function(xhr) {
                showError('#postResults', xhr.statusText);
            });
    });

    $("#clearPostResults").click(function(){
        $("#postResults").empty();
    });

    function updateStatus(message, status) {
        const $status = $('#requestStatus');
        $status.attr('class', 'status-panel ' + status)
            .find('.status-text').text(message);
    }

    function showError(target, message) {
        const html = `
            <div class="result-item error">
                <h5>Hata: ${message}</h5>
            </div>
        `;
        $(target).prepend(html);
    }
});
