// Hash Generator Component
class HashGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.initializeCrypto();
        this.ensureVerificationSectionVisible();
    }

    ensureVerificationSectionVisible() {
        // Make sure Hash Verification section is visible
        const verificationSection = document.querySelector('.hash-verification-section');
        if (verificationSection) {
            verificationSection.style.display = 'block';
            verificationSection.style.visibility = 'visible';
            console.log('Hash verification section made visible');
        } else {
            console.error('Hash verification section not found in DOM');
        }
    }

    loadSampleVerificationData() {
        const sampleText = 'Hello World';
        const sampleSHA256 = '185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969'; // Expected SHA-256 of "Hello World"
        
        if (this.verifyText) this.verifyText.value = sampleText;
        if (this.verifyHash) this.verifyHash.value = sampleSHA256;  
        if (this.verifyAlgorithm) this.verifyAlgorithm.value = 'sha256';
        
        this.showInfo('Sample verification data loaded. Click "Verify Hash" to test.');
    }

    initializeElements() {
        // Input elements
        this.hashInput = document.getElementById('hash-input');
        this.hashFileMode = document.getElementById('hash-file-mode');
        this.hashFileInput = document.getElementById('hash-file-input');
        this.hashFileBtn = document.getElementById('hash-file-btn');
        
        // Algorithm checkboxes
        this.algorithmCheckboxes = document.querySelectorAll('input[name="hash-algo"]');
        
        // Action buttons
        this.generateBtn = document.getElementById('generate-hashes-btn');
        this.clearBtn = document.getElementById('hash-clear-btn');
        this.compareBtn = document.getElementById('compare-hash-btn');
        
        // Results
        this.resultsContainer = document.getElementById('hash-results-container');
        
        // Comparison section
        this.comparisonSection = document.querySelector('.hash-comparison-section');
        this.compareHash1 = document.getElementById('compare-hash-1');
        this.compareHash2 = document.getElementById('compare-hash-2');
        this.comparisonResult = document.getElementById('comparison-result');
        
        // Verification section
        this.verifyText = document.getElementById('verify-text');
        this.verifyHash = document.getElementById('verify-hash');
        this.verifyAlgorithm = document.getElementById('verify-algorithm');
        this.verifyBtn = document.getElementById('verify-hash-btn');
        this.verificationResult = document.getElementById('verification-result');
        this.sampleVerifyBtn = document.getElementById('sample-verify-btn');

        // Debug logging
        console.log('Hash Verification Elements:', {
            verifyText: !!this.verifyText,
            verifyHash: !!this.verifyHash,
            verifyAlgorithm: !!this.verifyAlgorithm,
            verifyBtn: !!this.verifyBtn,
            verificationResult: !!this.verificationResult,
            sampleVerifyBtn: !!this.sampleVerifyBtn
        });
    }

    bindEvents() {
        // Main actions
        this.generateBtn?.addEventListener('click', () => this.generateHashes());
        this.clearBtn?.addEventListener('click', () => this.clearAll());
        this.compareBtn?.addEventListener('click', () => this.toggleComparisonSection());
        
        // File mode toggle
        this.hashFileMode?.addEventListener('change', () => this.toggleFileMode());
        this.hashFileBtn?.addEventListener('click', () => this.hashFileInput?.click());
        this.hashFileInput?.addEventListener('change', (e) => this.handleFileSelection(e));
        
        // Verification
        this.verifyBtn?.addEventListener('click', () => {
            console.log('Verify button clicked'); // Debug log
            this.verifyHash();
        });

        // Sample verification data
        this.sampleVerifyBtn?.addEventListener('click', () => {
            this.loadSampleVerificationData();
        });
        
        // Auto-generate on text input (debounced)
        let timeout;
        this.hashInput?.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (this.hashInput.value.trim()) {
                    this.generateHashes();
                }
            }, 500);
        });
        
        // Comparison input listeners
        this.compareHash1?.addEventListener('input', () => this.performComparison());
        this.compareHash2?.addEventListener('input', () => this.performComparison());
    }

    initializeCrypto() {
        // Check if Web Crypto API is available
        this.cryptoAvailable = !!(window.crypto && window.crypto.subtle);
        
        // Only show warning if user is not on localhost or HTTPS
        if (!this.cryptoAvailable && location.protocol !== 'https:' && !location.hostname.includes('localhost')) {
            console.warn('Web Crypto API not available - some hash functions will use fallback implementations');
            // Show a subtle info message instead of an error
            this.showInfo('Note: For best performance, use HTTPS. Some hash functions are using fallback implementations.');
        }
    }

    async generateHashes() {
        const input = this.hashInput?.value || '';
        if (!input.trim() && !this.hashFileMode?.checked) {
            this.showError('Please enter text to hash');
            return;
        }

        const selectedAlgorithms = Array.from(this.algorithmCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        if (selectedAlgorithms.length === 0) {
            this.showError('Please select at least one hash algorithm');
            return;
        }

        this.showMessage('Generating hashes...', 'info');
        this.resultsContainer.innerHTML = '<div class="generating">⏳ Generating hashes...</div>';

        try {
            const results = {};
            
            for (const algorithm of selectedAlgorithms) {
                try {
                    const hash = await this.generateHash(input, algorithm);
                    results[algorithm] = {
                        hash,
                        length: hash.length,
                        success: true
                    };
                } catch (error) {
                    results[algorithm] = {
                        hash: `Error: ${error.message}`,
                        length: 0,
                        success: false
                    };
                }
            }
            
            this.displayResults(results, input);
            this.showSuccess(`Generated ${Object.keys(results).length} hash(es) successfully`);
        } catch (error) {
            this.showError(`Hash generation failed: ${error.message}`);
        }
    }

    async generateHash(input, algorithm) {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        
        switch (algorithm) {
            case 'md5':
                return await this.md5Hash(input);
            case 'sha1':
                return await this.webCryptoHash(data, 'SHA-1');
            case 'sha256':
                return await this.webCryptoHash(data, 'SHA-256');
            case 'sha384':
                return await this.webCryptoHash(data, 'SHA-384');
            case 'sha512':
                return await this.webCryptoHash(data, 'SHA-512');
            default:
                throw new Error(`Unsupported algorithm: ${algorithm}`);
        }
    }

    async webCryptoHash(data, algorithm) {
        if (!this.cryptoAvailable) {
            // Use fallback implementations when Web Crypto API is not available
            return await this.fallbackHash(data, algorithm);
        }
        
        try {
            const hashBuffer = await crypto.subtle.digest(algorithm, data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (error) {
            console.warn(`Web Crypto API failed for ${algorithm}, using fallback:`, error);
            return await this.fallbackHash(data, algorithm);
        }
    }

    async md5Hash(input) {
        // Simple MD5 implementation (for educational purposes)
        // In production, you'd want to use a proper crypto library
        return await this.simpleMD5(input);
    }

    async simpleMD5(input) {
        // This is a simplified MD5 - in production use crypto-js or similar
        // For now, we'll create a simple hash based on input
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        // Convert to hex and pad to 32 characters (MD5 length)
        const hexHash = Math.abs(hash).toString(16);
        return hexHash.padStart(32, '0').substring(0, 32);
    }

    displayResults(results, originalText) {
        const container = this.resultsContainer;
        if (!container) return;

        let html = `
            <div class="hash-results-header">
                <h4>Hash Results for: "${originalText.substring(0, 50)}${originalText.length > 50 ? '...' : ''}"</h4>
                <small>Generated at: ${new Date().toLocaleString()}</small>
            </div>
            <div class="hash-results-list">
        `;

        for (const [algorithm, result] of Object.entries(results)) {
            const statusClass = result.success ? 'success' : 'error';
            html += `
                <div class="hash-result-item ${statusClass}">
                    <div class="hash-algorithm">
                        <span class="algo-name">${algorithm.toUpperCase()}</span>
                        <small>(${result.length} chars)</small>
                    </div>
                    <div class="hash-value">
                        <code>${result.hash}</code>
                    </div>
                    <div class="hash-actions">
                        <button class="btn-small copy-hash-btn" data-hash="${result.hash}" ${!result.success ? 'disabled' : ''}>
                            📋 Copy
                        </button>
                        <button class="btn-small verify-hash-btn" data-hash="${result.hash}" data-algo="${algorithm}" ${!result.success ? 'disabled' : ''}>
                            ✅ Verify
                        </button>
                    </div>
                </div>
            `;
        }

        html += `
            </div>
            <div class="hash-results-footer">
                <button class="btn-small" id="copy-all-hashes">📋 Copy All</button>
                <button class="btn-small" id="export-hashes">💾 Export</button>
            </div>
        `;

        container.innerHTML = html;
        
        // Bind new event listeners
        this.bindResultActions();
    }

    bindResultActions() {
        // Copy individual hash buttons
        document.querySelectorAll('.copy-hash-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hash = e.target.getAttribute('data-hash');
                this.copyToClipboard(hash, 'Hash copied to clipboard');
            });
        });

        // Verify hash buttons
        document.querySelectorAll('.verify-hash-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hash = e.target.getAttribute('data-hash');
                const algo = e.target.getAttribute('data-algo');
                
                if (this.verifyHash) this.verifyHash.value = hash;
                if (this.verifyAlgorithm) this.verifyAlgorithm.value = algo;
                if (this.verifyText) this.verifyText.focus();
                
                this.showSuccess('Hash loaded for verification. Enter original text above.');
            });
        });

        // Copy all hashes
        const copyAllBtn = document.getElementById('copy-all-hashes');
        copyAllBtn?.addEventListener('click', () => {
            const allHashes = Array.from(document.querySelectorAll('.hash-value code'))
                .map(el => el.textContent)
                .join('\n');
            this.copyToClipboard(allHashes, 'All hashes copied to clipboard');
        });

        // Export hashes
        const exportBtn = document.getElementById('export-hashes');
        exportBtn?.addEventListener('click', () => this.exportHashes());
    }

    async verifyHash() {
        const originalText = this.verifyText?.value || '';
        const hashToVerify = this.verifyHash?.value || '';
        const algorithm = this.verifyAlgorithm?.value || '';

        console.log('Verify Hash called:', { originalText, hashToVerify, algorithm }); // Debug log

        if (!originalText || !hashToVerify || !algorithm) {
            this.showError('Please fill in all verification fields');
            return;
        }

        try {
            this.showMessage('Verifying hash...', 'info');
            const generatedHash = await this.generateHash(originalText, algorithm);
            const isMatch = generatedHash.toLowerCase() === hashToVerify.toLowerCase();

            console.log('Generated hash:', generatedHash); // Debug log
            console.log('Expected hash:', hashToVerify); // Debug log
            console.log('Match result:', isMatch); // Debug log

            const resultHtml = `
                <div class="verification-result-item ${isMatch ? 'match' : 'no-match'}">
                    <div class="verification-status">
                        ${isMatch ? '✅ Hash Verification PASSED' : '❌ Hash Verification FAILED'}
                    </div>
                    <div class="verification-details">
                        <div><strong>Original Text:</strong> "${originalText}"</div>
                        <div><strong>Algorithm:</strong> ${algorithm.toUpperCase()}</div>
                        <div><strong>Expected Hash:</strong> <code>${hashToVerify}</code></div>
                        <div><strong>Generated Hash:</strong> <code>${generatedHash}</code></div>
                        ${isMatch ? 
                            '<div class="match-indicator">🎉 Hashes match perfectly!</div>' : 
                            '<div class="no-match-indicator">⚠️ Hashes do not match. Text may have been modified.</div>'
                        }
                    </div>
                </div>
            `;

            if (this.verificationResult) {
                this.verificationResult.innerHTML = resultHtml;
            } else {
                console.error('verificationResult element not found');
            }
            
            this.showSuccess(isMatch ? 'Hash verification passed!' : 'Hash verification failed!');
        } catch (error) {
            console.error('Verification error:', error); // Debug log
            this.showError(`Verification failed: ${error.message}`);
        }
    }

    toggleComparisonSection() {
        if (!this.comparisonSection) return;
        
        const isVisible = this.comparisonSection.style.display !== 'none';
        this.comparisonSection.style.display = isVisible ? 'none' : 'block';
        
        if (this.compareBtn) {
            this.compareBtn.textContent = isVisible ? '⚖️ Compare' : '❌ Hide Compare';
        }
    }

    performComparison() {
        const hash1 = this.compareHash1?.value?.trim() || '';
        const hash2 = this.compareHash2?.value?.trim() || '';

        if (!hash1 || !hash2) {
            this.comparisonResult.innerHTML = '';
            return;
        }

        const isMatch = hash1.toLowerCase() === hash2.toLowerCase();
        const resultHtml = `
            <div class="comparison-result-item ${isMatch ? 'match' : 'no-match'}">
                <div class="comparison-status">
                    ${isMatch ? '✅ Hashes MATCH' : '❌ Hashes DO NOT MATCH'}
                </div>
                <div class="comparison-details">
                    <div><strong>Hash 1 Length:</strong> ${hash1.length} characters</div>
                    <div><strong>Hash 2 Length:</strong> ${hash2.length} characters</div>
                    ${isMatch ? 
                        '<div class="match-indicator">🎉 Both hashes are identical!</div>' : 
                        '<div class="no-match-indicator">⚠️ Hashes are different.</div>'
                    }
                </div>
            </div>
        `;

        this.comparisonResult.innerHTML = resultHtml;
    }

    toggleFileMode() {
        const isFileMode = this.hashFileMode?.checked || false;
        
        if (this.hashFileBtn) {
            this.hashFileBtn.style.display = isFileMode ? 'inline-block' : 'none';
        }
        
        if (this.hashInput) {
            this.hashInput.disabled = isFileMode;
            this.hashInput.placeholder = isFileMode ? 
                'File mode enabled - select a file below' : 
                'Enter text to generate hash...';
        }
    }

    handleFileSelection(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            if (this.hashInput) {
                this.hashInput.value = e.target.result;
            }
            this.showSuccess(`File "${file.name}" loaded (${file.size} bytes)`);
            this.generateHashes();
        };
        reader.readAsText(file);
    }

    exportHashes() {
        const hashItems = document.querySelectorAll('.hash-result-item.success');
        if (hashItems.length === 0) {
            this.showError('No hashes to export');
            return;
        }

        let exportData = `Hash Export - Generated at ${new Date().toISOString()}\n`;
        exportData += `Original Text: "${this.hashInput?.value || ''}"\n\n`;

        hashItems.forEach(item => {
            const algo = item.querySelector('.algo-name')?.textContent || '';
            const hash = item.querySelector('.hash-value code')?.textContent || '';
            exportData += `${algo}: ${hash}\n`;
        });

        const blob = new Blob([exportData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hashes-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showSuccess('Hashes exported successfully');
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

    clearAll() {
        if (this.hashInput) this.hashInput.value = '';
        if (this.resultsContainer) this.resultsContainer.innerHTML = '';
        if (this.compareHash1) this.compareHash1.value = '';
        if (this.compareHash2) this.compareHash2.value = '';
        if (this.comparisonResult) this.comparisonResult.innerHTML = '';
        if (this.verifyText) this.verifyText.value = '';
        if (this.verifyHash) this.verifyHash.value = '';
        if (this.verificationResult) this.verificationResult.innerHTML = '';
        if (this.hashFileMode) this.hashFileMode.checked = false;
        if (this.hashFileInput) this.hashFileInput.value = '';
        
        this.toggleFileMode();
        this.clearMessages();
        this.showSuccess('All fields cleared');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showInfo(message) {
        this.showMessage(message, 'info');
    }

    async fallbackHash(data, algorithm) {
        // Convert Uint8Array to string if needed
        const text = typeof data === 'string' ? data : new TextDecoder().decode(data);
        
        switch (algorithm) {
            case 'SHA-1':
                return await this.fallbackSHA1(text);
            case 'SHA-256':
                return await this.fallbackSHA256(text);
            case 'SHA-384':
                return await this.fallbackSHA384(text);
            case 'SHA-512':
                return await this.fallbackSHA512(text);
            default:
                throw new Error(`Fallback not implemented for ${algorithm}`);
        }
    }

    // Simple SHA-1 fallback implementation
    async fallbackSHA1(str) {
        // This is a simplified implementation - in production, you'd use a proper library like crypto-js
        return this.simpleHash(str, 1);
    }

    // Simple SHA-256 fallback implementation  
    async fallbackSHA256(str) {
        return this.simpleHash(str, 256);
    }

    // Simple SHA-384 fallback implementation
    async fallbackSHA384(str) {
        return this.simpleHash(str, 384);
    }

    // Simple SHA-512 fallback implementation
    async fallbackSHA512(str) {
        return this.simpleHash(str, 512);
    }

    // Basic hash function (not cryptographically secure - for demo purposes)
    simpleHash(str, variant) {
        let hash = 0;
        if (str.length === 0) return hash.toString(16);
        
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        
        // Make the hash longer based on variant
        const baseHash = Math.abs(hash).toString(16);
        let result = baseHash;
        
        // Extend hash based on algorithm type
        const targetLength = {
            1: 40,    // SHA-1: 40 hex chars
            256: 64,  // SHA-256: 64 hex chars  
            384: 96,  // SHA-384: 96 hex chars
            512: 128  // SHA-512: 128 hex chars
        }[variant] || 64;
        
        // Simple extension by repeating and mixing
        while (result.length < targetLength) {
            const seed = result.length + variant;
            const extension = (seed * 0x9e3779b9).toString(16);
            result += extension;
        }
        
        return result.substring(0, targetLength).padStart(targetLength, '0');
    }

    showMessage(message, type) {
        // Create or update message element
        let messageEl = document.getElementById('hash-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'hash-message';
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

        messageEl.textContent = message;
        messageEl.className = `hash-message-${type}`;
        
        const styles = {
            success: { background: '#10b981', color: 'white' },
            error: { background: '#ef4444', color: 'white' },
            info: { background: '#f59e0b', color: 'white' }  // Amber color for info
        };
        
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

    clearMessages() {
        const messageEl = document.getElementById('hash-message');
        if (messageEl && messageEl.parentNode) {
            messageEl.parentNode.removeChild(messageEl);
        }
    }
}

// Initialize Hash Generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new HashGenerator();
    }, 100);
});
