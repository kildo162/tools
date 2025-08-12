// Hàm toggle sidebar
const toggleSidebar = () => {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  
  sidebar.classList.toggle('active');
  
  // Toggle overlay cho mobile
  if (overlay) {
    overlay.classList.toggle('active');
  }
}

// Thêm event listener cho nút toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.querySelector('.sidebar-toggle');
  if (toggleButton) {
    toggleButton.addEventListener('click', toggleSidebar);
  }

  // Tạo overlay nếu chưa có
  if (!document.querySelector('.sidebar-overlay')) {
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    // Click overlay để đóng sidebar
    overlay.addEventListener('click', () => {
      const sidebar = document.querySelector('.sidebar');
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });
  }

  // Active state cho navigation items
  const navItems = document.querySelectorAll('.nav-item');
  
  // Set active item based on current hash
  const setActiveItem = () => {
    const currentHash = window.location.hash || '#home';
    
    // Remove active from all nav items
    navItems.forEach(item => {
      item.classList.remove('active');
    });
    
    // Remove active from all tools
    const allTools = document.querySelectorAll('.tool');
    allTools.forEach(tool => tool.classList.remove('active'));
    
    // Set active nav item (only if not home)
    if (currentHash !== '#home') {
      const activeNavItem = document.querySelector(`[href="${currentHash}"]`);
      if (activeNavItem) {
        activeNavItem.classList.add('active');
      }
    }
    
    // Show corresponding tool
    const targetId = currentHash.substring(1);
    const targetTool = document.getElementById(targetId);
    if (targetTool) {
      targetTool.classList.add('active');
    }
  };

  // Set initial active item
  setActiveItem();

  // Add click handler for home/logo links
  const homeLinks = document.querySelectorAll('a[href="#home"], .logo-link');
  homeLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active from all nav items
      navItems.forEach(item => item.classList.remove('active'));
      
      // Remove active from all tools
      const allTools = document.querySelectorAll('.tool');
      allTools.forEach(tool => tool.classList.remove('active'));
      
      // Show home/dashboard
      const homeTool = document.getElementById('home');
      if (homeTool) {
        homeTool.classList.add('active');
      }
      
      // Update URL hash
      window.location.hash = '#home';
    });
  });

  // Add click handlers to nav items
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Remove active class from all items
      navItems.forEach(navItem => navItem.classList.remove('active'));
      // Add active class to clicked item
      item.classList.add('active');
      
      // Hide all tools first (including dashboard)
      const allTools = document.querySelectorAll('.tool');
      allTools.forEach(tool => {
        tool.classList.remove('active');
      });
      
      // Show the selected tool
      const targetHref = item.getAttribute('href');
      if (targetHref && targetHref.startsWith('#')) {
        const targetId = targetHref.substring(1);
        const targetTool = document.getElementById(targetId);
        if (targetTool) {
          targetTool.classList.add('active');
        }
      }
      
      // Close sidebar on mobile after clicking
      if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        setTimeout(() => {
          sidebar.classList.remove('active');
          if (overlay) overlay.classList.remove('active');
        }, 200);
      }
    });
  });

  // Listen for hash changes
  window.addEventListener('hashchange', setActiveItem);
});

// Đóng sidebar khi click ra ngoài (optional)
document.addEventListener('click', (e) => {
  const sidebar = document.querySelector('.sidebar');
  const toggle = document.querySelector('.sidebar-toggle');
  const overlay = document.querySelector('.sidebar-overlay');
  
  if (sidebar && toggle && !sidebar.contains(e.target) && !toggle.contains(e.target) && window.innerWidth <= 768) {
    sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  }
});

const sendTelegramMessage = async () => {
  const chatId = document.getElementById('telegram-chat-id').value;
  const message = document.getElementById('telegram-message').value;
  const token = 'YOUR_TELEGRAM_BOT_TOKEN'; // Replace with your bot token

  if (chatId && message) {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const data = {
      chat_id: chatId,
      text: message
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('Message sent successfully!');
      } else {
        alert('Failed to send message.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending message.');
    }
  } else {
    alert('Please enter both Chat ID and message.');
  }
};

document.getElementById('send-telegram-message').addEventListener('click', sendTelegramMessage);