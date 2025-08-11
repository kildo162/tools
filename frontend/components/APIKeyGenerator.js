// API Key Generator Component
class APIKeyGenerator {
    constructor() {
        this.initializeElements();        // Batch generator
        this.generateBatchAPIKeysBtn?.addEventListener('click', () => this.generateBatchAPIKeys());
        this.copyAllAPIKeysBtn?.addEventListener('click', () => this.copyAllAPIKeys());       this.bindEvents();
        this.generateAPIKey();
    }

    initializeElements() {
        // API Key format and options
        this.formatSelect = document.getElementById('api-key-format');
        this.lengthSlider = document.getElementById('api-key-length');
        this.lengthDisplay = document.getElementById('api-key-length-display');
        
        // Prefix and suffix
        this.prefixInput = document.getElementById('api-key-prefix');
        this.suffixInput = document.getElementById('api-key-suffix');
        
        // Generated API key display
        this.generatedAPIKeyOutput = document.getElementById('generated-api-key');
        
        // Action buttons
        this.generateAPIKeyBtn = document.getElementById('generate-api-key-btn');
        this.copyAPIKeyBtn = document.getElementById('copy-api-key-btn');
        
        // API key information
        this.apiKeyInfoContainer = document.getElementById('api-key-info');
        
        // Batch generator
        this.batchCountInput = document.getElementById('batch-api-key-count');
        this.generateBatchAPIKeysBtn = document.getElementById('generate-batch-api-keys-btn');
        this.copyAllAPIKeysBtn = document.getElementById('copy-all-api-keys-btn');
        this.batchAPIKeysOutput = document.getElementById('batch-api-keys-output');
        
        // Character sets for different formats
        this.charSets = {
            'uuid': null, // Special handling
            'alphanumeric': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            'hex': '0123456789abcdef',
            'base64': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
            'base64url': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
            'numeric': '0123456789'
        };
        
        // Format descriptions
        this.formatInfo = {
            'uuid': {
                name: 'UUID v4',
                description: 'Universally Unique Identifier format',
                example: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx',
                fixedLength: true
            },
            'alphanumeric': {
                name: 'Alphanumeric',
                description: 'Letters and numbers (A-Z, a-z, 0-9)',
                example: 'Kj8mN2pQ9rT4xW7zB3cV6nM',
                fixedLength: false
            },
            'hex': {
                name: 'Hexadecimal',
                description: 'Hexadecimal characters (0-9, a-f)',
                example: 'a1b2c3d4e5f67890abcdef12',
                fixedLength: false
            },
            'base64': {
                name: 'Base64',
                description: 'Base64 characters (A-Z, a-z, 0-9, +, /)',
                example: 'Kj8mN2pQ9rT4xW7z+3cV6n==',
                fixedLength: false
            },
            'base64url': {
                name: 'Base64 URL-safe',
                description: 'URL-safe Base64 (A-Z, a-z, 0-9, -, _)',
                example: 'Kj8mN2pQ9rT4xW7z-3cV6n',
                fixedLength: false
            },
            'numeric': {
                name: 'Numeric',
                description: 'Numbers only (0-9)',
                example: '123456789012345678901234',
                fixedLength: false
            }
        };
    }

    bindEvents() {
        // Format change
        this.formatSelect?.addEventListener('change', () => {
            this.updateFormatInfo();
            this.updateLengthSliderState();
            this.generateAPIKey();
        });
        
        // Length slider
        this.lengthSlider?.addEventListener('input', () => {
            this.updateLengthDisplay();
            this.generateAPIKey();
        });
        
        // Prefix and suffix changes
        this.prefixInput?.addEventListener('input', () => this.generateAPIKey());
        this.suffixInput?.addEventListener('input', () => this.generateAPIKey());
        
        // Generate button
        this.generateAPIKeyBtn?.addEventListener('click', () => this.generateAPIKey());
        
        // Copy button
        this.copyAPIKeyBtn?.addEventListener('click', () => this.copyGeneratedAPIKey());
        
        // Batch generation
        this.generateBatchAPIKeysBtn?.addEventListener('click', () => this.generateBatchAPIKeys());
        
        // Initialize UI
        this.updateFormatInfo();
        this.updateLengthDisplay();
        this.updateLengthSliderState();
    }

    updateFormatInfo() {
        const format = this.formatSelect?.value || 'uuid';
        const info = this.formatInfo[format];
        
        if (!info || !this.apiKeyInfoContainer) return;
        
        this.apiKeyInfoContainer.innerHTML = `
            <div class="api-key-info-section">
                <h4>${info.name} Format</h4>
                <div class="format-description">
                    <p><strong>Description:</strong> ${info.description}</p>
                    <p><strong>Example:</strong> <code>${info.example}</code></p>
                    ${info.fixedLength ? '<p><strong>Note:</strong> Fixed length format</p>' : ''}
                </div>
            </div>
        `;
    }

    updateLengthDisplay() {
        const length = this.lengthSlider?.value || 32;
        if (this.lengthDisplay) {
            this.lengthDisplay.textContent = length;
        }
    }

    updateLengthSliderState() {
        const format = this.formatSelect?.value || 'uuid';
        const isFixedLength = this.formatInfo[format]?.fixedLength;
        
        if (this.lengthSlider) {
            this.lengthSlider.disabled = isFixedLength;
            this.lengthSlider.style.opacity = isFixedLength ? '0.5' : '1';
        }
    }

    generateUUID() {
        // Generate UUID v4
        if (window.crypto && window.crypto.getRandomValues) {
            const bytes = new Uint8Array(16);
            window.crypto.getRandomValues(bytes);
            
            // Set version (4) and variant bits
            bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
            bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10
            
            const hex = Array.from(bytes)
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
            
            return `${hex.substr(0, 8)}-${hex.substr(8, 4)}-${hex.substr(12, 4)}-${hex.substr(16, 4)}-${hex.substr(20, 12)}`;
        } else {
            // Fallback UUID generation
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    }

    generateSecureRandom(max) {
        if (window.crypto && window.crypto.getRandomValues) {
            const array = new Uint32Array(1);
            window.crypto.getRandomValues(array);
            return array[0] % max;
        } else {
            return Math.floor(Math.random() * max);
        }
    }

    generateAPIKey() {
        const format = this.formatSelect?.value || 'uuid';
        const length = parseInt(this.lengthSlider?.value || 32);
        const prefix = this.prefixInput?.value || '';
        const suffix = this.suffixInput?.value || '';
        
        let apiKey = '';
        
        if (format === 'uuid') {
            apiKey = this.generateUUID();
        } else {
            const charset = this.charSets[format];
            if (!charset) {
                this.showError('Invalid format selected');
                return;
            }
            
            for (let i = 0; i < length; i++) {
                apiKey += charset[this.generateSecureRandom(charset.length)];
            }
        }
        
        // Add prefix and suffix
        const finalKey = `${prefix}${apiKey}${suffix}`;
        
        if (this.generatedAPIKeyOutput) {
            this.generatedAPIKeyOutput.textContent = finalKey;
        }
        
        this.updateAPIKeyStats(finalKey, format);
    }

    updateAPIKeyStats(apiKey, format) {
        const statsContainer = document.getElementById('api-key-stats');
        if (!statsContainer) return;
        
        // Calculate entropy estimate
        const charset = this.charSets[format];
        let entropyBits = 0;
        
        if (format === 'uuid') {
            entropyBits = 122; // UUID v4 has 122 bits of entropy
        } else if (charset) {
            const keyLength = apiKey.length - (this.prefixInput?.value?.length || 0) - (this.suffixInput?.value?.length || 0);
            entropyBits = Math.log2(charset.length) * keyLength;
        }
        
        const collisionProbability = entropyBits > 0 ? `1 in 2^${Math.floor(entropyBits)}` : 'Unknown';
        
        statsContainer.innerHTML = `
            <div class="api-key-stats-section">
                <h4>Key Statistics</h4>
                <div class="stats-grid">
                    <div class="stat-item">
                        <label>Format:</label>
                        <span>${this.formatInfo[format]?.name || format}</span>
                    </div>
                    <div class="stat-item">
                        <label>Total Length:</label>
                        <span>${apiKey.length} characters</span>
                    </div>
                    <div class="stat-item">
                        <label>Entropy:</label>
                        <span>${Math.floor(entropyBits)} bits</span>
                    </div>
                    <div class="stat-item">
                        <label>Collision Probability:</label>
                        <span>${collisionProbability}</span>
                    </div>
                </div>
            </div>
        `;
    }

    copyGeneratedAPIKey() {
        const apiKey = this.generatedAPIKeyOutput?.textContent || '';
        if (!apiKey) {
            this.showError('No API key to copy');
            return;
        }
        
        this.copyToClipboard(apiKey, 'API key copied to clipboard!');
    }

    generateBatchAPIKeys() {
        const count = parseInt(this.batchCountInput?.value || 5);
        if (count < 1 || count > 50) {
            this.showError('Please enter a number between 1 and 50');
            return;
        }
        
        const format = this.formatSelect?.value || 'uuid';
        const length = parseInt(this.lengthSlider?.value || 32);
        const prefix = this.prefixInput?.value || '';
        const suffix = this.suffixInput?.value || '';
        
        const apiKeys = [];
        
        for (let i = 0; i < count; i++) {
            let apiKey = '';
            
            if (format === 'uuid') {
                apiKey = this.generateUUID();
            } else {
                const charset = this.charSets[format];
                if (charset) {
                    for (let j = 0; j < length; j++) {
                        apiKey += charset[this.generateSecureRandom(charset.length)];
                    }
                }
            }
            
            const finalKey = `${prefix}${apiKey}${suffix}`;
            apiKeys.push(finalKey);
        }
        
        // Store API keys for copying
        this.batchAPIKeys = apiKeys;
        
        if (this.batchAPIKeysOutput) {
            this.batchAPIKeysOutput.innerHTML = apiKeys.map((key, index) => `
                <div class="batch-api-key-item">
                    <div class="batch-api-key-header">
                        <span class="batch-api-key-number">${index + 1}.</span>
                        <span class="batch-api-key-format">${this.formatInfo[format]?.name || format}</span>
                        <button class="btn-small copy-batch-api-key-btn" onclick="window.copyToClipboardFallback('${key}')">Copy</button>
                    </div>
                    <code class="batch-api-key-value">${key}</code>
                </div>
            `).join('');
        }
        
        this.showSuccess(`Generated ${count} API keys successfully!`);
    }

    copyAllAPIKeys() {
        if (!this.batchAPIKeys || this.batchAPIKeys.length === 0) {
            this.showError('No API keys to copy. Please generate API keys first.');
            return;
        }
        
        const allAPIKeys = this.batchAPIKeys.join('\n');
        this.copyToClipboard(allAPIKeys, `Copied all ${this.batchAPIKeys.length} API keys to clipboard!`);
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        let messageEl = document.getElementById('api-key-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'api-key-message';
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

        const styles = {
            success: { background: '#10b981', color: 'white' },
            error: { background: '#ef4444', color: 'white' }
        };

        messageEl.textContent = message;
        Object.assign(messageEl.style, styles[type]);
        messageEl.style.display = 'block';
        messageEl.style.opacity = '1';

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

    copyToClipboard(text, successMessage = 'Copied to clipboard!') {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                this.showSuccess(successMessage);
            }).catch(err => {
                console.error('Failed to copy with clipboard API:', err);
                this.fallbackCopyToClipboard(text, successMessage);
            });
        } else {
            this.fallbackCopyToClipboard(text, successMessage);
        }
    }

    fallbackCopyToClipboard(text, successMessage) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.showSuccess(successMessage);
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
        } finally {
            document.body.removeChild(textArea);
        }
    }
}

// Initialize API Key Generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new APIKeyGenerator();
    }, 100);
});
