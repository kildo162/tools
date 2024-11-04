// Hàm toggle sidebar
const toggleSidebar = () => {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('active');
}

// Thêm event listener cho nút toggle
document.querySelector('.sidebar-toggle').addEventListener('click', toggleSidebar);

// Đóng sidebar khi click ra ngoài (optional)
document.addEventListener('click', (e) => {
  const sidebar = document.querySelector('.sidebar');
  const toggle = document.querySelector('.sidebar-toggle');
  
  if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
    sidebar.classList.remove('active');
  }
}); 