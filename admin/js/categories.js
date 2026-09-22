const DEFAULT = [
    'Tin mới',
    'Công nghệ',
    'Thể thao',
    'Đời sống',
    'Giải trí'
];


// ======================================================
// LẤY DANH SÁCH DANH MỤC
// ======================================================

function getC() {

    return JSON.parse(
        localStorage.getItem('newsCategories') ||
        JSON.stringify(
            DEFAULT.map((name, i) => ({
                id: i + 1,
                name: name,
                slug: name
                    .toLowerCase()
                    .replaceAll(' ', '-')
            }))
        )
    );
}


// ======================================================
// LƯU DANH MỤC
// ======================================================

function saveC(value) {

    localStorage.setItem(
        'newsCategories',
        JSON.stringify(value)
    );
}


// ======================================================
// LẤY DANH SÁCH BÀI VIẾT
// ======================================================

function getP() {

    return JSON.parse(
        localStorage.getItem('newsPosts') || '[]'
    );
}


// ======================================================
// ESC HTML
// ======================================================

function esc(value) {

    return String(value).replace(
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


// ======================================================
// HIỂN THỊ DANH SÁCH DANH MỤC
// ======================================================

function renderCategories() {

    const categories = getC();
    const posts = getP();

    categoryCount.textContent =
        `Có ${categories.length} danh mục`;


    categoryTable.innerHTML =
        categories.map(function (category) {

            const postCount =
                posts.filter(
                    function (post) {
                        return post.category === category.name;
                    }
                ).length;


            return `
                <tr>

                    <td>
                        #${category.id}
                    </td>

                    <td>
                        ${esc(category.name)}
                    </td>

                    <td>
                        ${esc(category.slug)}
                    </td>

                    <td>
                        ${postCount}
                    </td>

                    <td>

                        <button
                            class="action-button edit"
                            onclick="editCategory(${category.id})">
                            Sửa
                        </button>

                        <button
                            class="action-button delete"
                            onclick="deleteCategory(${category.id})">
                            Xóa
                        </button>

                    </td>

                </tr>
            `;

        }).join('');
}


// ======================================================
// MỞ MODAL DANH MỤC
// ======================================================

function openCategoryModal(id) {

    categoryForm.reset();

    categoryId.value =
        id || '';

    categoryModalTitle.textContent =
        id
            ? 'Sửa danh mục'
            : 'Thêm danh mục';


    if (id) {

        const category =
            getC().find(
                function (item) {
                    return item.id === id;
                }
            );


        categoryName.value =
            category.name;

        categorySlug.value =
            category.slug;
    }


    categoryModal.classList.remove(
        'hidden'
    );
}


// ======================================================
// ĐÓNG MODAL
// ======================================================

function closeCategoryModal() {

    categoryModal.classList.add(
        'hidden'
    );
}


// ======================================================
// THÊM / SỬA DANH MỤC
// ======================================================

categoryForm.onsubmit = function (e) {

    e.preventDefault();


    const categories = getC();

    const id =
        Number(categoryId.value);


    const data = {

        name:
            categoryName.value.trim(),

        slug:
            categorySlug.value.trim()

    };


    // =========================
    // SỬA
    // =========================

    if (id) {

        const index =
            categories.findIndex(
                function (category) {
                    return category.id === id;
                }
            );


        categories[index] = {

            ...categories[index],

            ...data

        };

    }


    // =========================
    // THÊM
    // =========================

    else {

        data.id = Date.now();

        categories.push(data);
    }


    saveC(categories);

    closeCategoryModal();

    renderCategories();
};


// ======================================================
// SỬA DANH MỤC
// ======================================================

function editCategory(id) {

    openCategoryModal(id);
}


// ======================================================
// XÓA DANH MỤC
// ======================================================

function deleteCategory(id) {

    const categories = getC();

    const category =
        categories.find(
            function (item) {
                return item.id === id;
            }
        );


    // Kiểm tra danh mục đang có bài viết
    if (
        getP().some(
            function (post) {
                return post.category === category.name;
            }
        )
    ) {

        alert(
            'Không thể xóa vì danh mục đang có bài viết.'
        );

        return;
    }


    // Xác nhận xóa
    if (
        confirm(
            'Xóa danh mục này?'
        )
    ) {

        saveC(
            categories.filter(
                function (item) {
                    return item.id !== id;
                }
            )
        );

        renderCategories();
    }
}


// ======================================================
// KHỞI ĐỘNG
// ======================================================

renderCategories();