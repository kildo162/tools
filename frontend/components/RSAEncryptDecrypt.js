// RSA Encrypt/Decrypt Component
class RSAEncryptDecrypt {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.currentKeys = null;
    }

    initializeElements() {
        // Tab elements
        this.encryptTab = document.getElementById('rsa-encrypt-tab');
        this.decryptTab = document.getElementById('rsa-decrypt-tab');
        this.encryptContent = document.getElementById('rsa-encrypt-content');
        this.decryptContent = document.getElementById('rsa-decrypt-content');
        
        // Key input elements
        this.publicKeyInput = document.getElementById('rsa-public-key-input');
        this.privateKeyInput = document.getElementById('rsa-private-key-input');
        
        // Data elements - Encryption
        this.plaintextInput = document.getElementById('rsa-plaintext-input');
        this.encryptedOutput = document.getElementById('rsa-encrypted-output');
        this.encryptBtn = document.getElementById('rsa-encrypt-btn');
        this.copyEncryptedBtn = document.getElementById('copy-encrypted-btn');
        
        // Data elements - Decryption
        this.ciphertextInput = document.getElementById('rsa-ciphertext-input');
        this.decryptedOutput = document.getElementById('rsa-decrypted-output');
        this.decryptBtn = document.getElementById('rsa-decrypt-btn');
        this.copyDecryptedBtn = document.getElementById('copy-decrypted-btn');
        
        // Options
        this.paddingSelect = document.getElementById('rsa-padding-scheme');
        this.encodingSelect = document.getElementById('rsa-encoding-format');
        
        // Generate keys shortcut
        this.generateKeysShortcut = document.getElementById('generate-keys-shortcut');
        
        // Key info display
        this.keyInfoDisplay = document.getElementById('rsa-crypto-key-info');
        
        // Clear buttons
        this.clearEncryptionBtn = document.getElementById('clear-encryption-btn');
        this.clearDecryptionBtn = document.getElementById('clear-decryption-btn');
    }

    bindEvents() {
        // Tab switching
        this.encryptTab?.addEventListener('click', () => this.showEncryptTab());
        this.decryptTab?.addEventListener('click', () => this.showDecryptTab());
        
        // Key input events
        this.publicKeyInput?.addEventListener('input', () => this.validatePublicKey());
        this.privateKeyInput?.addEventListener('input', () => this.validatePrivateKey());
        
        // Encryption events
        this.encryptBtn?.addEventListener('click', () => this.encryptMessage());
        this.copyEncryptedBtn?.addEventListener('click', () => this.copyEncrypted());
        this.clearEncryptionBtn?.addEventListener('click', () => this.clearEncryption());
        
        // Decryption events
        this.decryptBtn?.addEventListener('click', () => this.decryptMessage());
        this.copyDecryptedBtn?.addEventListener('click', () => this.copyDecrypted());
        this.clearDecryptionBtn?.addEventListener('click', () => this.clearDecryption());
        
        // Generate keys shortcut
        this.generateKeysShortcut?.addEventListener('click', () => this.generateKeysQuick());
        
        // Input validation
        this.plaintextInput?.addEventListener('input', () => this.validatePlaintext());
        this.ciphertextInput?.addEventListener('input', () => this.validateCiphertext());
        
        // Initialize
        this.showEncryptTab();
    }

    showEncryptTab() {
        if (this.encryptTab) this.encryptTab.classList.add('active');
        if (this.decryptTab) this.decryptTab.classList.remove('active');
        if (this.encryptContent) this.encryptContent.style.display = 'block';
        if (this.decryptContent) this.decryptContent.style.display = 'none';
    }

    showDecryptTab() {
        if (this.decryptTab) this.decryptTab.classList.add('active');
        if (this.encryptTab) this.encryptTab.classList.remove('active');
        if (this.decryptContent) this.decryptContent.style.display = 'block';
        if (this.encryptContent) this.encryptContent.style.display = 'none';
    }

    validatePublicKey() {
        const publicKey = this.publicKeyInput?.value.trim();
        if (!publicKey) return false;
        
        // Basic PEM format validation
        const isValidPEM = publicKey.includes('-----BEGIN PUBLIC KEY-----') && 
                          publicKey.includes('-----END PUBLIC KEY-----');
        
        if (isValidPEM) {
            this.showKeyValidation(this.publicKeyInput, true, 'Valid public key format');
            this.updateKeyInfo();
            return true;
        } else {
            this.showKeyValidation(this.publicKeyInput, false, 'Invalid public key format. Expected PEM format.');
            return false;
        }
    }

    validatePrivateKey() {
        const privateKey = this.privateKeyInput?.value.trim();
        if (!privateKey) return false;
        
        // Basic PEM format validation
        const isValidPEM = privateKey.includes('-----BEGIN PRIVATE KEY-----') && 
                          privateKey.includes('-----END PRIVATE KEY-----');
        
        if (isValidPEM) {
            this.showKeyValidation(this.privateKeyInput, true, 'Valid private key format');
            this.updateKeyInfo();
            return true;
        } else {
            this.showKeyValidation(this.privateKeyInput, false, 'Invalid private key format. Expected PEM format.');
            return false;
        }
    }

    showKeyValidation(input, isValid, message) {
        // Remove existing validation
        const existing = input?.parentNode.querySelector('.key-validation-message');
        if (existing) existing.remove();
        
        // Add new validation message
        const validationEl = document.createElement('div');
        validationEl.className = `key-validation-message ${isValid ? 'valid' : 'invalid'}`;
        validationEl.textContent = message;
        validationEl.style.cssText = `
            font-size: 12px;
            margin-top: 5px;
            padding: 4px 8px;
            border-radius: 3px;
            ${isValid ? 
                'color: #059669; background-color: #ecfdf5; border: 1px solid #a7f3d0;' : 
                'color: #dc2626; background-color: #fef2f2; border: 1px solid #fecaca;'
            }
        `;
        
        input?.parentNode.appendChild(validationEl);
        
        // Style the input
        if (input) {
            input.style.borderColor = isValid ? '#10b981' : '#ef4444';
        }
    }

    updateKeyInfo() {
        if (!this.keyInfoDisplay) return;
        
        const publicKey = this.publicKeyInput?.value.trim();
        const privateKey = this.privateKeyInput?.value.trim();
        
        const hasPublic = publicKey && this.validatePublicKey();
        const hasPrivate = privateKey && this.validatePrivateKey();
        
        let info = '<div class="key-info-section">';
        info += '<h4>Key Status</h4>';
        info += '<div class="key-status-grid">';
        
        info += `<div class="key-status-item">
            <label>Public Key:</label>
            <span class="${hasPublic ? 'status-valid' : 'status-missing'}">
                ${hasPublic ? '✓ Loaded' : '✗ Required for encryption'}
            </span>
        </div>`;
        
        info += `<div class="key-status-item">
            <label>Private Key:</label>
            <span class="${hasPrivate ? 'status-valid' : 'status-missing'}">
                ${hasPrivate ? '✓ Loaded' : '✗ Required for decryption'}
            </span>
        </div>`;
        
        info += `<div class="key-status-item">
            <label>Can Encrypt:</label>
            <span class="${hasPublic ? 'status-valid' : 'status-invalid'}">
                ${hasPublic ? '✓ Ready' : '✗ Need public key'}
            </span>
        </div>`;
        
        info += `<div class="key-status-item">
            <label>Can Decrypt:</label>
            <span class="${hasPrivate ? 'status-valid' : 'status-invalid'}">
                ${hasPrivate ? '✓ Ready' : '✗ Need private key'}
            </span>
        </div>`;
        
        info += '</div></div>';
        
        this.keyInfoDisplay.innerHTML = info;
    }

    validatePlaintext() {
        const plaintext = this.plaintextInput?.value.trim();
        if (!plaintext) return false;
        
        // RSA has message size limitations
        const maxBytes = 190; // Conservative estimate for 2048-bit key with OAEP padding
        const textBytes = new TextEncoder().encode(plaintext).length;
        
        if (textBytes > maxBytes) {
            this.showInputValidation(
                this.plaintextInput, 
                false, 
                `Message too long (${textBytes} bytes). RSA can encrypt max ~${maxBytes} bytes.`
            );
            return false;
        } else {
            this.showInputValidation(
                this.plaintextInput, 
                true, 
                `Message size: ${textBytes} bytes (within limits)`
            );
            return true;
        }
    }

    validateCiphertext() {
        const ciphertext = this.ciphertextInput?.value.trim();
        if (!ciphertext) return false;
        
        try {
            // Try to decode base64
            atob(ciphertext);
            this.showInputValidation(this.ciphertextInput, true, 'Valid base64 format');
            return true;
        } catch {
            this.showInputValidation(this.ciphertextInput, false, 'Invalid base64 format');
            return false;
        }
    }

    showInputValidation(input, isValid, message) {
        // Remove existing validation
        const existing = input?.parentNode.querySelector('.input-validation-message');
        if (existing) existing.remove();
        
        // Add new validation message
        const validationEl = document.createElement('div');
        validationEl.className = `input-validation-message ${isValid ? 'valid' : 'invalid'}`;
        validationEl.textContent = message;
        validationEl.style.cssText = `
            font-size: 11px;
            margin-top: 3px;
            padding: 2px 6px;
            border-radius: 3px;
            ${isValid ? 
                'color: #059669; background-color: #f0fdf4;' : 
                'color: #dc2626; background-color: #fef2f2;'
            }
        `;
        
        input?.parentNode.appendChild(validationEl);
    }

    async encryptMessage() {
        const publicKey = this.publicKeyInput?.value.trim();
        const plaintext = this.plaintextInput?.value.trim();
        
        if (!publicKey || !plaintext) {
            this.showError('Please provide both public key and message to encrypt');
            return;
        }
        
        if (!this.validatePublicKey() || !this.validatePlaintext()) {
            this.showError('Please fix validation errors before encrypting');
            return;
        }
        
        try {
            this.showEncrypting();
            
            let encrypted;
            if (window.crypto && window.crypto.subtle) {
                encrypted = await this.encryptWithWebCrypto(publicKey, plaintext);
            } else {
                encrypted = this.encryptFallback(plaintext);
            }
            
            if (this.encryptedOutput) {
                this.encryptedOutput.value = encrypted;
            }
            
            this.showSuccess('Message encrypted successfully!');
            
        } catch (error) {
            console.error('Encryption failed:', error);
            this.showError(`Encryption failed: ${error.message}`);
        } finally {
            this.hideEncrypting();
        }
    }

    async encryptWithWebCrypto(publicKeyPem, plaintext) {
        try {
            // Import the public key
            const publicKey = await this.importPublicKey(publicKeyPem);
            
            // Encrypt the message
            const encoder = new TextEncoder();
            const data = encoder.encode(plaintext);
            
            const padding = this.paddingSelect?.value || 'RSA-OAEP';
            const encrypted = await window.crypto.subtle.encrypt(
                {
                    name: padding,
                    hash: "SHA-256"
                },
                publicKey,
                data
            );
            
            // Encode result
            const encoding = this.encodingSelect?.value || 'base64';
            return this.encodeResult(encrypted, encoding);
            
        } catch (error) {
            throw new Error('Web Crypto encryption failed: ' + error.message);
        }
    }

    async importPublicKey(pemKey) {
        // Remove PEM header/footer and decode base64
        const pemContents = pemKey
            .replace(/-----BEGIN PUBLIC KEY-----/, '')
            .replace(/-----END PUBLIC KEY-----/, '')
            .replace(/\s/g, '');
        
        const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
        
        return await window.crypto.subtle.importKey(
            'spki',
            binaryDer,
            {
                name: 'RSA-OAEP',
                hash: 'SHA-256'
            },
            false,
            ['encrypt']
        );
    }

    encryptFallback(plaintext) {
        // Simulated encryption for demonstration
        const encoded = btoa(plaintext + '_encrypted_' + Date.now());
        this.showWarning('Using simulated encryption - Web Crypto API not available. This is for demonstration only and is not secure.');
        return encoded;
    }

    async decryptMessage() {
        const privateKey = this.privateKeyInput?.value.trim();
        const ciphertext = this.ciphertextInput?.value.trim();
        
        if (!privateKey || !ciphertext) {
            this.showError('Please provide both private key and encrypted message');
            return;
        }
        
        if (!this.validatePrivateKey() || !this.validateCiphertext()) {
            this.showError('Please fix validation errors before decrypting');
            return;
        }
        
        try {
            this.showDecrypting();
            
            let decrypted;
            if (window.crypto && window.crypto.subtle) {
                decrypted = await this.decryptWithWebCrypto(privateKey, ciphertext);
            } else {
                decrypted = this.decryptFallback(ciphertext);
            }
            
            if (this.decryptedOutput) {
                this.decryptedOutput.value = decrypted;
            }
            
            this.showSuccess('Message decrypted successfully!');
            
        } catch (error) {
            console.error('Decryption failed:', error);
            this.showError(`Decryption failed: ${error.message}`);
        } finally {
            this.hideDecrypting();
        }
    }

    async decryptWithWebCrypto(privateKeyPem, ciphertext) {
        try {
            // Import the private key
            const privateKey = await this.importPrivateKey(privateKeyPem);
            
            // Decode the ciphertext
            const encoding = this.encodingSelect?.value || 'base64';
            const encryptedData = this.decodeInput(ciphertext, encoding);
            
            // Decrypt the message
            const padding = this.paddingSelect?.value || 'RSA-OAEP';
            const decrypted = await window.crypto.subtle.decrypt(
                {
                    name: padding,
                    hash: "SHA-256"
                },
                privateKey,
                encryptedData
            );
            
            // Decode result
            const decoder = new TextDecoder();
            return decoder.decode(decrypted);
            
        } catch (error) {
            throw new Error('Web Crypto decryption failed: ' + error.message);
        }
    }

    async importPrivateKey(pemKey) {
        // Remove PEM header/footer and decode base64
        const pemContents = pemKey
            .replace(/-----BEGIN PRIVATE KEY-----/, '')
            .replace(/-----END PRIVATE KEY-----/, '')
            .replace(/\s/g, '');
        
        const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
        
        return await window.crypto.subtle.importKey(
            'pkcs8',
            binaryDer,
            {
                name: 'RSA-OAEP',
                hash: 'SHA-256'
            },
            false,
            ['decrypt']
        );
    }

    decryptFallback(ciphertext) {
        // Simulated decryption for demonstration
        try {
            const decoded = atob(ciphertext);
            const match = decoded.match(/^(.+)_encrypted_\d+$/);
            if (match) {
                this.showWarning('Using simulated decryption - Web Crypto API not available. This is for demonstration only.');
                return match[1];
            } else {
                throw new Error('Invalid simulated ciphertext format');
            }
        } catch (error) {
            throw new Error('Simulated decryption failed');
        }
    }

    encodeResult(buffer, encoding) {
        const bytes = new Uint8Array(buffer);
        
        switch (encoding) {
            case 'base64':
                return btoa(String.fromCharCode.apply(null, bytes));
            case 'hex':
                return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
            default:
                return btoa(String.fromCharCode.apply(null, bytes));
        }
    }

    decodeInput(input, encoding) {
        switch (encoding) {
            case 'base64':
                const binaryString = atob(input);
                return Uint8Array.from(binaryString, c => c.charCodeAt(0));
            case 'hex':
                const bytes = [];
                for (let i = 0; i < input.length; i += 2) {
                    bytes.push(parseInt(input.substr(i, 2), 16));
                }
                return new Uint8Array(bytes);
            default:
                const binStr = atob(input);
                return Uint8Array.from(binStr, c => c.charCodeAt(0));
        }
    }

    async generateKeysQuick() {
        this.showSuccess('Generating RSA key pair...');
        
        try {
            if (window.crypto && window.crypto.subtle) {
                const keyPair = await window.crypto.subtle.generateKey(
                    {
                        name: "RSA-OAEP",
                        modulusLength: 2048,
                        publicExponent: new Uint8Array([1, 0, 1]),
                        hash: "SHA-256"
                    },
                    true,
                    ["encrypt", "decrypt"]
                );
                
                const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
                const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
                
                const publicPem = this.arrayBufferToPem(publicKey, 'PUBLIC KEY');
                const privatePem = this.arrayBufferToPem(privateKey, 'PRIVATE KEY');
                
                if (this.publicKeyInput) this.publicKeyInput.value = publicPem;
                if (this.privateKeyInput) this.privateKeyInput.value = privatePem;
                
                this.validatePublicKey();
                this.validatePrivateKey();
                
                this.showSuccess('RSA key pair generated and loaded!');
                
            } else {
                this.showError('Web Crypto API not available. Please use the RSA Key Generator tool to generate keys.');
            }
            
        } catch (error) {
            console.error('Quick key generation failed:', error);
            this.showError('Failed to generate keys: ' + error.message);
        }
    }

    arrayBufferToPem(buffer, type) {
        const base64 = btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
        const chunks = base64.match(/.{1,64}/g) || [];
        return `-----BEGIN ${type}-----\n${chunks.join('\n')}\n-----END ${type}-----`;
    }

    copyEncrypted() {
        const encrypted = this.encryptedOutput?.value;
        if (!encrypted) {
            this.showError('No encrypted message to copy');
            return;
        }
        
        this.copyToClipboard(encrypted, 'Encrypted message copied to clipboard!');
    }

    copyDecrypted() {
        const decrypted = this.decryptedOutput?.value;
        if (!decrypted) {
            this.showError('No decrypted message to copy');
            return;
        }
        
        this.copyToClipboard(decrypted, 'Decrypted message copied to clipboard!');
    }

    clearEncryption() {
        if (this.plaintextInput) this.plaintextInput.value = '';
        if (this.encryptedOutput) this.encryptedOutput.value = '';
        this.clearValidationMessages();
    }

    clearDecryption() {
        if (this.ciphertextInput) this.ciphertextInput.value = '';
        if (this.decryptedOutput) this.decryptedOutput.value = '';
        this.clearValidationMessages();
    }

    clearValidationMessages() {
        document.querySelectorAll('.input-validation-message').forEach(el => el.remove());
    }

    showEncrypting() {
        if (this.encryptBtn) {
            this.encryptBtn.textContent = '⏳ Encrypting...';
            this.encryptBtn.disabled = true;
        }
    }

    hideEncrypting() {
        if (this.encryptBtn) {
            this.encryptBtn.textContent = '🔒 Encrypt Message';
            this.encryptBtn.disabled = false;
        }
    }

    showDecrypting() {
        if (this.decryptBtn) {
            this.decryptBtn.textContent = '⏳ Decrypting...';
            this.decryptBtn.disabled = true;
        }
    }

    hideDecrypting() {
        if (this.decryptBtn) {
            this.decryptBtn.textContent = '🔓 Decrypt Message';
            this.decryptBtn.disabled = false;
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
        let messageEl = document.getElementById('rsa-crypto-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'rsa-crypto-message';
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

// Initialize RSA Encrypt/Decrypt when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new RSAEncryptDecrypt();
    }, 100);
});
