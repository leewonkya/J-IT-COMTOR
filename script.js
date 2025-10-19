// Khai báo cấu trúc dữ liệu cơ bản (không còn chứa nội dung HTML chi tiết)
const curriculumData = {
    'summary': { title: 'Tổng quan Giáo án', subtitle: 'Chương trình 7 giai đoạn', file: 'summary.html', isSummary: true },
    'giai-doan-1': { title: 'Giai đoạn 1: Tổng quan ngành IT & vai trò IT Comtor', subtitle: 'Bước đệm vững chắc', file: 'giai_doan_1.html' },
    'giai-doan-2': { title: 'Giai đoạn 2: Dịch viết & Tài liệu Dự án', subtitle: 'Làm chủ ngôn ngữ viết', file: 'giai_doan_2.html' },
    'giai-doan-3': { title: 'Giai đoạn 3: Ngôn ngữ lập trình & Công cụ cốt lõi', subtitle: 'Làm quen với "vũ khí" của Developer', file: 'giai_doan_3.html' },
    'giai-doan-4': { title: 'Giai đoạn 4: Kỹ năng dịch nói (Meeting Simulation)', subtitle: 'Luyện phản xạ tức thì', file: 'giai_doan_4.html' },
    'giai-doan-5': { title: 'Giai đoạn 5: Quy trình phát triển phần mềm (SDLC)', subtitle: 'Hiểu luật chơi', file: 'giai_doan_5.html' },
    'giai-doan-6': { title: 'Giai đoạn 6: Kiểm thử & Quản lý chất lượng (QA)', subtitle: 'Mắt xích cuối cùng', file: 'giai_doan_6.html' },
    'giai-doan-7': { title: 'Giai đoạn 7: Thực tập, Dự án Mẫu & Thi cuối khóa', subtitle: 'Tổng kết và áp dụng', file: 'giai_doan_7.html' },
};

const mainContentElement = document.getElementById('main-content');
const curriculumMenu = document.getElementById('curriculum-menu');
const sidebarToggleMobile = document.getElementById('sidebar-toggle-mobile');
const sidebarOverlay = document.getElementById('sidebar-overlay');

// --- HÀM RENDER CHÍNH (SỬ DỤNG FETCH) ---
window.renderContent = async (key) => {
    const data = curriculumData[key];
    if (!data) return;

    // 1. Cập nhật DOM tạm thời (Loading State)
    mainContentElement.innerHTML = `
        <div class="text-center p-20 text-gray-400">
            <svg class="animate-spin h-10 w-10 text-teal-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang tải ${data.title}...
        </div>
    `;

    try {
        // 2. Tải nội dung từ file HTML tương ứng
        const response = await fetch(data.file);
        if (!response.ok) {
            throw new Error(`Không thể tải file: ${data.file}`);
        }
        const content = await response.text();

        // 3. Xây dựng HTML hoàn chỉnh
        let newContentHTML = '';
        const isSummary = data.isSummary;

        newContentHTML += `
            <header class="mb-10">
                <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">${data.title}</h1>
                <p class="mt-3 text-xl text-teal-600">${data.subtitle}</p>
                <div class="mt-5 border-t border-gray-200 pt-5">
                    <span class="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800">
                        Level: Beginner to Professional
                    </span>
                    ${isSummary ? `<span class="ml-3 inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                        Phạm vi: Dịch thuật, Kỹ năng mềm & Công cụ
                    </span>` : ''}
                </div>
            </header>
        `;

        newContentHTML += content; // Nội dung đã tải từ file HTML nhỏ

        // Thêm nút quay lại tổng quan cho các trang chi tiết
        if (!isSummary) {
             newContentHTML += `
                <button onclick="window.location.hash = '#summary'; renderContent('summary')" class="mt-8 px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition duration-200">
                    Quay lại Tổng quan
                </button>
            `;
        }

        // 4. Cập nhật DOM & Cuộn trang
        mainContentElement.innerHTML = newContentHTML;
        window.scrollTo({ top: 0, behavior: 'smooth' }); 

        // 5. Cập nhật Active Link
        updateActiveSidebarLink(key);

        // 6. Cập nhật URL hash để giữ trạng thái
        window.history.pushState(null, '', `#${key}`);
        
    } catch (error) {
        console.error('Lỗi tải nội dung:', error);
        mainContentElement.innerHTML = `<div class="p-10 bg-red-100 text-red-800 rounded-lg">Lỗi: Không thể tải nội dung ${data.title}. Vui lòng kiểm tra file ${data.file}.</div>`;
    }
};

// --- HÀM HỖ TRỢ ---
function updateActiveSidebarLink(activeKey) {
    const links = document.querySelectorAll('.sidebar-link');
    links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-target') === activeKey) {
            link.classList.add('active');
        }
    });
}

const toggleSidebar = () => {
    const isHidden = document.body.classList.toggle('sidebar-hidden');
    if (window.innerWidth < 768) {
        document.body.classList.toggle('sidebar-visible', !isHidden);
    }
};

const handleLayout = () => {
    if (window.innerWidth < 768) {
        document.body.classList.add('sidebar-hidden');
        document.body.classList.remove('sidebar-visible');
    } else {
        document.body.classList.remove('sidebar-hidden', 'sidebar-visible');
    }
};


// --- INIT VÀ SỰ KIỆN ---

document.addEventListener('DOMContentLoaded', () => {
    handleLayout(); 
    window.addEventListener('resize', handleLayout);

    sidebarToggleMobile.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', toggleSidebar);

    // Tạo menu Sidebar động
    const allKeys = Object.keys(curriculumData);
    
    allKeys.forEach((key) => {
        const data = curriculumData[key];
        
        const link = document.createElement('a');
        link.href = `#${key}`;
        link.textContent = data.title;
        
        // Cấu hình class cho Tổng quan và các giai đoạn chi tiết
        link.className = `sidebar-link block py-3 px-4 text-gray-600 hover:bg-gray-100 transition duration-150 ease-in-out cursor-pointer text-base rounded-lg mb-1 ${data.isSummary ? 'font-bold mb-2' : ''}`;
        link.setAttribute('data-target', key);
        
        // Gán sự kiện click để render nội dung
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.renderContent(key);
            
            // Ẩn sidebar trên mobile sau khi click vào link
            if (window.innerWidth < 768) {
                toggleSidebar();
            }
        });
        
        curriculumMenu.appendChild(link);
    });

    // Lắng nghe sự kiện thay đổi hash (ví dụ: nút back/forward của trình duyệt)
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            window.renderContent(hash);
        } else {
            window.renderContent('summary'); // Mặc định về trang summary nếu hash rỗng
        }
    });

    // Kiểm tra hash URL và tải nội dung tương ứng, hoặc tải summary nếu không có hash
    const initialKey = window.location.hash.replace('#', '') || 'summary';
    window.renderContent(initialKey);
});