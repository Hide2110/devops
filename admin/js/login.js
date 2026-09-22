const DEFAULT_USERS = [
    {
        id: 1,
        name: 'Quản trị viên',
        username: 'admin',
        email: 'admin@tinmoi24h.vn',
        role: 'Admin',
        password: '123456'
    }
];


// ======================================================
// LẤY DANH SÁCH TÀI KHOẢN
// ======================================================

function getLoginUsers() {

    return JSON.parse(
        localStorage.getItem('newsUsers') ||
        JSON.stringify(DEFAULT_USERS)
    );
}


// ======================================================
// XỬ LÝ ĐĂNG NHẬP
// ======================================================

loginForm.addEventListener(
    'submit',
    function (e) {

        e.preventDefault();


        // =========================
        // LẤY DỮ LIỆU FORM
        // =========================

        const usernameValue =
            username.value.trim();

        const passwordValue =
            password.value;


        // =========================
        // KIỂM TRA TÀI KHOẢN
        // =========================

        const found =
            getLoginUsers().find(
                function (user) {

                    return (
                        user.username ===
                            usernameValue &&

                        user.password ===
                            passwordValue
                    );

                }
            );


        // =========================
        // ĐĂNG NHẬP THÀNH CÔNG
        // =========================

        if (found) {

            localStorage.setItem(
                'adminLoggedIn',
                'true'
            );


            localStorage.setItem(
                'currentAdmin',
                JSON.stringify(found)
            );


            location.href =
                'index.html';

        }


        // =========================
        // ĐĂNG NHẬP THẤT BẠI
        // =========================

        else {

            loginError.textContent =
                'Sai tài khoản hoặc mật khẩu!';

        }

    }
);