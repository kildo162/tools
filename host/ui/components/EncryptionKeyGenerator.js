// Encryption Key Generator Component
class EncryptionKeyGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.generateKey();
    }

    initializeElements() {
        // Key type and size
        this.keyTypeSelect = document.getElementById('encryption-key-type');
        this.keySizeSelect = document.getElementById('encryption-key-size');
        this.keyFormatSelect = document.getElementById('encryption-key-format');
        
        // Generated key display
        this.generatedKeyOutput = document.getElementById('generated-encryption-key');
        
        // Action buttons
        this.generateKeyBtn = document.getElementById('generate-encryption-key-btn');
        this.copyKeyBtn = document.getElementById('copy-encryption-key-btn');
        
        // Key information
        this.keyInfoContainer = document.getElementById('encryption-key-info');
        
        // Batch generator
        this.batchCountInput = document.getElementById('batch-key-count');
        this.generateBatchKeysBtn = document.getElementById('generate-batch-keys-btn');
        this.batchKeysOutput = document.getElementById('batch-keys-output');
        
        // Key types and their properties
        this.keyTypes = {
            'aes': {
                name: 'AES',
                description: 'Advanced Encryption Standard - Symmetric block cipher',
                sizes: [128, 192, 256],
                usage: 'Symmetric encryption, widely adopted standard'
            },
            'chacha20': {
                name: 'ChaCha20',
                description: 'ChaCha20 stream cipher by Daniel Bernstein',
                sizes: [256],
                usage: 'High-speed symmetric encryption, mobile-friendly'
            },
            'des': {
                name: 'DES',
                description: 'Data Encryption Standard (Legacy)',
                sizes: [64],
                usage: 'Legacy algorithm, not recommended for new applications'
            },
            '3des': {
                name: '3DES',
                description: 'Triple Data Encryption Standard',
                sizes: [192],
                usage: 'Stronger than DES but slower than AES'
            },
            'twofish': {
                name: 'Twofish',
                description: 'Symmetric key block cipher, AES finalist',
                sizes: [128, 192, 256],
                usage: 'Alternative to AES, good for embedded systems'
            },
            'blowfish': {
                name: 'Blowfish',
                description: 'Variable-length key block cipher',
                sizes: [128, 192, 256, 448],
                usage: 'Fast encryption, good for applications with infrequent key changes'
            }
        };
    }

    bindEvents() {
        // Key type change
        this.keyTypeSelect?.addEventListener('change', () => {
            this.updateKeySizeOptions();
            this.updateKeyInfo();
            this.generateKey();
        });
        
        // Key size change  
        this.keySizeSelect?.addEventListener('change', () => {
            this.updateKeyInfo();
            this.generateKey();
        });
        
        // Key format change
        this.keyFormatSelect?.addEventListener('change', () => this.generateKey());
        
        // Generate key button
        this.generateKeyBtn?.addEventListener('click', () => this.generateKey());
        
        // Copy key button
        this.copyKeyBtn?.addEventListener('click', () => this.copyGeneratedKey());
        
        // Batch generation
        this.generateBatchKeysBtn?.addEventListener('click', () => this.generateBatchKeys());
        
        // Initialize UI
        this.updateKeySizeOptions();
        this.updateKeyInfo();
    }

    updateKeySizeOptions() {
        const keyType = this.keyTypeSelect?.value || 'aes';
        const keyInfo = this.keyTypes[keyType];
        
        if (!keyInfo || !this.keySizeSelect) return;
        
        // Clear existing options
        this.keySizeSelect.innerHTML = '';
        
        // Add size options
        keyInfo.sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = `${size} bits`;
            this.keySizeSelect.appendChild(option);
        });
        
        // Select the largest size by default
        this.keySizeSelect.value = keyInfo.sizes[keyInfo.sizes.length - 1];
    }

    updateKeyInfo() {
        const keyType = this.keyTypeSelect?.value || 'aes';
        const keySize = parseInt(this.keySizeSelect?.value || '256');
        const keyInfo = this.keyTypes[keyType];
        
        if (!keyInfo || !this.keyInfoContainer) return;
        
        const bytesLength = keySize / 8;
        const hexLength = bytesLength * 2;
        
        this.keyInfoContainer.innerHTML = `
            <div class="key-info-section">
                <h4>${keyInfo.name} Key Information</h4>
                <div class="key-info-grid">
                    <div class="key-info-item">
                        <label>Algorithm:</label>
                        <span>${keyInfo.name}</span>
                    </div>
                    <div class="key-info-item">
                        <label>Key Size:</label>
                        <span>${keySize} bits (${bytesLength} bytes)</span>
                    </div>
                    <div class="key-info-item">
                        <label>Hex Length:</label>
                        <span>${hexLength} characters</span>
                    </div>
                    <div class="key-info-item">
                        <label>Security Level:</label>
                        <span>${this.getSecurityLevel(keySize)}</span>
                    </div>
                </div>
                <div class="key-description">
                    <p><strong>Description:</strong> ${keyInfo.description}</p>
                    <p><strong>Usage:</strong> ${keyInfo.usage}</p>
                </div>
            </div>
        `;
    }

    getSecurityLevel(keySize) {
        if (keySize >= 256) return 'Very High';
        if (keySize >= 192) return 'High';
        if (keySize >= 128) return 'Medium';
        if (keySize >= 64) return 'Low';
        return 'Very Low';
    }

    generateKey() {
        const keyType = this.keyTypeSelect?.value || 'aes';
        const keySize = parseInt(this.keySizeSelect?.value || '256');
        const format = this.keyFormatSelect?.value || 'hex';
        
        const bytesLength = keySize / 8;
        
        // Generate cryptographically secure random bytes
        const keyBytes = new Uint8Array(bytesLength);
        if (window.crypto && window.crypto.getRandomValues) {
            window.crypto.getRandomValues(keyBytes);
        } else {
            // Fallback to less secure random
            for (let i = 0; i < keyBytes.length; i++) {
                keyBytes[i] = Math.floor(Math.random() * 256);
            }
            console.warn('Using less secure random number generation');
        }

        let keyString = '';
        
        switch (format) {
            case 'hex':
                keyString = Array.from(keyBytes)
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('');
                break;
            
            case 'base64':
                keyString = btoa(String.fromCharCode.apply(null, keyBytes));
                break;
            
            case 'base64url':
                keyString = btoa(String.fromCharCode.apply(null, keyBytes))
                    .replace(/\+/g, '-')
                    .replace(/\//g, '_')
                    .replace(/=/g, '');
                break;
            
            case 'binary':
                keyString = Array.from(keyBytes)
                    .map(b => b.toString(2).padStart(8, '0'))
                    .join(' ');
                break;
            
            default:
                keyString = Array.from(keyBytes)
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('');
        }

        if (this.generatedKeyOutput) {
            this.generatedKeyOutput.textContent = keyString;
        }
        
        this.updateKeyStats(keyBytes, keyString, format);
    }

    updateKeyStats(keyBytes, keyString, format) {
        const statsContainer = document.getElementById('key-stats');
        if (!statsContainer) return;
        
        // Calculate entropy (simplified)
        const uniqueBytes = new Set(keyBytes).size;
        const entropy = (uniqueBytes / 256 * 100).toFixed(1);
        
        statsContainer.innerHTML = `
            <div class="key-stats-section">
                <h4>Key Statistics</h4>
                <div class="stats-grid">
                    <div class="stat-item">
                        <label>Format:</label>
                        <span>${format.toUpperCase()}</span>
                    </div>
                    <div class="stat-item">
                        <label>Length:</label>
                        <span>${keyString.length} characters</span>
                    </div>
                    <div class="stat-item">
                        <label>Bytes:</label>
                        <span>${keyBytes.length} bytes</span>
                    </div>
                    <div class="stat-item">
                        <label>Unique Bytes:</label>
                        <span>${uniqueBytes}/256 (${entropy}%)</span>
                    </div>
                </div>
            </div>
        `;
    }

    copyGeneratedKey() {
        const key = this.generatedKeyOutput?.textContent || '';
        if (!key) {
            this.showError('No key to copy');
            return;
        }
        
        this.copyToClipboard(key, 'Encryption key copied to clipboard!');
    }

    generateBatchKeys() {
        const count = parseInt(this.batchCountInput?.value || 5);
        if (count < 1 || count > 20) {
            this.showError('Please enter a number between 1 and 20');
            return;
        }
        
        const keyType = this.keyTypeSelect?.value || 'aes';
        const keySize = parseInt(this.keySizeSelect?.value || '256');
        const format = this.keyFormatSelect?.value || 'hex';
        
        const keys = [];
        
        for (let i = 0; i < count; i++) {
            const bytesLength = keySize / 8;
            const keyBytes = new Uint8Array(bytesLength);
            
            if (window.crypto && window.crypto.getRandomValues) {
                window.crypto.getRandomValues(keyBytes);
            } else {
                for (let j = 0; j < keyBytes.length; j++) {
                    keyBytes[j] = Math.floor(Math.random() * 256);
                }
            }
            
            let keyString = '';
            switch (format) {
                case 'hex':
                    keyString = Array.from(keyBytes)
                        .map(b => b.toString(16).padStart(2, '0'))
                        .join('');
                    break;
                case 'base64':
                    keyString = btoa(String.fromCharCode.apply(null, keyBytes));
                    break;
                case 'base64url':
                    keyString = btoa(String.fromCharCode.apply(null, keyBytes))
                        .replace(/\+/g, '-')
                        .replace(/\//g, '_')
                        .replace(/=/g, '');
                    break;
                case 'binary':
                    keyString = Array.from(keyBytes)
                        .map(b => b.toString(2).padStart(8, '0'))
                        .join(' ');
                    break;
            }
            
            keys.push(keyString);
        }
        
        if (this.batchKeysOutput) {
            this.batchKeysOutput.innerHTML = keys.map((key, index) => `
                <div class="batch-key-item">
                    <div class="batch-key-header">
                        <span class="batch-key-number">${index + 1}.</span>
                        <span class="batch-key-type">${this.keyTypes[keyType].name} ${keySize}-bit</span>
                        <button class="btn-small copy-batch-key-btn" onclick="window.copyToClipboardFallback('${key}')">Copy</button>
                    </div>
                    <code class="batch-key-value">${key}</code>
                </div>
            `).join('');
        }
        
        this.showSuccess(`Generated ${count} encryption keys successfully`);
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        let messageEl = document.getElementById('key-gen-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'key-gen-message';
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

// Initialize Encryption Key Generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new EncryptionKeyGenerator();
    }, 100);
});
