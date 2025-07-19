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
});
