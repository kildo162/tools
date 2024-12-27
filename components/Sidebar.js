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