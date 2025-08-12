/**
 * Curl Request Builder Component
 * Allows users to build and generate curl commands with an intuitive interface
 */
class CurlBuilder {
    constructor() {
        this.examples = {
            'get': {
                method: 'GET',
                url: 'https://api.github.com/users/octocat',
                headers: [
                    { key: 'Accept', value: 'application/vnd.github.v3+json' }
                ]
            },
            'post-json': {
                method: 'POST',
                url: 'https://api.example.com/users',
                headers: [
                    { key: 'Content-Type', value: 'application/json' },
                    { key: 'Accept', value: 'application/json' }
                ],
                bodyType: 'raw',
                rawType: 'json',
                rawBody: JSON.stringify({
                    "name": "John Doe",
                    "email": "john@example.com",
                    "age": 30
                }, null, 2)
            },
            'post-form': {
                method: 'POST',
                url: 'https://httpbin.org/post',
                headers: [],
                bodyType: 'x-www-form-urlencoded',
                formData: [
                    { key: 'name', value: 'John Doe' },
                    { key: 'email', value: 'john@example.com' }
                ]
            },
            'auth-bearer': {
                method: 'GET',
                url: 'https://api.example.com/protected',
                headers: [
                    { key: 'Authorization', value: 'Bearer your-token-here' }
                ],
                authType: 'bearer',
                bearerToken: 'your-token-here'
            },
            'file-upload': {
                method: 'POST',
                url: 'https://httpbin.org/post',
                headers: [],
                bodyType: 'form-data',
                formData: [
                    { key: 'file', value: '@/path/to/file.txt', type: 'file' },
                    { key: 'description', value: 'File upload example' }
                ]
            }
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeDefaults();
        this.generateCurl();
    }

    initializeDefaults() {
        // Set default Content-Type header for POST requests
        document.getElementById('curl-method').addEventListener('change', (e) => {
            const method = e.target.value;
            if (['POST', 'PUT', 'PATCH'].includes(method)) {
                this.addDefaultHeaders();
            }
            this.generateCurl();
        });
    }

    addDefaultHeaders() {
        const headersContainer = document.getElementById('curl-headers');
        const existingHeaders = headersContainer.querySelectorAll('.key-input');
        let hasContentType = false;

        existingHeaders.forEach(input => {
            if (input.value.toLowerCase() === 'content-type') {
                hasContentType = true;
            }
        });

        if (!hasContentType) {
            // Add Content-Type header
            this.addKeyValuePair('curl-headers', 'Content-Type', 'application/json');
        }
    }

    bindEvents() {
        // Tab switching
        document.querySelectorAll('.curl-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Response tab switching
        document.querySelectorAll('.response-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchResponseTab(e.target.dataset.tab);
            });
        });

        // Add button events
        document.getElementById('add-header').addEventListener('click', () => {
            this.addKeyValuePair('curl-headers');
        });

        document.getElementById('add-param').addEventListener('click', () => {
            this.addKeyValuePair('curl-params');
        });

        document.getElementById('add-form-data').addEventListener('click', () => {
            this.addFormDataPair();
        });

        document.getElementById('add-urlencoded').addEventListener('click', () => {
            this.addKeyValuePair('curl-urlencoded');
        });

        // Body type selection
        document.querySelectorAll('input[name="body-type"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.showBodyContent(e.target.value);
                this.generateCurl();
            });
        });

        // Auth type selection
        document.querySelectorAll('input[name="auth-type"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.showAuthContent(e.target.value);
                this.generateCurl();
            });
        });

        // Input change events
        document.getElementById('curl-url').addEventListener('input', () => this.generateCurl());
        document.getElementById('curl-method').addEventListener('change', () => this.generateCurl());
        document.getElementById('curl-raw-body').addEventListener('input', () => this.generateCurl());

        // Auth input events
        document.getElementById('basic-username').addEventListener('input', () => this.generateCurl());
        document.getElementById('basic-password').addEventListener('input', () => this.generateCurl());
        document.getElementById('bearer-token').addEventListener('input', () => this.generateCurl());
        document.getElementById('api-key-name').addEventListener('input', () => this.generateCurl());
        document.getElementById('api-key-value').addEventListener('input', () => this.generateCurl());
        document.getElementById('api-key-location').addEventListener('change', () => this.generateCurl());

        // Options events
        document.querySelectorAll('#options-panel input').forEach(input => {
            input.addEventListener('change', () => this.generateCurl());
        });

        // Action buttons
        document.getElementById('curl-copy').addEventListener('click', () => this.copyCurl());
        document.getElementById('curl-save').addEventListener('click', () => this.saveConfiguration());
        document.getElementById('curl-load').addEventListener('click', () => this.loadConfiguration());
        document.getElementById('curl-send-request').addEventListener('click', () => this.sendRequest());

        // Example buttons
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.loadExample(e.target.dataset.example);
            });
        });

        // Dynamic input events (using event delegation)
        document.addEventListener('input', (e) => {
            if (e.target.matches('#curl-headers .key-input, #curl-headers .value-input, ' +
                                    '#curl-params .key-input, #curl-params .value-input, ' +
                                    '#curl-form-data .key-input, #curl-form-data .value-input, ' +
                                    '#curl-urlencoded .key-input, #curl-urlencoded .value-input')) {
                this.generateCurl();
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.matches('.remove-pair')) {
                e.target.parentElement.remove();
                this.generateCurl();
            }
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.curl-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update tab panels
        document.querySelectorAll('.curl-tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `${tabName}-panel`);
        });
    }

    switchResponseTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.response-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update tab panels
        document.querySelectorAll('.response-tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `response-${tabName}-panel`);
        });
    }

    addKeyValuePair(containerId, key = '', value = '') {
        const container = document.getElementById(containerId);
        const pair = document.createElement('div');
        pair.className = 'key-value-pair';
        
        pair.innerHTML = `
            <input type="text" placeholder="${this.getPlaceholder(containerId, 'key')}" class="key-input" value="${key}" />
            <input type="text" placeholder="${this.getPlaceholder(containerId, 'value')}" class="value-input" value="${value}" />
            <button class="remove-pair">×</button>
        `;
        
        container.appendChild(pair);
        
        // Focus on the new key input
        pair.querySelector('.key-input').focus();
    }

    addFormDataPair(key = '', value = '', type = 'text') {
        const container = document.getElementById('curl-form-data');
        const pair = document.createElement('div');
        pair.className = 'key-value-pair';
        
        pair.innerHTML = `
            <input type="text" placeholder="Key" class="key-input" value="${key}" />
            <input type="text" placeholder="Value" class="value-input" value="${value}" />
            <select class="type-select">
                <option value="text" ${type === 'text' ? 'selected' : ''}>Text</option>
                <option value="file" ${type === 'file' ? 'selected' : ''}>File</option>
            </select>
            <button class="remove-pair">×</button>
        `;
        
        container.appendChild(pair);
        
        // Add event listener for type change
        pair.querySelector('.type-select').addEventListener('change', () => this.generateCurl());
        
        pair.querySelector('.key-input').focus();
    }

    getPlaceholder(containerId, type) {
        const placeholders = {
            'curl-headers': { key: 'Header name', value: 'Header value' },
            'curl-params': { key: 'Parameter name', value: 'Parameter value' },
            'curl-form-data': { key: 'Key', value: 'Value' },
            'curl-urlencoded': { key: 'Key', value: 'Value' }
        };
        
        return placeholders[containerId]?.[type] || type;
    }

    showBodyContent(bodyType) {
        // Hide all body content
        document.querySelectorAll('.form-data-content, .urlencoded-content, .raw-content, .binary-content')
            .forEach(el => el.style.display = 'none');

        // Show selected body content
        switch (bodyType) {
            case 'form-data':
                document.querySelector('.form-data-content').style.display = 'block';
                break;
            case 'x-www-form-urlencoded':
                document.querySelector('.urlencoded-content').style.display = 'block';
                break;
            case 'raw':
                document.querySelector('.raw-content').style.display = 'block';
                break;
            case 'binary':
                document.querySelector('.binary-content').style.display = 'block';
                break;
        }
    }

    showAuthContent(authType) {
        // Hide all auth content
        document.querySelectorAll('.basic-auth-content, .bearer-auth-content, .api-key-content')
            .forEach(el => el.style.display = 'none');

        // Show selected auth content
        switch (authType) {
            case 'basic':
                document.querySelector('.basic-auth-content').style.display = 'block';
                break;
            case 'bearer':
                document.querySelector('.bearer-auth-content').style.display = 'block';
                break;
            case 'api-key':
                document.querySelector('.api-key-content').style.display = 'block';
                break;
        }
    }

    generateCurl() {
        const method = document.getElementById('curl-method').value;
        const url = document.getElementById('curl-url').value.trim();
        
        if (!url) {
            const curlCommandElement = document.getElementById('curl-command');
            const codeElement = curlCommandElement.querySelector('code');
            if (codeElement) {
                codeElement.textContent = 'Enter a URL to generate curl command';
            } else {
                curlCommandElement.innerHTML = '<code>Enter a URL to generate curl command</code>';
            }
            return;
        }

        let curlCommand = ['curl'];

        // Add method if not GET
        if (method !== 'GET') {
            curlCommand.push('-X', method);
        }

        // Add URL
        let finalUrl = url;
        
        // Add query parameters
        const params = this.getKeyValuePairs('curl-params');
        if (params.length > 0) {
            const urlObj = new URL(url.includes('://') ? url : `https://${url}`);
            params.forEach(param => {
                if (param.key && param.value) {
                    urlObj.searchParams.set(param.key, param.value);
                }
            });
            finalUrl = urlObj.toString();
        }

        // Add headers
        const headers = this.getKeyValuePairs('curl-headers');
        headers.forEach(header => {
            if (header.key && header.value) {
                curlCommand.push('-H', `'${header.key}: ${header.value}'`);
            }
        });

        // Add authentication
        this.addAuthentication(curlCommand);

        // Add body data
        this.addBodyData(curlCommand);

        // Add options
        this.addOptions(curlCommand);

        // Add URL at the end
        curlCommand.push(`'${finalUrl}'`);

        // Format command nicely
        const formattedCommand = curlCommand.join(' \\\n  ');
        const curlCommandElement = document.getElementById('curl-command');
        const codeElement = curlCommandElement.querySelector('code');
        if (codeElement) {
            codeElement.textContent = formattedCommand;
        } else {
            // Fallback: create code element if it doesn't exist
            curlCommandElement.innerHTML = `<code>${formattedCommand}</code>`;
        }
    }

    getKeyValuePairs(containerId) {
        const container = document.getElementById(containerId);
        const pairs = [];
        
        container.querySelectorAll('.key-value-pair').forEach(pair => {
            const key = pair.querySelector('.key-input').value.trim();
            const value = pair.querySelector('.value-input').value.trim();
            const typeSelect = pair.querySelector('.type-select');
            const type = typeSelect ? typeSelect.value : 'text';
            
            if (key || value) {
                pairs.push({ key, value, type });
            }
        });
        
        return pairs;
    }

    addAuthentication(curlCommand) {
        const authType = document.querySelector('input[name="auth-type"]:checked').value;
        
        switch (authType) {
            case 'basic':
                const username = document.getElementById('basic-username').value.trim();
                const password = document.getElementById('basic-password').value.trim();
                if (username || password) {
                    curlCommand.push('-u', `'${username}:${password}'`);
                }
                break;
                
            case 'bearer':
                const token = document.getElementById('bearer-token').value.trim();
                if (token) {
                    curlCommand.push('-H', `'Authorization: Bearer ${token}'`);
                }
                break;
                
            case 'api-key':
                const keyName = document.getElementById('api-key-name').value.trim();
                const keyValue = document.getElementById('api-key-value').value.trim();
                const keyLocation = document.getElementById('api-key-location').value;
                
                if (keyName && keyValue) {
                    if (keyLocation === 'header') {
                        curlCommand.push('-H', `'${keyName}: ${keyValue}'`);
                    }
                    // Query parameter will be handled in URL building
                }
                break;
        }
    }

    addBodyData(curlCommand) {
        const bodyType = document.querySelector('input[name="body-type"]:checked').value;
        
        switch (bodyType) {
            case 'raw':
                const rawBody = document.getElementById('curl-raw-body').value.trim();
                if (rawBody) {
                    curlCommand.push('-d', `'${rawBody}'`);
                }
                break;
                
            case 'form-data':
                const formData = this.getKeyValuePairs('curl-form-data');
                formData.forEach(item => {
                    if (item.key) {
                        if (item.type === 'file' && item.value) {
                            curlCommand.push('-F', `'${item.key}=@${item.value}'`);
                        } else if (item.value) {
                            curlCommand.push('-F', `'${item.key}=${item.value}'`);
                        }
                    }
                });
                break;
                
            case 'x-www-form-urlencoded':
                const urlEncodedData = this.getKeyValuePairs('curl-urlencoded');
                if (urlEncodedData.length > 0) {
                    const dataString = urlEncodedData
                        .filter(item => item.key)
                        .map(item => `${encodeURIComponent(item.key)}=${encodeURIComponent(item.value)}`)
                        .join('&');
                    if (dataString) {
                        curlCommand.push('-d', `'${dataString}'`);
                    }
                }
                break;
                
            case 'binary':
                const fileInput = document.getElementById('curl-binary-file');
                if (fileInput.files.length > 0) {
                    curlCommand.push('--data-binary', `'@${fileInput.files[0].name}'`);
                }
                break;
        }
    }

    addOptions(curlCommand) {
        if (document.getElementById('curl-follow-redirects').checked) {
            curlCommand.push('-L');
        }
        
        if (document.getElementById('curl-include-headers').checked) {
            curlCommand.push('-i');
        }
        
        if (document.getElementById('curl-insecure').checked) {
            curlCommand.push('-k');
        }
        
        if (document.getElementById('curl-verbose').checked) {
            curlCommand.push('-v');
        }
        
        if (document.getElementById('curl-compressed').checked) {
            curlCommand.push('--compressed');
        }
        
        const connectTimeout = document.getElementById('curl-connect-timeout').value;
        if (connectTimeout && connectTimeout !== '30') {
            curlCommand.push('--connect-timeout', connectTimeout);
        }
        
        const maxTime = document.getElementById('curl-max-time').value;
        if (maxTime && maxTime !== '300') {
            curlCommand.push('--max-time', maxTime);
        }
    }

    async copyCurl() {
        const curlCommandElement = document.getElementById('curl-command');
        const codeElement = curlCommandElement.querySelector('code');
        const command = codeElement ? codeElement.textContent : curlCommandElement.textContent;
        
        try {
            await navigator.clipboard.writeText(command);
            this.showNotification('Curl command copied to clipboard!', 'success');
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = command;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showNotification('Curl command copied to clipboard!', 'success');
        }
    }

    saveConfiguration() {
        const config = {
            method: document.getElementById('curl-method').value,
            url: document.getElementById('curl-url').value,
            headers: this.getKeyValuePairs('curl-headers'),
            params: this.getKeyValuePairs('curl-params'),
            bodyType: document.querySelector('input[name="body-type"]:checked').value,
            authType: document.querySelector('input[name="auth-type"]:checked').value,
            rawBody: document.getElementById('curl-raw-body').value,
            formData: this.getKeyValuePairs('curl-form-data'),
            urlEncoded: this.getKeyValuePairs('curl-urlencoded'),
            basicAuth: {
                username: document.getElementById('basic-username').value,
                password: document.getElementById('basic-password').value
            },
            bearerToken: document.getElementById('bearer-token').value,
            apiKey: {
                name: document.getElementById('api-key-name').value,
                value: document.getElementById('api-key-value').value,
                location: document.getElementById('api-key-location').value
            },
            options: {
                followRedirects: document.getElementById('curl-follow-redirects').checked,
                includeHeaders: document.getElementById('curl-include-headers').checked,
                insecure: document.getElementById('curl-insecure').checked,
                verbose: document.getElementById('curl-verbose').checked,
                compressed: document.getElementById('curl-compressed').checked,
                connectTimeout: document.getElementById('curl-connect-timeout').value,
                maxTime: document.getElementById('curl-max-time').value
            }
        };

        const dataStr = JSON.stringify(config, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'curl-request.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showNotification('Configuration saved!', 'success');
    }

    loadConfiguration() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const config = JSON.parse(e.target.result);
                    this.applyConfiguration(config);
                    this.showNotification('Configuration loaded!', 'success');
                } catch (error) {
                    this.showNotification('Error loading configuration file', 'error');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    applyConfiguration(config) {
        // Basic settings
        document.getElementById('curl-method').value = config.method || 'GET';
        document.getElementById('curl-url').value = config.url || '';
        
        // Clear existing key-value pairs
        this.clearKeyValuePairs('curl-headers');
        this.clearKeyValuePairs('curl-params');
        this.clearKeyValuePairs('curl-form-data');
        this.clearKeyValuePairs('curl-urlencoded');
        
        // Headers
        if (config.headers) {
            config.headers.forEach(header => {
                this.addKeyValuePair('curl-headers', header.key, header.value);
            });
        }
        
        // Parameters
        if (config.params) {
            config.params.forEach(param => {
                this.addKeyValuePair('curl-params', param.key, param.value);
            });
        }
        
        // Body type
        if (config.bodyType) {
            document.querySelector(`input[name="body-type"][value="${config.bodyType}"]`).checked = true;
            this.showBodyContent(config.bodyType);
        }
        
        // Body data
        document.getElementById('curl-raw-body').value = config.rawBody || '';
        
        if (config.formData) {
            config.formData.forEach(item => {
                this.addFormDataPair(item.key, item.value, item.type);
            });
        }
        
        if (config.urlEncoded) {
            config.urlEncoded.forEach(item => {
                this.addKeyValuePair('curl-urlencoded', item.key, item.value);
            });
        }
        
        // Auth type and data
        if (config.authType) {
            document.querySelector(`input[name="auth-type"][value="${config.authType}"]`).checked = true;
            this.showAuthContent(config.authType);
        }
        
        if (config.basicAuth) {
            document.getElementById('basic-username').value = config.basicAuth.username || '';
            document.getElementById('basic-password').value = config.basicAuth.password || '';
        }
        
        document.getElementById('bearer-token').value = config.bearerToken || '';
        
        if (config.apiKey) {
            document.getElementById('api-key-name').value = config.apiKey.name || '';
            document.getElementById('api-key-value').value = config.apiKey.value || '';
            document.getElementById('api-key-location').value = config.apiKey.location || 'header';
        }
        
        // Options
        if (config.options) {
            document.getElementById('curl-follow-redirects').checked = config.options.followRedirects || false;
            document.getElementById('curl-include-headers').checked = config.options.includeHeaders || false;
            document.getElementById('curl-insecure').checked = config.options.insecure || false;
            document.getElementById('curl-verbose').checked = config.options.verbose || false;
            document.getElementById('curl-compressed').checked = config.options.compressed || false;
            document.getElementById('curl-connect-timeout').value = config.options.connectTimeout || '30';
            document.getElementById('curl-max-time').value = config.options.maxTime || '300';
        }
        
        this.generateCurl();
    }

    clearKeyValuePairs(containerId) {
        const container = document.getElementById(containerId);
        // Keep the first pair, remove others
        const pairs = container.querySelectorAll('.key-value-pair');
        for (let i = 1; i < pairs.length; i++) {
            pairs[i].remove();
        }
        // Clear the first pair
        if (pairs[0]) {
            pairs[0].querySelector('.key-input').value = '';
            pairs[0].querySelector('.value-input').value = '';
        }
    }

    loadExample(exampleName) {
        const example = this.examples[exampleName];
        if (!example) return;
        
        this.applyConfiguration(example);
        this.showNotification(`${exampleName.replace('-', ' ')} example loaded!`, 'success');
    }

    async sendRequest() {
        const url = document.getElementById('curl-url').value.trim();
        if (!url) {
            this.showNotification('Please enter a URL', 'error');
            return;
        }

        const responseSection = document.querySelector('.curl-response-section');
        responseSection.style.display = 'block';

        try {
            const startTime = Date.now();
            
            // Build request options
            const options = {
                method: document.getElementById('curl-method').value,
                headers: {}
            };

            // Add headers
            const headers = this.getKeyValuePairs('curl-headers');
            headers.forEach(header => {
                if (header.key && header.value) {
                    options.headers[header.key] = header.value;
                }
            });

            // Add body
            const bodyType = document.querySelector('input[name="body-type"]:checked').value;
            if (bodyType === 'raw') {
                const rawBody = document.getElementById('curl-raw-body').value.trim();
                if (rawBody) {
                    options.body = rawBody;
                }
            }

            // Build final URL with query parameters
            let finalUrl = url.includes('://') ? url : `https://${url}`;
            const urlObj = new URL(finalUrl);
            
            const params = this.getKeyValuePairs('curl-params');
            params.forEach(param => {
                if (param.key && param.value) {
                    urlObj.searchParams.set(param.key, param.value);
                }
            });

            // Send request
            const response = await fetch(urlObj.toString(), options);
            const endTime = Date.now();
            
            // Update response info
            document.getElementById('response-status').textContent = `${response.status} ${response.statusText}`;
            document.getElementById('response-time').textContent = `${endTime - startTime}ms`;
            
            // Get response body
            const responseText = await response.text();
            let formattedBody = responseText;
            
            // Try to format JSON
            try {
                const jsonData = JSON.parse(responseText);
                formattedBody = JSON.stringify(jsonData, null, 2);
            } catch (e) {
                // Not JSON, use as is
            }
            
            document.getElementById('response-body').textContent = formattedBody;
            document.getElementById('response-size').textContent = `${new Blob([responseText]).size} bytes`;
            
            // Get response headers
            const responseHeaders = [];
            response.headers.forEach((value, key) => {
                responseHeaders.push(`${key}: ${value}`);
            });
            document.getElementById('response-headers').textContent = responseHeaders.join('\n');
            
        } catch (error) {
            document.getElementById('response-body').textContent = `Error: ${error.message}`;
            document.getElementById('response-status').textContent = 'Request Failed';
            document.getElementById('response-time').textContent = '';
            document.getElementById('response-size').textContent = '';
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: '10000',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize Curl Builder when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CurlBuilder();
});
