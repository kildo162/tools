// URL Encoder/Decoder Component
class URLEncoderDecoder {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.loadExamples();
    }

    initializeElements() {
        // Main input/output elements
        this.urlInput = document.getElementById('url-input');
        this.urlOutput = document.getElementById('url-output');
        
        // Action buttons
        this.encodeBtn = document.getElementById('url-encode-btn');
        this.decodeBtn = document.getElementById('url-decode-btn');
        this.clearBtn = document.getElementById('url-clear-btn');
        this.copyBtn = document.getElementById('url-copy-btn');
        this.swapBtn = document.getElementById('url-swap-btn');
        
        // URL Components
        this.urlScheme = document.getElementById('url-scheme');
        this.urlHost = document.getElementById('url-host');
        this.urlPath = document.getElementById('url-path');
        this.urlQuery = document.getElementById('url-query');
        this.urlFragment = document.getElementById('url-fragment');
        this.buildUrlBtn = document.getElementById('build-url-btn');
        this.parseUrlBtn = document.getElementById('parse-url-btn');
        this.componentResult = document.getElementById('url-component-result');
        this.componentCopyBtn = document.getElementById('component-copy-btn');
        
        // Example buttons
        this.exampleQueryParams = document.getElementById('example-query-params');
        this.exampleSpecialChars = document.getElementById('example-special-chars');
        this.exampleUnicode = document.getElementById('example-unicode');
        this.exampleJsonParam = document.getElementById('example-json-param');
    }

    bindEvents() {
        // Main actions
        this.encodeBtn?.addEventListener('click', () => this.encodeURL());
        this.decodeBtn?.addEventListener('click', () => this.decodeURL());
        this.clearBtn?.addEventListener('click', () => this.clearAll());
        this.copyBtn?.addEventListener('click', () => this.copyOutput());
        this.swapBtn?.addEventListener('click', () => this.swapInputOutput());
        
        // URL Component actions
        this.buildUrlBtn?.addEventListener('click', () => this.buildURL());
        this.parseUrlBtn?.addEventListener('click', () => this.parseURL());
        this.componentCopyBtn?.addEventListener('click', () => this.copyComponentResult());
        
        // Example buttons
        this.exampleQueryParams?.addEventListener('click', () => this.loadExample('queryParams'));
        this.exampleSpecialChars?.addEventListener('click', () => this.loadExample('specialChars'));
        this.exampleUnicode?.addEventListener('click', () => this.loadExample('unicode'));
        this.exampleJsonParam?.addEventListener('click', () => this.loadExample('jsonParam'));
        
        // Auto-detect and suggest encode/decode
        this.urlInput?.addEventListener('input', () => this.autoDetectEncodingType());
    }

    encodeURL() {
        const input = this.urlInput?.value || '';
        if (!input.trim()) {
            this.showError('Please enter text to encode');
            return;
        }

        try {
            // Check if it's already encoded
            if (this.isAlreadyEncoded(input)) {
                this.showWarning('Text appears to be already URL encoded. Consider decoding first.');
            }
            
            const encoded = encodeURIComponent(input);
            this.urlOutput.value = encoded;
            this.showSuccess(`Text encoded successfully (${input.length} → ${encoded.length} chars)`);
        } catch (error) {
            this.showError(`Encoding failed: ${error.message}`);
        }
    }

    decodeURL() {
        const input = this.urlInput?.value || '';
        if (!input.trim()) {
            this.showError('Please enter text to decode');
            return;
        }

        try {
            // Check if it contains encoded characters
            if (!this.containsEncodedChars(input)) {
                this.showWarning('Text does not appear to be URL encoded');
            }
            
            const decoded = decodeURIComponent(input);
            this.urlOutput.value = decoded;
            this.showSuccess(`Text decoded successfully (${input.length} → ${decoded.length} chars)`);
        } catch (error) {
            this.showError(`Decoding failed: ${error.message}`);
        }
    }

    buildURL() {
        const scheme = this.urlScheme?.value || '';
        const host = this.urlHost?.value || '';
        const path = this.urlPath?.value || '';
        const query = this.urlQuery?.value || '';
        const fragment = this.urlFragment?.value || '';

        if (!host) {
            this.showError('Host is required to build URL');
            return;
        }

        let url = '';
        
        // Add scheme
        if (scheme) {
            url += scheme + '://';
        } else {
            url += 'https://';
        }
        
        // Add host
        url += host;
        
        // Add path
        if (path) {
            if (!path.startsWith('/')) {
                url += '/';
            }
            url += encodeURIComponent(path).replace(/%2F/g, '/');
        }
        
        // Add query
        if (query) {
            url += '?' + this.encodeQueryString(query);
        }
        
        // Add fragment
        if (fragment) {
            url += '#' + encodeURIComponent(fragment);
        }

        this.componentResult.value = url;
        this.showSuccess('URL built successfully');
    }

    parseURL() {
        const input = this.urlInput?.value || this.componentResult?.value || '';
        if (!input.trim()) {
            this.showError('Please enter a URL to parse');
            return;
        }

        try {
            const url = new URL(input);
            
            this.urlScheme.value = url.protocol.replace(':', '');
            this.urlHost.value = url.host;
            this.urlPath.value = decodeURIComponent(url.pathname);
            this.urlQuery.value = url.search.replace('?', '');
            this.urlFragment.value = decodeURIComponent(url.hash.replace('#', ''));
            
            this.componentResult.value = input;
            this.showSuccess('URL parsed successfully');
        } catch (error) {
            this.showError(`Invalid URL: ${error.message}`);
        }
    }

    encodeQueryString(query) {
        // Handle query string encoding more carefully
        const parts = query.split('&');
        return parts.map(part => {
            const [key, value] = part.split('=');
            if (value) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(value);
            }
            return encodeURIComponent(key);
        }).join('&');
    }

    isAlreadyEncoded(text) {
        // Simple check for URL encoded characters
        return /%[0-9A-Fa-f]{2}/.test(text);
    }

    containsEncodedChars(text) {
        return /%[0-9A-Fa-f]{2}/.test(text);
    }

    autoDetectEncodingType() {
        const input = this.urlInput?.value || '';
        if (!input.trim()) return;

        const encodedCharsCount = (input.match(/%[0-9A-Fa-f]{2}/g) || []).length;
        const totalChars = input.length;
        const encodedRatio = encodedCharsCount / totalChars;

        // Update button suggestions
        if (encodedRatio > 0.1) {
            this.updateButtonHint(this.decodeBtn, '🔓 Decode (Recommended)');
            this.updateButtonHint(this.encodeBtn, '🔒 Encode');
        } else {
            this.updateButtonHint(this.encodeBtn, '🔒 Encode (Recommended)');
            this.updateButtonHint(this.decodeBtn, '🔓 Decode');
        }
    }

    updateButtonHint(button, text) {
        if (button) {
            button.textContent = text;
            setTimeout(() => {
                button.textContent = text.replace(' (Recommended)', '');
            }, 3000);
        }
    }

    swapInputOutput() {
        const inputValue = this.urlInput?.value || '';
        const outputValue = this.urlOutput?.value || '';
        
        if (this.urlInput) this.urlInput.value = outputValue;
        if (this.urlOutput) this.urlOutput.value = inputValue;
        
        this.showSuccess('Input and output swapped');
    }

    copyOutput() {
        const content = this.urlOutput?.value || '';
        if (!content) {
            this.showError('Nothing to copy');
            return;
        }
        
        this.copyToClipboard(content, 'Output copied to clipboard');
    }

    copyComponentResult() {
        const content = this.componentResult?.value || '';
        if (!content) {
            this.showError('Nothing to copy');
            return;
        }
        
        this.copyToClipboard(content, 'URL copied to clipboard');
    }

    copyToClipboard(text, successMessage) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                this.showSuccess(successMessage);
            }).catch(() => {
                this.fallbackCopy(text, successMessage);
            });
        } else {
            this.fallbackCopy(text, successMessage);
        }
    }

    fallbackCopy(text, successMessage) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showSuccess(successMessage);
        } catch (err) {
            this.showError('Failed to copy to clipboard');
        } finally {
            document.body.removeChild(textArea);
        }
    }

    loadExample(type) {
        let example = '';
        
        switch (type) {
            case 'queryParams':
                example = 'name=John Doe&email=john.doe@example.com&age=25&city=New York';
                break;
            case 'specialChars':
                example = 'Hello World! How are you? 100% awesome & ready to go #awesome';
                break;
            case 'unicode':
                example = 'Xin chào! 你好! こんにちは! Здравствуйте! 🚀✨🎉';
                break;
            case 'jsonParam':
                example = 'data={"name":"John","items":["apple","banana"],"settings":{"theme":"dark"}}';
                break;
            default:
                example = 'Hello World!';
        }
        
        if (this.urlInput) {
            this.urlInput.value = example;
            this.urlInput.focus();
        }
        
        this.showSuccess(`Example "${type}" loaded`);
    }

    loadExamples() {
        // Set default example
        setTimeout(() => {
            if (!this.urlInput?.value) {
                this.loadExample('queryParams');
            }
        }, 500);
    }

    clearAll() {
        if (this.urlInput) this.urlInput.value = '';
        if (this.urlOutput) this.urlOutput.value = '';
        if (this.urlScheme) this.urlScheme.value = '';
        if (this.urlHost) this.urlHost.value = '';
        if (this.urlPath) this.urlPath.value = '';
        if (this.urlQuery) this.urlQuery.value = '';
        if (this.urlFragment) this.urlFragment.value = '';
        if (this.componentResult) this.componentResult.value = '';
        
        this.clearMessages();
        this.showSuccess('All fields cleared');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showWarning(message) {
        this.showMessage(message, 'warning');
    }

    showMessage(message, type) {
        // Create or update message element
        let messageEl = document.getElementById('url-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'url-message';
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                z-index: 1000;
                max-width: 400px;
                word-wrap: break-word;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(messageEl);
        }

        // Set message and style based on type
        messageEl.textContent = message;
        messageEl.className = `url-message-${type}`;
        
        const styles = {
            success: { background: '#10b981', color: 'white' },
            error: { background: '#ef4444', color: 'white' },
            warning: { background: '#f59e0b', color: 'white' }
        };
        
        Object.assign(messageEl.style, styles[type]);
        messageEl.style.display = 'block';
        messageEl.style.opacity = '1';

        // Auto-hide after 3 seconds
        setTimeout(() => {
            if (messageEl) {
                messageEl.style.opacity = '0';
                setTimeout(() => {
                    if (messageEl && messageEl.parentNode) {
                        messageEl.parentNode.removeChild(messageEl);
                    }
                }, 300);
            }
        }, 3000);
    }

    clearMessages() {
        const messageEl = document.getElementById('url-message');
        if (messageEl && messageEl.parentNode) {
            messageEl.parentNode.removeChild(messageEl);
        }
    }
}

// Initialize URL Encoder/Decoder when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new URLEncoderDecoder();
    }, 100);
});
