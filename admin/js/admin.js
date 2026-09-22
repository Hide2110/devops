// Kiểm tra đăng nhập

const isLoggedIn =
    localStorage.getItem("adminLoggedIn");

if (isLoggedIn !== "true") {

    window.location.href = "login.html";

}


// Đăng xuất

function logout() {

    localStorage.removeItem("adminLoggedIn");

    window.location.href = "login.html";

}