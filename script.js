  // --- JAVASCRIPT ĐIỀU KHIỂN GIAO DIỆN VÀ CUỘN TRANG ---

        document.addEventListener('DOMContentLoaded', () => {
            const sidebar = document.getElementById('sidebar');
            const mainContentContainer = document.getElementById('main-content-container');
            const sidebarToggleMobile = document.getElementById('sidebar-toggle-mobile');
            const sidebarOverlay = document.getElementById('sidebar-overlay');
            const sections = document.querySelectorAll('section[id^="giai-doan-"]');
            const curriculumMenu = document.getElementById('curriculum-menu');
            const navLinks = [];

            // Thiết lập Sidebar mặc định (Ẩn trên mobile)
            const isMobile = window.innerWidth < 768;
            if (isMobile) {
                document.body.classList.add('sidebar-hidden');
            } else {
                document.body.classList.remove('sidebar-hidden');
            }
            
            // 1. Logic Toggles Sidebar
            const toggleSidebar = () => {
                const isHidden = document.body.classList.toggle('sidebar-hidden');
                
                // Thêm/bỏ lớp overlay cho mobile
                if (window.innerWidth < 768) {
                    document.body.classList.toggle('sidebar-visible', !isHidden);
                }
            };

            sidebarToggleMobile.addEventListener('click', toggleSidebar);
            sidebarOverlay.addEventListener('click', toggleSidebar);

            // Xử lý khi resize, đảm bảo Sidebar luôn hiện trên Desktop
            window.addEventListener('resize', () => {
                if (window.innerWidth >= 768) {
                    document.body.classList.remove('sidebar-hidden', 'sidebar-visible');
                } else {
                    // Nếu đang ở mobile, đảm bảo sidebar bị ẩn
                    document.body.classList.add('sidebar-hidden');
                    document.body.classList.remove('sidebar-visible');
                }
            });


            // 2. Tự động tạo menu Sidebar từ tiêu đề các Giai đoạn
            sections.forEach((section, index) => {
                const sectionId = section.id;
                const titleElement = section.querySelector('h2[id$="-title"]');
                const title = titleElement ? titleElement.textContent : `Giai đoạn ${index + 1}`;
                
                // Tạo liên kết menu
                const link = document.createElement('a');
                link.href = `#${sectionId}`;
                link.textContent = title;
                link.className = 'sidebar-link block py-3 px-4 text-gray-600 hover:bg-gray-100 transition duration-150 ease-in-out cursor-pointer text-base rounded-lg mb-1';
                link.setAttribute('data-target', sectionId);
                
                curriculumMenu.appendChild(link);
                navLinks.push(link);

                // Thêm sự kiện cuộn mượt cho mỗi link
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Cuộn mượt đến vị trí section, trừ đi chiều cao của navbar (64px)
                    const target = document.getElementById(sectionId);
                    if (target) {
                        const offset = 64; // Chiều cao của Navbar
                        const bodyRect = document.body.getBoundingClientRect().top;
                        const elementRect = target.getBoundingClientRect().top;
                        const elementPosition = elementRect - bodyRect;
                        const offsetPosition = elementPosition - offset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });

                        // Ẩn sidebar sau khi click trên mobile
                        if (window.innerWidth < 768) {
                            toggleSidebar();
                        }
                    }
                });
            });

            // 3. Highlight link Sidebar khi cuộn trang
            const highlightActiveLink = () => {
                let current = '';

                // Tìm section đang nằm trong tầm nhìn của viewport
                sections.forEach(section => {
                    // Kiểm tra chỉ khi sidebar hiển thị trên desktop hoặc đang ở mobile
                    if (window.innerWidth >= 768 || !document.body.classList.contains('sidebar-hidden')) {
                         const sectionTop = section.offsetTop - 70; // Trừ đi navbar + 1 chút padding
                         const sectionHeight = section.clientHeight;

                         if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                             current = section.id;
                         }
                    } else {
                        // Trên mobile khi sidebar ẩn, không cần highlight cuộn
                        return;
                    }
                   
                });

                // Xóa active class cũ và thêm active class mới
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-target') === current) {
                        link.classList.add('active');
                    }
                });
            };

            // Gán sự kiện cho window scroll
            window.addEventListener('scroll', highlightActiveLink);
            // Gọi lần đầu khi trang được tải để active section đầu tiên
            highlightActiveLink();
        });