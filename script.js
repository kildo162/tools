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

    // Function to get system info
    function getSystemInfo() {
        const browserInfo = {
            name: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            browser: getBrowserInfo()
        };
        return browserInfo;
    }

    // Function to detect browser name and version
    function getBrowserInfo() {
        const userAgent = navigator.userAgent;
        let browser = "Unknown";
        
        if (userAgent.match(/chrome|chromium|crios/i)) {
            browser = "Chrome";
        } else if (userAgent.match(/firefox|fxios/i)) {
            browser = "Firefox";
        } else if (userAgent.match(/safari/i)) {
            browser = "Safari";
        } else if (userAgent.match(/opr\//i)) {
            browser = "Opera";
        } else if (userAgent.match(/edg/i)) {
            browser = "Edge";
        }
        
        return browser;
    }

    // Danh sách các API để lấy IP
    const IP_APIS = [
        {
            name: 'ipify',
            url: 'https://api.ipify.org?format=json',
            transform: (data) => ({ ip: data.ip })
        },
        {
            name: 'ipapi.co',
            url: 'https://ipapi.co/json/',
            transform: (data) => ({ ip: data.ip })
        },
        {
            name: 'cloudflare',
            url: 'https://1.1.1.1/cdn-cgi/trace',
            transform: (data) => {
                const ip = data.split('\n').find(line => line.startsWith('ip=')).split('=')[1];
                return { ip };
            }
        }
    ];

    // Danh sách các API để lấy location
    const LOCATION_APIS = [
        {
            name: 'ip-api',
            url: (ip) => `http://ip-api.com/json/${ip}`,
            transform: (data) => ({
                country: data.country,
                countryCode: data.countryCode,
                region: data.regionName,
                city: data.city,
                timezone: data.timezone,
                isp: data.isp,
                lat: data.lat,
                lon: data.lon,
                as: data.as
            })
        },
        {
            name: 'ipapi.co',
            url: (ip) => `https://ipapi.co/${ip}/json/`,
            transform: (data) => ({
                country: data.country_name,
                countryCode: data.country_code,
                region: data.region,
                city: data.city,
                timezone: data.timezone,
                isp: data.org,
                lat: data.latitude,
                lon: data.longitude,
                as: data.asn
            })
        },
        {
            name: 'ipwho.is',
            url: (ip) => `https://ipwho.is/${ip}`,
            transform: (data) => ({
                country: data.country,
                countryCode: data.country_code,
                region: data.region,
                city: data.city,
                timezone: data.timezone.id,
                isp: data.connection.isp,
                lat: data.latitude,
                lon: data.longitude,
                as: data.connection.asn
            })
        }
    ];

    // Function to try different APIs until one works
    async function tryAPIs(apis, param = null) {
        for (const api of apis) {
            try {
                const url = typeof api.url === 'function' ? api.url(param) : api.url;
                const response = await fetch(url);
                
                let data;
                if (api.name === 'cloudflare') {
                    data = await response.text();
                } else {
                    data = await response.json();
                }
                
                if (response.ok && data) {
                    console.log(`Successfully used ${api.name}`);
                    return {
                        ...api.transform(data),
                        source: api.name
                    };
                }
            } catch (error) {
                console.warn(`Failed to fetch from ${api.name}:`, error);
                continue;
            }
        }
        throw new Error('All APIs failed');
    }

    // Function to get IP and location info
    async function getIPAddress() {
        const refreshBtn = document.getElementById('ip-refresh');
        refreshBtn.classList.add('loading');
        
        try {
            document.getElementById('ip-info').innerHTML = `
                <div class="loading-message">
                    <p>Đang tải thông tin...</p>
                </div>
            `;

            const ipData = await tryAPIs(IP_APIS);
            const locationData = await tryAPIs(LOCATION_APIS, ipData.ip);
            const systemInfo = getSystemInfo();
            
            const ipInfoHTML = `
                <div class="ip-info-group">
                    <h3>Network Information</h3>
                    <p><strong>IP Address:</strong> ${ipData.ip}</p>
                    <p><strong>ISP:</strong> ${locationData.isp || 'N/A'}</p>
                    <p><strong>Connection Type:</strong> ${locationData.as || 'N/A'}</p>
                    <p class="api-source">Source: IP (${ipData.source})</p>
                </div>
                <div class="ip-info-group">
                    <h3>Location Information</h3>
                    <p><strong>Country:</strong> ${locationData.country} (${locationData.countryCode})</p>
                    <p><strong>Region:</strong> ${locationData.region}</p>
                    <p><strong>City:</strong> ${locationData.city}</p>
                    <p><strong>Timezone:</strong> ${locationData.timezone}</p>
                    <p><strong>Coordinates:</strong> ${locationData.lat}, ${locationData.lon}</p>
                    <p class="api-source">Source: Location (${locationData.source})</p>
                </div>
                <div class="ip-info-group">
                    <h3>Browser Information</h3>
                    <p><strong>Browser:</strong> ${systemInfo.browser}</p>
                    <p><strong>Language:</strong> ${systemInfo.language}</p>
                    <p><strong>Platform:</strong> ${systemInfo.platform}</p>
                    <p><strong>Screen Resolution:</strong> ${systemInfo.screenResolution}</p>
                    <p><strong>Timezone:</strong> ${systemInfo.timezone}</p>
                    <p class="api-source">Source: Local Browser Data</p>
                </div>
            `;
            
            document.getElementById('ip-info').innerHTML = ipInfoHTML;
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('ip-info').innerHTML = `
                <div class="error-message">
                    <p>Lỗi khi lấy thông tin IP: ${error.message}</p>
                    <p>Vui lòng thử lại sau vài phút.</p>
                </div>
            `;
        } finally {
            refreshBtn.classList.remove('loading');
        }
    }

    // Initialize IP info with refresh button
    function initIPInfo() {
        const ipContainer = document.getElementById('ip-info').parentElement;
        const refreshButton = document.createElement('button');
        refreshButton.id = 'ip-refresh';
        refreshButton.innerHTML = `
            <span class="refresh-icon">↻</span>
            <span class="button-text">Refresh</span>
        `;
        ipContainer.insertBefore(refreshButton, document.getElementById('ip-info'));
        
        refreshButton.addEventListener('click', getIPAddress);
        getIPAddress();
    }

    // Trong phần DOMContentLoaded, thêm:
    initIPInfo();

    // Base64 Tool Functions
    function initBase64Tool() {
        const input = document.getElementById('base64-input');
        const output = document.getElementById('base64-output');
        const encodeBtn = document.getElementById('base64-encode');
        const decodeBtn = document.getElementById('base64-decode');
        const clearBtn = document.getElementById('base64-clear');
        const copyBtn = document.getElementById('base64-copy');
        const unicodeCheckbox = document.getElementById('base64-unicode');

        // Set Unicode checkbox to be checked by default
        unicodeCheckbox.checked = true;

        // Encode function
        encodeBtn.addEventListener('click', () => {
            try {
                const text = input.value;
                if (!text) {
                    throw new Error('Vui lòng nhập text cần encode');
                }
                const encoded = unicodeCheckbox.checked 
                    ? btoa(unescape(encodeURIComponent(text))) 
                    : btoa(text);
                output.value = encoded;
            } catch (error) {
                output.value = `Error: ${error.message}`;
            }
        });

        // Decode function
        decodeBtn.addEventListener('click', () => {
            try {
                const text = input.value;
                if (!text) {
                    throw new Error('Vui lòng nhập text cần decode');
                }
                const decoded = unicodeCheckbox.checked 
                    ? decodeURIComponent(escape(atob(text))) 
                    : atob(text);
                output.value = decoded;
            } catch (error) {
                output.value = 'Error: Invalid Base64 string';
            }
        });

        // Clear function
        clearBtn.addEventListener('click', () => {
            input.value = '';
            output.value = '';
            input.focus();
        });

        // Copy function
        copyBtn.addEventListener('click', async () => {
            try {
                const textToCopy = output.value;
                if (!textToCopy) {
                    throw new Error('Không có nội dung để copy');
                }
                
                await navigator.clipboard.writeText(textToCopy);
                
                // Visual feedback
                copyBtn.textContent = 'Copied!';
                copyBtn.classList.add('copy-success');
                
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                    copyBtn.classList.remove('copy-success');
                }, 1000);
            } catch (error) {
                alert('Không thể copy: ' + error.message);
            }
        });

        // Auto-resize textareas
        function autoResize(element) {
            element.style.height = 'auto';
            element.style.height = element.scrollHeight + 'px';
        }

        input.addEventListener('input', () => autoResize(input));
        output.addEventListener('input', () => autoResize(output));
    }

    // Thêm vào phần DOMContentLoaded
    initBase64Tool();
});

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

document.addEventListener('DOMContentLoaded', () => {
    const base64Input = document.getElementById('base64-input');
    const base64FileInput = document.getElementById('base64-file-input');
    const base64Output = document.getElementById('base64-output');
    const encodeButton = document.getElementById('base64-encode');
    const decodeButton = document.getElementById('base64-decode');
    const clearButton = document.getElementById('base64-clear');
    const copyButton = document.getElementById('base64-copy');

    encodeButton.addEventListener('click', () => {
        const input = base64Input.value;
        if (input) {
            base64Output.textContent = btoa(input);
        }
    });

    decodeButton.addEventListener('click', () => {
        const input = base64Input.value;
        if (input) {
            try {
                base64Output.textContent = atob(input);
            } catch (e) {
                base64Output.textContent = 'Invalid Base64 string';
            }
        }
    });

    clearButton.addEventListener('click', () => {
        base64Input.value = '';
        base64Output.textContent = '';
    });

    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(base64Output.textContent);
    });

    base64FileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                base64Input.value = reader.result;
            };
            reader.readAsText(file);
        }
    });

    // Donate Modal Functions
    window.showDonateModal = function() {
        // Create modal HTML
        const modalHTML = `
            <div id="donate-modal" class="modal-overlay" onclick="closeDonateModal()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2>💙 Support DevTools</h2>
                        <button class="modal-close" onclick="closeDonateModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>Your support helps keep these tools free and continuously improved!</p>
                        <div class="donate-options">
                            <a href="https://www.buymeacoffee.com/khanhnd35" target="_blank" class="donate-option coffee">
                                <span class="option-icon">☕</span>
                                <div class="option-text">
                                    <strong>Buy me a coffee</strong>
                                    <small>One-time donation</small>
                                </div>
                            </a>
                            <a href="https://github.com/sponsors/kildo162" target="_blank" class="donate-option github">
                                <span class="option-icon">💖</span>
                                <div class="option-text">
                                    <strong>GitHub Sponsors</strong>
                                    <small>Monthly support</small>
                                </div>
                            </a>
                            <a href="https://paypal.me/khanhnd35" target="_blank" class="donate-option paypal">
                                <span class="option-icon">💰</span>
                                <div class="option-text">
                                    <strong>PayPal</strong>
                                    <small>Direct donation</small>
                                </div>
                            </a>
                        </div>
                        <div class="other-support">
                            <h3>Other ways to support:</h3>
                            <div class="support-buttons">
                                <a href="https://github.com/kildo162/tools" target="_blank" class="support-btn">
                                    <span>⭐</span> Star on GitHub
                                </a>
                                <a href="https://github.com/kildo162/tools/issues" target="_blank" class="support-btn">
                                    <span>🐛</span> Report Issues
                                </a>
                                <a href="#" onclick="shareProject()" class="support-btn">
                                    <span>📢</span> Share Project
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add modal styles
        addModalStyles();
        
        // Show modal with animation
        setTimeout(() => {
            document.getElementById('donate-modal').classList.add('show');
        }, 10);
    };

    window.closeDonateModal = function() {
        const modal = document.getElementById('donate-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    };

    window.shareProject = function() {
        if (navigator.share) {
            navigator.share({
                title: 'DevTools - Free Developer Utilities',
                text: 'Check out these amazing free developer tools!',
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Link copied to clipboard!');
            });
        }
    };

    // MoMo Modal Functions
    window.showMoMoModal = function() {
        const modalHTML = `
            <div id="momo-modal" class="modal-overlay" onclick="closeMoMoModal()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2>💰 MoMo Payment</h2>
                        <button class="modal-close" onclick="closeMoMoModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="payment-info">
                            <div class="payment-method">
                                <div class="qr-section">
                                    <div class="qr-placeholder">
                                        <div class="qr-code">📱</div>
                                        <p>Scan QR code with MoMo app</p>
                                    </div>
                                </div>
                                <div class="payment-details">
                                    <div class="detail-item">
                                        <strong>Phone:</strong>
                                        <span>0123456789</span>
                                        <button class="copy-btn" onclick="copyToClipboard('0123456789')">📋</button>
                                    </div>
                                    <div class="detail-item">
                                        <strong>Name:</strong>
                                        <span>NGUYEN DINH KHANH</span>
                                    </div>
                                    <div class="detail-item">
                                        <strong>Message:</strong>
                                        <span>Support DevTools</span>
                                        <button class="copy-btn" onclick="copyToClipboard('Support DevTools')">📋</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="payment-note">
                            <p><strong>Note:</strong> Please include "Support DevTools" in the message so we can identify your donation. Thank you! 🙏</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        addModalStyles();
        setTimeout(() => {
            document.getElementById('momo-modal').classList.add('show');
        }, 10);
    };

    window.closeMoMoModal = function() {
        const modal = document.getElementById('momo-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    };

    // ZaloPay Modal Functions
    window.showZaloPayModal = function() {
        const modalHTML = `
            <div id="zalopay-modal" class="modal-overlay" onclick="closeZaloPayModal()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2>💳 ZaloPay Payment</h2>
                        <button class="modal-close" onclick="closeZaloPayModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="payment-info">
                            <div class="payment-method">
                                <div class="qr-section">
                                    <div class="qr-placeholder">
                                        <div class="qr-code">📱</div>
                                        <p>Scan QR code with ZaloPay app</p>
                                    </div>
                                </div>
                                <div class="payment-details">
                                    <div class="detail-item">
                                        <strong>Phone:</strong>
                                        <span>0123456789</span>
                                        <button class="copy-btn" onclick="copyToClipboard('0123456789')">📋</button>
                                    </div>
                                    <div class="detail-item">
                                        <strong>Name:</strong>
                                        <span>NGUYEN DINH KHANH</span>
                                    </div>
                                    <div class="detail-item">
                                        <strong>Message:</strong>
                                        <span>Support DevTools</span>
                                        <button class="copy-btn" onclick="copyToClipboard('Support DevTools')">📋</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="payment-note">
                            <p><strong>Note:</strong> Please include "Support DevTools" in the message so we can identify your donation. Thank you! 🙏</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        addModalStyles();
        setTimeout(() => {
            document.getElementById('zalopay-modal').classList.add('show');
        }, 10);
    };

    window.closeZaloPayModal = function() {
        const modal = document.getElementById('zalopay-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    };

    // Copy to clipboard function
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(() => {
            // Show temporary success message
            const button = event.target;
            const originalText = button.innerHTML;
            button.innerHTML = '✅';
            button.style.color = '#10b981';
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.color = '';
            }, 1500);
        }).catch(() => {
            alert('Failed to copy. Please copy manually: ' + text);
        });
    };

    function addModalStyles() {
        if (!document.getElementById('modal-styles')) {
            const styles = `
                <style id="modal-styles">
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                
                .modal-overlay.show {
                    opacity: 1;
                    visibility: visible;
                }
                
                .modal-content {
                    background: linear-gradient(135deg, #ffffff, #f8fafc);
                    border-radius: 16px;
                    max-width: 480px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    transform: scale(0.8) translateY(20px);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .modal-overlay.show .modal-content {
                    transform: scale(1) translateY(0);
                }
                
                .modal-header {
                    padding: 24px 24px 16px;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .modal-header h2 {
                    margin: 0;
                    color: #1e293b;
                    font-size: 20px;
                    font-weight: 600;
                }
                
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #64748b;
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }
                
                .modal-close:hover {
                    background: #f1f5f9;
                    color: #334155;
                }
                
                .modal-body {
                    padding: 24px;
                }
                
                .modal-body p {
                    color: #475569;
                    margin: 0 0 24px;
                    line-height: 1.6;
                }
                
                .donate-options {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 32px;
                }
                
                .donate-option {
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    background: #ffffff;
                }
                
                .donate-option:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                }
                
                .donate-option.coffee:hover {
                    border-color: #f59e0b;
                    box-shadow: 0 8px 25px rgba(245, 158, 11, 0.2);
                }
                
                .donate-option.github:hover {
                    border-color: #ec4899;
                    box-shadow: 0 8px 25px rgba(236, 72, 153, 0.2);
                }
                
                .donate-option.paypal:hover {
                    border-color: #3b82f6;
                    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
                }
                
                .option-icon {
                    font-size: 24px;
                    margin-right: 16px;
                    width: 40px;
                    text-align: center;
                }
                
                .option-text {
                    flex: 1;
                }
                
                .option-text strong {
                    display: block;
                    color: #1e293b;
                    font-size: 16px;
                    margin-bottom: 2px;
                }
                
                .option-text small {
                    color: #64748b;
                    font-size: 13px;
                }
                
                .other-support {
                    border-top: 1px solid #e2e8f0;
                    padding-top: 24px;
                }
                
                .other-support h3 {
                    margin: 0 0 16px;
                    color: #334155;
                    font-size: 16px;
                    font-weight: 600;
                }
                
                .support-buttons {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                
                .support-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 12px;
                    background: #f1f5f9;
                    color: #475569;
                    text-decoration: none;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                
                .support-btn:hover {
                    background: #e2e8f0;
                    color: #334155;
                    transform: translateY(-1px);
                }
                
                @media (max-width: 480px) {
                    .modal-content {
                        width: 95%;
                        margin: 20px;
                    }
                    
                    .donate-options {
                        gap: 8px;
                    }
                    
                    .donate-option {
                        padding: 12px;
                    }
                    
                    .support-buttons {
                        justify-content: center;
                    }
                }
                
                /* Payment Modal Styles */
                .payment-info {
                    margin-bottom: 24px;
                }
                
                .payment-method {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                
                .qr-section {
                    text-align: center;
                    padding: 20px;
                    background: #f8fafc;
                    border-radius: 12px;
                    border: 2px dashed #e2e8f0;
                }
                
                .qr-placeholder {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                }
                
                .qr-code {
                    font-size: 48px;
                    color: #64748b;
                }
                
                .qr-placeholder p {
                    color: #64748b;
                    font-size: 14px;
                    margin: 0;
                }
                
                .payment-details {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .detail-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px;
                    background: #f8fafc;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                }
                
                .detail-item strong {
                    color: #334155;
                    min-width: 80px;
                }
                
                .detail-item span {
                    flex: 1;
                    margin: 0 12px;
                    font-family: monospace;
                    color: #1e293b;
                }
                
                .copy-btn {
                    background: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    padding: 6px 10px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.2s ease;
                }
                
                .copy-btn:hover {
                    background: #2563eb;
                    transform: translateY(-1px);
                }
                
                .payment-note {
                    background: linear-gradient(135deg, #fef3c7, #fde68a);
                    padding: 16px;
                    border-radius: 8px;
                    border-left: 4px solid #f59e0b;
                }
                
                .payment-note p {
                    margin: 0;
                    color: #92400e;
                    font-size: 13px;
                    line-height: 1.5;
                }
                
                @media (max-width: 480px) {
                    .payment-method {
                        gap: 16px;
                    }
                    
                    .detail-item {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 8px;
                    }
                    
                    .detail-item strong,
                    .detail-item span {
                        margin: 0;
                    }
                }
                </style>
            `;
            document.head.insertAdjacentHTML('beforeend', styles);
        }
    }
});
