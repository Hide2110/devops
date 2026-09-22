const DEF_USERS = [
    {
        id: 1,
        name: 'Quản trị viên',
        username: 'admin',
        email: 'admin@tinmoi24h.vn',
        role: 'Admin',
        password: '123456'
    }
];

// =========================
// LẤY DANH SÁCH USER
// =========================
function users() {
    try {
        const data = JSON.parse(
            localStorage.getItem('newsUsers')
        );

        return Array.isArray(data) ? data : DEF_USERS;
    } catch (error) {
        return DEF_USERS;
    }
}

// =========================
// LƯU USER
// =========================
function saveU(data) {
    localStorage.setItem(
        'newsUsers',
        JSON.stringify(data)
    );
}

// =========================
// CHỐNG XSS
// =========================
function esc(value) {
    return String(value ?? '').replace(
        /[&<>"']/g,
        function (m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[m];
        }
    );
}

// =========================
// HIỂN THỊ DANH SÁCH USER
// =========================
function renderUsers() {

    const list = users();

    userCount.textContent =
        `Có ${list.length} tài khoản`;

    userTable.innerHTML = list.map(function (u) {

        return `
            <tr>
                <td>#${u.id}</td>

                <td>
                    ${esc(u.name)}
                </td>

                <td>
                    ${esc(u.username)}
                </td>

                <td>
                    ${esc(u.email)}
                </td>

                <td>
                    <span class="role-badge ${u.role === 'Admin' ? 'admin' : 'user'}">
                        ${esc(u.role)}
                    </span>
                </td>

                <td>
                    <button
                        class="action-button edit"
                        onclick="editUser(${u.id})">
                        Sửa
                    </button>

                    <button
                        class="action-button delete"
                        onclick="deleteUser(${u.id})">
                        Xóa
                    </button>
                </td>
            </tr>
        `;

    }).join('');
}

// =========================
// MỞ MODAL
// =========================
function openUserModal(id = null) {

    userForm.reset();

    userId.value = id || '';

    userModalTitle.textContent =
        id
            ? 'Chỉnh sửa tài khoản'
            : 'Thêm tài khoản';

    // Thêm mới
    if (!id) {
        userModal.classList.remove('hidden');
        return;
    }

    // Chỉnh sửa
    const user = users().find(
        function (u) {
            return u.id === id;
        }
    );

    if (!user) {
        alert('Không tìm thấy tài khoản.');
        return;
    }

    userName.value = user.name;
    userUsername.value = user.username;
    userEmail.value = user.email;
    userRole.value = user.role;

    // Không đưa password cũ lên input
    userPassword.value = '';

    userModal.classList.remove('hidden');
}

// =========================
// ĐÓNG MODAL
// =========================
function closeUserModal() {
    userModal.classList.add('hidden');
}

// =========================
// LƯU USER
// =========================
userForm.onsubmit = function (e) {

    e.preventDefault();

    const list = users();

    const id = Number(userId.value);

    const oldUser = id
        ? list.find(u => u.id === id)
        : null;

    const name = userName.value.trim();
    const username = userUsername.value.trim();
    const email = userEmail.value.trim();
    const role = userRole.value;
    const password = userPassword.value;

    // =========================
    // VALIDATE
    // =========================

    if (!name) {
        alert('Vui lòng nhập họ tên.');
        userName.focus();
        return;
    }

    if (!username) {
        alert('Vui lòng nhập tên đăng nhập.');
        userUsername.focus();
        return;
    }

    if (!email) {
        alert('Vui lòng nhập email.');
        userEmail.focus();
        return;
    }

    // Kiểm tra username trùng
    const duplicateUsername = list.find(function (u) {
        return (
            u.username.toLowerCase() === username.toLowerCase() &&
            u.id !== id
        );
    });

    if (duplicateUsername) {
        alert('Tên đăng nhập đã tồn tại.');
        userUsername.focus();
        return;
    }

    // Kiểm tra email trùng
    const duplicateEmail = list.find(function (u) {
        return (
            u.email.toLowerCase() === email.toLowerCase() &&
            u.id !== id
        );
    });

    if (duplicateEmail) {
        alert('Email đã được sử dụng.');
        userEmail.focus();
        return;
    }

    // =========================
    // TẠO USER
    // =========================

    const data = {
        name,
        username,
        email,
        role,
        password:
            password ||
            oldUser?.password ||
            ''
    };

    // =========================
    // CHỈNH SỬA
    // =========================

    if (id) {

        const index = list.findIndex(
            u => u.id === id
        );

        if (index === -1) {
            alert('Không tìm thấy tài khoản.');
            return;
        }

        list[index] = {
            ...list[index],
            ...data
        };

    }

    // =========================
    // THÊM MỚI
    // =========================

    else {

        data.id = Date.now();

        list.push(data);
    }

    // =========================
    // LƯU
    // =========================

    saveU(list);

    closeUserModal();

    renderUsers();

    alert(
        id
            ? 'Cập nhật tài khoản thành công!'
            : 'Thêm tài khoản thành công!'
    );
};

// =========================
// SỬA USER
// =========================
function editUser(id) {
    openUserModal(id);
}

// =========================
// XÓA USER
// =========================
function deleteUser(id) {

    const list = users();

    const user = list.find(
        u => u.id === id
    );

    if (!user) {
        alert('Không tìm thấy tài khoản.');
        return;
    }

    // Không cho xóa Admin duy nhất
    if (
        user.role === 'Admin' &&
        list.filter(u => u.role === 'Admin').length === 1
    ) {
        alert(
            'Không thể xóa Admin duy nhất.'
        );

        return;
    }

    if (
        !confirm(
            `Bạn có chắc muốn xóa tài khoản "${user.username}"?`
        )
    ) {
        return;
    }

    const newList = list.filter(
        u => u.id !== id
    );

    saveU(newList);

    renderUsers();

    alert('Đã xóa tài khoản.');
}

// =========================
// KHỞI TẠO
// =========================
renderUsers();