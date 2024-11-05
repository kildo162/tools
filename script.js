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
        const start = new Date(Date.UTC(1970, 0, 1));
        const diffTime = now - start;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        document.getElementById('days-since-1970').textContent = diffDays;
    }

    // Initial call
    calculateDaysSince1970();

    // Update every second
    setInterval(calculateDaysSince1970, 1000);

    // JSON Formatter
    function initJsonFormatter() {
        const jsonInput = document.getElementById('json-input');
        const jsonOutput = document.getElementById('json-output');
        const formatBtn = document.getElementById('format-json');
        const minifyBtn = document.getElementById('minify-json');
        const copyBtn = document.getElementById('copy-json');
        const clearBtn = document.getElementById('clear-json');
        const indentSize = document.getElementById('indent-size');
        const sortKeys = document.getElementById('sort-keys');
        const validationStatus = document.getElementById('validation-status');

        function formatJSON(minify = false) {
            const input = jsonInput.value.trim();
            if (!input) {
                jsonOutput.textContent = '';
                validationStatus.textContent = '';
                return;
            }

            try {
                let json = JSON.parse(input);
                
                // Sort keys if option is selected
                if (sortKeys.checked) {
                    json = sortObjectKeys(json);
                }
                
                // Format with selected indent or minify
                const formatted = minify 
                    ? JSON.stringify(json)
                    : JSON.stringify(json, null, indentSize.value === 'tab' ? '\t' : Number(indentSize.value));
                
                jsonOutput.textContent = formatted;
                validationStatus.innerHTML = '<span>✓ Valid JSON</span>';
                validationStatus.className = 'validation-status valid';
            } catch (error) {
                validationStatus.innerHTML = `<span>✗ Invalid JSON: ${error.message}</span>`;
                validationStatus.className = 'validation-status invalid';
                jsonOutput.textContent = '';
            }
        }

        function sortObjectKeys(obj) {
            if (typeof obj !== 'object' || obj === null) return obj;
            if (Array.isArray(obj)) return obj.map(sortObjectKeys);
            return Object.keys(obj).sort().reduce((result, key) => {
                result[key] = sortObjectKeys(obj[key]);
                return result;
            }, {});
        }

        // Event Listeners
        formatBtn.addEventListener('click', () => formatJSON(false));
        minifyBtn.addEventListener('click', () => formatJSON(true));
        
        copyBtn.addEventListener('click', () => {
            if (jsonOutput.textContent) {
                navigator.clipboard.writeText(jsonOutput.textContent)
                    .then(() => {
                        copyBtn.textContent = 'Copied!';
                        setTimeout(() => copyBtn.textContent = 'Copy', 2000);
                    });
            }
        });
        
        clearBtn.addEventListener('click', () => {
            jsonInput.value = '';
            jsonOutput.textContent = '';
            validationStatus.textContent = '';
        });

        // Auto-format on input change with debounce
        let timeout;
        jsonInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => formatJSON(false), 500);
        });

        // Format options change handlers
        indentSize.addEventListener('change', () => formatJSON(false));
        sortKeys.addEventListener('change', () => formatJSON(false));
    }

    // Initialize when DOM is loaded
    initJsonFormatter();

    function initJwtParser() {
        const jwtInput = document.getElementById('jwt-input');
        const parseButton = document.getElementById('parse-jwt');
        const headerContent = document.querySelector('.jwt-part.header .part-content');
        const payloadContent = document.querySelector('.jwt-part.payload .part-content');
        const signatureContent = document.querySelector('.jwt-part.signature .part-content');

        function parseJWT() {
            const token = jwtInput.value.trim();
            if (!token) {
                clearResults();
                return;
            }

            try {
                const parts = token.split('.');
                if (parts.length !== 3) throw new Error('Invalid JWT format');

                // Decode header
                const header = JSON.parse(atob(parts[0]));
                headerContent.textContent = JSON.stringify(header, null, 2);

                // Decode payload
                const payload = JSON.parse(atob(parts[1]));
                payloadContent.textContent = JSON.stringify(payload, null, 2);

                // Show signature
                signatureContent.textContent = parts[2];

                // Add success class
                document.querySelector('.jwt-result').classList.add('success');
            } catch (error) {
                clearResults();
                // Show error message
                headerContent.textContent = 'Error: ' + error.message;
                document.querySelector('.jwt-result').classList.add('error');
            }
        }

        function clearResults() {
            headerContent.textContent = '';
            payloadContent.textContent = '';
            signatureContent.textContent = '';
            document.querySelector('.jwt-result').classList.remove('success', 'error');
        }

        // Event Listeners
        parseButton.addEventListener('click', parseJWT);

        // Auto-parse with debounce
        let timeout;
        jwtInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(parseJWT, 500);
        });
    }

    // Initialize when DOM is loaded
    initJwtParser();
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
