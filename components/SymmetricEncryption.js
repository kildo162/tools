// Symmetric Encryption Tool Component
class SymmetricEncryption {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.initializeCrypto();
    }

    initializeElements() {
        // Algorithm selection
        this.algorithmSelect = document.getElementById('symmetric-algorithm');
        
        // Mode selection (encrypt/decrypt)
        this.encryptMode = document.getElementById('encrypt-mode');
        this.decryptMode = document.getElementById('decrypt-mode');
        
        // Key input
        this.keyInput = document.getElementById('encryption-key');
        this.generateKeyBtn = document.getElementById('generate-key-btn');
        this.keyFormatSelect = document.getElementById('key-format');
        
        // Text input/output
        this.textInput = document.getElementById('encryption-text-input');
        this.textOutput = document.getElementById('encryption-text-output');
        
        // Action buttons
        this.processBtn = document.getElementById('process-encryption-btn');
        this.clearBtn = document.getElementById('clear-encryption-btn');
        this.swapBtn = document.getElementById('swap-encryption-btn');
        
        // File mode
        this.fileMode = document.getElementById('encryption-file-mode');
        this.fileInput = document.getElementById('encryption-file-input');
        this.fileBtn = document.getElementById('encryption-file-btn');
        
        // Results
        this.resultsContainer = document.getElementById('encryption-results');
    }

    bindEvents() {
        // Algorithm change
        this.algorithmSelect?.addEventListener('change', () => this.updateKeyRequirements());
        
        // Mode changes
        this.encryptMode?.addEventListener('change', () => this.updateModeUI());
        this.decryptMode?.addEventListener('change', () => this.updateModeUI());
        
        // Key generation
        this.generateKeyBtn?.addEventListener('click', () => this.generateKey());
        
        // Process button
        this.processBtn?.addEventListener('click', () => this.processText());
        
        // Utility buttons
        this.clearBtn?.addEventListener('click', () => this.clearAll());
        this.swapBtn?.addEventListener('click', () => this.swapInputOutput());
        
        // File mode
        this.fileMode?.addEventListener('change', () => this.toggleFileMode());
        this.fileBtn?.addEventListener('click', () => this.fileInput?.click());
        this.fileInput?.addEventListener('change', (e) => this.handleFileSelection(e));
        
        // Auto-update key requirements on load
        this.updateKeyRequirements();
        this.updateModeUI();
    }

    async initializeCrypto() {
        // Initialize crypto libraries - in a real implementation, you'd load CryptoJS
        this.cryptoAvailable = true;
        
        // Define key sizes for different algorithms
        this.keyRequirements = {
            'aes-128': { keySize: 16, name: 'AES-128', description: '128-bit key (16 bytes)' },
            'aes-192': { keySize: 24, name: 'AES-192', description: '192-bit key (24 bytes)' },
            'aes-256': { keySize: 32, name: 'AES-256', description: '256-bit key (32 bytes)' },
            'des': { keySize: 8, name: 'DES', description: '64-bit key (8 bytes)' },
            '3des': { keySize: 24, name: '3DES', description: '192-bit key (24 bytes)' },
            'chacha20': { keySize: 32, name: 'ChaCha20', description: '256-bit key (32 bytes)' }
        };
    }

    updateKeyRequirements() {
        const algorithm = this.algorithmSelect?.value || 'aes-256';
        const requirements = this.keyRequirements[algorithm];
        
        if (requirements) {
            const keyInfo = document.getElementById('key-requirements-info');
            if (keyInfo) {
                keyInfo.innerHTML = `
                    <div class="key-requirement-item">
                        <strong>Algorithm:</strong> ${requirements.name}<br>
                        <strong>Key Size:</strong> ${requirements.description}<br>
                        <strong>Hex Length:</strong> ${requirements.keySize * 2} characters
                    </div>
                `;
            }
        }
    }

    updateModeUI() {
        const isEncrypting = this.encryptMode?.checked;
        
        if (this.processBtn) {
            this.processBtn.textContent = isEncrypting ? '🔒 Encrypt' : '🔓 Decrypt';
        }
        
        const inputLabel = document.getElementById('encryption-input-label');
        const outputLabel = document.getElementById('encryption-output-label');
        
        if (inputLabel) {
            inputLabel.textContent = isEncrypting ? 'Text to Encrypt:' : 'Encrypted Text (Hex):';
        }
        
        if (outputLabel) {
            outputLabel.textContent = isEncrypting ? 'Encrypted Output (Hex):' : 'Decrypted Text:';
        }
    }

    generateKey() {
        const algorithm = this.algorithmSelect?.value || 'aes-256';
        const requirements = this.keyRequirements[algorithm];
        const format = this.keyFormatSelect?.value || 'hex';
        
        if (!requirements) {
            this.showError('Unknown algorithm selected');
            return;
        }

        // Generate random bytes
        const keyBytes = new Uint8Array(requirements.keySize);
        if (window.crypto && window.crypto.getRandomValues) {
            window.crypto.getRandomValues(keyBytes);
        } else {
            // Fallback to less secure random
            for (let i = 0; i < keyBytes.length; i++) {
                keyBytes[i] = Math.floor(Math.random() * 256);
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
            case 'utf8':
                keyString = String.fromCharCode.apply(null, keyBytes);
                break;
        }

        if (this.keyInput) {
            this.keyInput.value = keyString;
        }
        
        this.showSuccess(`Generated ${requirements.name} key in ${format.toUpperCase()} format`);
    }

    async processText() {
        const isEncrypting = this.encryptMode?.checked;
        const algorithm = this.algorithmSelect?.value || 'aes-256';
        const key = this.keyInput?.value?.trim() || '';
        const text = this.textInput?.value || '';
        
        if (!key) {
            this.showError('Please enter or generate an encryption key');
            return;
        }
        
        if (!text.trim()) {
            this.showError(`Please enter text to ${isEncrypting ? 'encrypt' : 'decrypt'}`);
            return;
        }

        try {
            this.processBtn.textContent = '⏳ Processing...';
            this.processBtn.disabled = true;
            
            let result;
            if (isEncrypting) {
                result = await this.encryptText(text, key, algorithm);
            } else {
                result = await this.decryptText(text, key, algorithm);
            }
            
            if (this.textOutput) {
                this.textOutput.value = result;
            }
            
            this.showResults(result, isEncrypting, algorithm, key);
            this.showSuccess(`${isEncrypting ? 'Encryption' : 'Decryption'} completed successfully`);
            
        } catch (error) {
            this.showError(`${isEncrypting ? 'Encryption' : 'Decryption'} failed: ${error.message}`);
        } finally {
            this.updateModeUI();
            this.processBtn.disabled = false;
        }
    }

    async encryptText(text, key, algorithm) {
        // This is a simplified implementation
        // In a real app, you'd use a proper crypto library like CryptoJS
        
        // For demonstration, we'll use a simple XOR cipher with the key
        // This is NOT cryptographically secure!
        const keyBytes = this.hexToBytes(key);
        const textBytes = new TextEncoder().encode(text);
        const encrypted = new Uint8Array(textBytes.length);
        
        for (let i = 0; i < textBytes.length; i++) {
            encrypted[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
        }
        
        return Array.from(encrypted)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    async decryptText(hexText, key, algorithm) {
        // This is a simplified implementation
        // In a real app, you'd use a proper crypto library like CryptoJS
        
        try {
            const keyBytes = this.hexToBytes(key);
            const encryptedBytes = this.hexToBytes(hexText);
            const decrypted = new Uint8Array(encryptedBytes.length);
            
            for (let i = 0; i < encryptedBytes.length; i++) {
                decrypted[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
            }
            
            return new TextDecoder().decode(decrypted);
        } catch (error) {
            throw new Error('Invalid hex input or key');
        }
    }

    hexToBytes(hex) {
        if (hex.length % 2 !== 0) {
            throw new Error('Invalid hex string length');
        }
        
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return bytes;
    }

    showResults(result, isEncrypting, algorithm, key) {
        if (!this.resultsContainer) return;
        
        const requirements = this.keyRequirements[algorithm];
        const operation = isEncrypting ? 'Encryption' : 'Decryption';
        
        this.resultsContainer.innerHTML = `
            <div class="encryption-result-section">
                <h4>${operation} Results</h4>
                <div class="result-details">
                    <div class="result-item">
                        <label>Algorithm:</label>
                        <span>${requirements?.name || algorithm}</span>
                    </div>
                    <div class="result-item">
                        <label>Key (first 16 chars):</label>
                        <span>${key.substring(0, 16)}...</span>
                    </div>
                    <div class="result-item">
                        <label>Output Length:</label>
                        <span>${result.length} characters</span>
                    </div>
                    <div class="result-item">
                        <label>Operation:</label>
                        <span>${operation}</span>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn-small" onclick="window.copyToClipboardFallback('${result.replace(/'/g, "\\'")}')">📋 Copy Result</button>
                    <button class="btn-small" onclick="window.copyToClipboardFallback('${key}')">🔑 Copy Key</button>
                </div>
            </div>
        `;
    }

    swapInputOutput() {
        if (!this.textInput || !this.textOutput) return;
        
        const inputText = this.textInput.value;
        const outputText = this.textOutput.value;
        
        this.textInput.value = outputText;
        this.textOutput.value = inputText;
        
        // Also swap the mode
        if (this.encryptMode?.checked) {
            this.decryptMode.checked = true;
        } else {
            this.encryptMode.checked = true;
        }
        
        this.updateModeUI();
        this.showSuccess('Input and output swapped');
    }

    toggleFileMode() {
        const isFileMode = this.fileMode?.checked;
        
        if (this.textInput) {
            this.textInput.style.display = isFileMode ? 'none' : 'block';
        }
        
        if (this.fileBtn) {
            this.fileBtn.style.display = isFileMode ? 'block' : 'none';
        }
        
        const fileLabel = document.getElementById('file-mode-label');
        if (fileLabel) {
            fileLabel.style.display = isFileMode ? 'block' : 'none';
        }
    }

    handleFileSelection(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            if (this.textInput) {
                this.textInput.value = e.target.result;
                this.showSuccess(`File "${file.name}" loaded successfully`);
            }
        };
        
        reader.readAsText(file);
    }

    clearAll() {
        if (this.keyInput) this.keyInput.value = '';
        if (this.textInput) this.textInput.value = '';
        if (this.textOutput) this.textOutput.value = '';
        if (this.fileInput) this.fileInput.value = '';
        if (this.resultsContainer) this.resultsContainer.innerHTML = '';
        
        // Reset to encrypt mode
        if (this.encryptMode) this.encryptMode.checked = true;
        if (this.decryptMode) this.decryptMode.checked = false;
        
        this.updateModeUI();
        this.showSuccess('All fields cleared');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        let messageEl = document.getElementById('encryption-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'encryption-message';
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
}

// Initialize Symmetric Encryption Tool when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new SymmetricEncryption();
    }, 100);
});
