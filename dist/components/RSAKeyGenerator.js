// RSA Key Generator Component
class RSAKeyGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.generateRSAKeyPair();
    }

    initializeElements() {
        // Key size selection
        this.keySizeSelect = document.getElementById('rsa-key-size');
        
        // Key format selection
        this.keyFormatSelect = document.getElementById('rsa-key-format');
        
        // Generated keys display
        this.publicKeyOutput = document.getElementById('rsa-public-key');
        this.privateKeyOutput = document.getElementById('rsa-private-key');
        
        // Action buttons
        this.generateKeysBtn = document.getElementById('generate-rsa-keys-btn');
        this.copyPublicBtn = document.getElementById('copy-public-key-btn');
        this.copyPrivateBtn = document.getElementById('copy-private-key-btn');
        this.downloadKeysBtn = document.getElementById('download-keys-btn');
        
        // Key information
        this.keyInfoContainer = document.getElementById('rsa-key-info');
        
        // Key statistics
        this.keyStatsContainer = document.getElementById('rsa-key-stats');
        
        // Current key pair
        this.currentKeyPair = null;
    }

    bindEvents() {
        // Key size change
        this.keySizeSelect?.addEventListener('change', () => {
            this.updateKeyInfo();
            this.generateRSAKeyPair();
        });
        
        // Key format change
        this.keyFormatSelect?.addEventListener('change', () => {
            this.updateKeyDisplay();
        });
        
        // Generate keys button
        this.generateKeysBtn?.addEventListener('click', () => this.generateRSAKeyPair());
        
        // Copy buttons
        this.copyPublicBtn?.addEventListener('click', () => this.copyPublicKey());
        this.copyPrivateBtn?.addEventListener('click', () => this.copyPrivateKey());
        
        // Download button
        this.downloadKeysBtn?.addEventListener('click', () => this.downloadKeys());
        
        // Initialize UI
        this.updateKeyInfo();
    }

    updateKeyInfo() {
        const keySize = parseInt(this.keySizeSelect?.value || 2048);
        
        if (!this.keyInfoContainer) return;
        
        const securityLevel = this.getSecurityLevel(keySize);
        const estimatedTime = this.getGenerationTime(keySize);
        
        this.keyInfoContainer.innerHTML = `
            <div class="rsa-key-info-section">
                <h4>RSA ${keySize}-bit Key Pair</h4>
                <div class="key-info-grid">
                    <div class="key-info-item">
                        <label>Key Size:</label>
                        <span>${keySize} bits</span>
                    </div>
                    <div class="key-info-item">
                        <label>Security Level:</label>
                        <span>${securityLevel}</span>
                    </div>
                    <div class="key-info-item">
                        <label>Generation Time:</label>
                        <span>${estimatedTime}</span>
                    </div>
                    <div class="key-info-item">
                        <label>Use Case:</label>
                        <span>${this.getUseCase(keySize)}</span>
                    </div>
                </div>
                <div class="key-description">
                    <p><strong>Description:</strong> RSA is an asymmetric cryptographic algorithm used for secure data transmission and digital signatures.</p>
                    <p><strong>Security:</strong> ${this.getSecurityDescription(keySize)}</p>
                </div>
            </div>
        `;
    }

    getSecurityLevel(keySize) {
        if (keySize >= 4096) return 'Very High';
        if (keySize >= 2048) return 'High';
        if (keySize >= 1024) return 'Medium (Legacy)';
        return 'Low (Not Recommended)';
    }

    getGenerationTime(keySize) {
        if (keySize >= 4096) return '5-10 seconds';
        if (keySize >= 2048) return '1-3 seconds';
        if (keySize >= 1024) return '< 1 second';
        return '< 1 second';
    }

    getUseCase(keySize) {
        if (keySize >= 4096) return 'High security, long-term use';
        if (keySize >= 2048) return 'Standard security, recommended';
        if (keySize >= 1024) return 'Legacy systems only';
        return 'Testing only';
    }

    getSecurityDescription(keySize) {
        if (keySize >= 2048) {
            return 'Meets current security standards and is recommended for production use.';
        } else {
            return 'Below current security standards. Use only for testing or legacy compatibility.';
        }
    }

    async generateRSAKeyPair() {
        const keySize = parseInt(this.keySizeSelect?.value || 2048);
        
        try {
            this.showGenerating();
            
            if (window.crypto && window.crypto.subtle) {
                // Use Web Crypto API for real RSA key generation
                await this.generateRSAWithWebCrypto(keySize);
            } else {
                // Fallback to simulated key generation
                this.generateRSAFallback(keySize);
            }
            
            this.updateKeyDisplay();
            this.updateKeyStatistics();
            this.showSuccess('RSA key pair generated successfully!');
            
        } catch (error) {
            console.error('RSA key generation failed:', error);
            this.showError(`Key generation failed: ${error.message}`);
        } finally {
            this.hideGenerating();
        }
    }

    async generateRSAWithWebCrypto(keySize) {
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: keySize,
                publicExponent: new Uint8Array([1, 0, 1]), // 65537
                hash: "SHA-256"
            },
            true,
            ["encrypt", "decrypt"]
        );
        
        // Export keys
        const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
        const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
        
        this.currentKeyPair = {
            publicKey: {
                raw: publicKey,
                pem: this.arrayBufferToPem(publicKey, 'PUBLIC KEY'),
                der: this.arrayBufferToBase64(publicKey),
                hex: this.arrayBufferToHex(publicKey)
            },
            privateKey: {
                raw: privateKey,
                pem: this.arrayBufferToPem(privateKey, 'PRIVATE KEY'),
                der: this.arrayBufferToBase64(privateKey),
                hex: this.arrayBufferToHex(privateKey)
            },
            keySize: keySize,
            generated: new Date()
        };
    }

    generateRSAFallback(keySize) {
        // Simulated RSA key generation for demonstration
        // This is NOT cryptographically secure!
        
        const publicKeyData = this.generateRandomKey(keySize / 8);
        const privateKeyData = this.generateRandomKey(keySize / 4);
        
        this.currentKeyPair = {
            publicKey: {
                pem: this.createMockPEM(publicKeyData, 'PUBLIC KEY'),
                der: btoa(String.fromCharCode.apply(null, publicKeyData)),
                hex: Array.from(publicKeyData).map(b => b.toString(16).padStart(2, '0')).join('')
            },
            privateKey: {
                pem: this.createMockPEM(privateKeyData, 'PRIVATE KEY'),
                der: btoa(String.fromCharCode.apply(null, privateKeyData)),
                hex: Array.from(privateKeyData).map(b => b.toString(16).padStart(2, '0')).join('')
            },
            keySize: keySize,
            generated: new Date(),
            simulated: true
        };
    }

    generateRandomKey(length) {
        const key = new Uint8Array(length);
        if (window.crypto && window.crypto.getRandomValues) {
            window.crypto.getRandomValues(key);
        } else {
            for (let i = 0; i < length; i++) {
                key[i] = Math.floor(Math.random() * 256);
            }
        }
        return key;
    }

    createMockPEM(data, type) {
        const base64 = btoa(String.fromCharCode.apply(null, data));
        const chunks = base64.match(/.{1,64}/g) || [];
        return `-----BEGIN ${type}-----\n${chunks.join('\n')}\n-----END ${type}-----`;
    }

    arrayBufferToPem(buffer, type) {
        const base64 = this.arrayBufferToBase64(buffer);
        const chunks = base64.match(/.{1,64}/g) || [];
        return `-----BEGIN ${type}-----\n${chunks.join('\n')}\n-----END ${type}-----`;
    }

    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        return btoa(String.fromCharCode.apply(null, bytes));
    }

    arrayBufferToHex(buffer) {
        const bytes = new Uint8Array(buffer);
        return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    updateKeyDisplay() {
        if (!this.currentKeyPair) return;
        
        const format = this.keyFormatSelect?.value || 'pem';
        
        if (this.publicKeyOutput) {
            this.publicKeyOutput.textContent = this.currentKeyPair.publicKey[format] || 'Key not available';
        }
        
        if (this.privateKeyOutput) {
            this.privateKeyOutput.textContent = this.currentKeyPair.privateKey[format] || 'Key not available';
        }
        
        // Show warning for simulated keys
        if (this.currentKeyPair.simulated) {
            this.showWarning('Using simulated keys - Web Crypto API not available. These keys are for demonstration only and are not cryptographically secure.');
        }
    }

    updateKeyStatistics() {
        if (!this.currentKeyPair || !this.keyStatsContainer) return;
        
        const publicKeyLength = this.currentKeyPair.publicKey.pem?.length || 0;
        const privateKeyLength = this.currentKeyPair.privateKey.pem?.length || 0;
        
        this.keyStatsContainer.innerHTML = `
            <div class="rsa-key-stats-section">
                <h4>Key Pair Statistics</h4>
                <div class="stats-grid">
                    <div class="stat-item">
                        <label>Key Size:</label>
                        <span>${this.currentKeyPair.keySize} bits</span>
                    </div>
                    <div class="stat-item">
                        <label>Generated:</label>
                        <span>${this.currentKeyPair.generated.toLocaleString()}</span>
                    </div>
                    <div class="stat-item">
                        <label>Public Key Length:</label>
                        <span>${publicKeyLength} characters</span>
                    </div>
                    <div class="stat-item">
                        <label>Private Key Length:</label>
                        <span>${privateKeyLength} characters</span>
                    </div>
                    <div class="stat-item">
                        <label>Algorithm:</label>
                        <span>RSA-OAEP with SHA-256</span>
                    </div>
                    <div class="stat-item">
                        <label>Type:</label>
                        <span>${this.currentKeyPair.simulated ? 'Simulated (Demo)' : 'Cryptographically Secure'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    copyPublicKey() {
        if (!this.currentKeyPair) {
            this.showError('No key pair generated');
            return;
        }
        
        const format = this.keyFormatSelect?.value || 'pem';
        const publicKey = this.currentKeyPair.publicKey[format];
        
        if (!publicKey) {
            this.showError('Public key not available');
            return;
        }
        
        this.copyToClipboard(publicKey, 'Public key copied to clipboard!');
    }

    copyPrivateKey() {
        if (!this.currentKeyPair) {
            this.showError('No key pair generated');
            return;
        }
        
        const format = this.keyFormatSelect?.value || 'pem';
        const privateKey = this.currentKeyPair.privateKey[format];
        
        if (!privateKey) {
            this.showError('Private key not available');
            return;
        }
        
        this.copyToClipboard(privateKey, 'Private key copied to clipboard!');
    }

    downloadKeys() {
        if (!this.currentKeyPair) {
            this.showError('No key pair generated');
            return;
        }
        
        const format = this.keyFormatSelect?.value || 'pem';
        const extension = format === 'pem' ? 'pem' : 'txt';
        
        // Download public key
        this.downloadFile(
            this.currentKeyPair.publicKey[format],
            `rsa-public-${this.currentKeyPair.keySize}.${extension}`
        );
        
        // Download private key
        this.downloadFile(
            this.currentKeyPair.privateKey[format],
            `rsa-private-${this.currentKeyPair.keySize}.${extension}`
        );
        
        this.showSuccess('RSA key files downloaded successfully!');
    }

    downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    showGenerating() {
        if (this.generateKeysBtn) {
            this.generateKeysBtn.textContent = '⏳ Generating...';
            this.generateKeysBtn.disabled = true;
        }
    }

    hideGenerating() {
        if (this.generateKeysBtn) {
            this.generateKeysBtn.textContent = '🔑 Generate New Key Pair';
            this.generateKeysBtn.disabled = false;
        }
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
        let messageEl = document.getElementById('rsa-key-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'rsa-key-message';
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
            error: { background: '#ef4444', color: 'white' },
            warning: { background: '#f59e0b', color: 'white' }
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
        }, 5000);
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

// Initialize RSA Key Generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new RSAKeyGenerator();
    }, 100);
});
