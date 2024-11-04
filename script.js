document.addEventListener('DOMContentLoaded', function() {
    // Lấy tất cả các link trong sidebar
    const links = document.querySelectorAll('.feature-list a');
    
    // Lấy tất cả các tool
    const tools = document.querySelectorAll('.tool');
    
    // Hàm ẩn tất cả tools
    function hideAllTools() {
        tools.forEach(tool => {
            tool.classList.remove('active');
        });
        links.forEach(link => {
            link.classList.remove('active');
        });
    }
    
    // Xử lý sự kiện click cho mỗi link
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Ẩn tất cả tools
            hideAllTools();
            
            // Lấy ID của tool cần hiển thị
            const targetId = this.getAttribute('href').substring(1);
            
            // Hiển thị tool được chọn
            document.getElementById(targetId).classList.add('active');
            
            // Highlight link được chọn
            this.classList.add('active');
        });
    });
    
    // Hiển thị tool đầu tiên mặc định
    document.querySelector('.tool').classList.add('active');
    document.querySelector('.feature-list a').classList.add('active');

    // Xử lý JWT Parser
    const jwtInput = document.getElementById('jwt-input');
    const parseJwtButton = document.getElementById('parse-jwt');
    const jwtOutput = document.getElementById('jwt-output');

    parseJwtButton.addEventListener('click', function() {
        const jwt = jwtInput.value.trim();
        if (!jwt) {
            jwtOutput.innerHTML = '<div class="error-message">Vui lòng nhập JWT token</div>';
            return;
        }

        try {
            const parts = jwt.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format');
            }

            const header = JSON.parse(atob(parts[0]));
            const payload = JSON.parse(atob(parts[1]));

            // Tạo HTML với cả phần tổng quan và chi tiết
            jwtOutput.innerHTML = `
                <div class="jwt-overview">
                    <div class="jwt-overview-item">
                        <span class="jwt-dot header-dot"></span>
                        <span class="jwt-part">${parts[0]}</span>
                    </div>
                    <div class="jwt-overview-item">
                        <span class="jwt-dot payload-dot"></span>
                        <span class="jwt-part">${parts[1]}</span>
                    </div>
                    <div class="jwt-overview-item">
                        <span class="jwt-dot signature-dot"></span>
                        <span class="jwt-part">${parts[2]}</span>
                    </div>
                </div>
                <div class="jwt-details">
                    <div class="jwt-section jwt-header">
                        <div class="jwt-label">HEADER</div>
                        <pre>${JSON.stringify(header, null, 2)}</pre>
                    </div>
                    <div class="jwt-section jwt-payload">
                        <div class="jwt-label">PAYLOAD</div>
                        <pre>${JSON.stringify(payload, null, 2)}</pre>
                    </div>
                    <div class="jwt-section jwt-signature">
                        <div class="jwt-label">SIGNATURE</div>
                        <pre>${parts[2]}</pre>
                    </div>
                </div>
            `;
        } catch (error) {
            jwtOutput.innerHTML = `
                <div class="error-message">
                    Lỗi khi parse JWT: ${error.message}
                </div>
            `;
        }
    });

    // Function to calculate days since January 1, 1970
    function calculateDaysSince1970() {
        const now = new Date();
        const start = new Date(1970, 0, 1);
        const diffTime = Math.abs(now - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        document.getElementById('days-since-1970').textContent = diffDays;
    }

    // Initial call
    calculateDaysSince1970();

    // Update every second
    setInterval(calculateDaysSince1970, 1000);
});

// Function to get current IP address
function getIPAddress() {
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('ip-address').textContent = data.ip;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('ip-address').textContent = 'Error fetching IP';
        });
}

// Function to parse JWT
function parseJWT() {
    const jwtInput = document.getElementById('jwt-input').value;
    try {
        const [header, payload, signature] = jwtInput.split('.');
        const decodedHeader = JSON.parse(atob(header));
        const decodedPayload = JSON.parse(atob(payload));
        
        document.getElementById('jwt-output').textContent = 
            'Header: ' + JSON.stringify(decodedHeader, null, 2) + 
            '\n\nPayload: ' + JSON.stringify(decodedPayload, null, 2);
    } catch (error) {
        document.getElementById('jwt-output').textContent = 'Invalid JWT';
    }
}

// Initial calls
getIPAddress();
calculateDaysSince1970();

// Update days since 1970 every second
setInterval(calculateDaysSince1970, 1000);
