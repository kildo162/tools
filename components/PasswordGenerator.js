// Password Generator Component
class PasswordGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.generatePassword();
    }

    initializeElements() {
        // Length slider
        this.lengthSlider = document.getElementById('password-length');
        this.lengthDisplay = document.getElementById('password-length-display');
        
        // Character set checkboxes
        this.uppercaseCheck = document.getElementById('include-uppercase');
        this.lowercaseCheck = document.getElementById('include-lowercase');
        this.numbersCheck = document.getElementById('include-numbers');
        this.symbolsCheck = document.getElementById('include-symbols');
        this.excludeSimilarCheck = document.getElementById('exclude-similar');
        
        // Generate button and output
        this.generateBtn = document.getElementById('generate-password-btn');
        this.passwordOutput = document.getElementById('password-output');
        this.copyBtn = document.getElementById('copy-password-btn');
        this.strengthMeter = document.getElementById('password-strength-meter');
        this.strengthText = document.getElementById('password-strength-text');
        this.strengthPercent = document.getElementById('password-strength-percent');
        
        // Batch generator
        this.batchCountInput = document.getElementById('batch-password-count');
        this.generateBatchBtn = document.getElementById('generate-batch-btn');
        this.batchOutput = document.getElementById('batch-password-output');
        
        // Character sets
        this.charSets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };
        
        this.similarChars = 'il1Lo0O';
    }

    bindEvents() {
        // Length slider
        this.lengthSlider?.addEventListener('input', () => this.updateLength());
        
        // Character set checkboxes
        [this.uppercaseCheck, this.lowercaseCheck, this.numbersCheck, 
         this.symbolsCheck, this.excludeSimilarCheck]?.forEach(checkbox => {
            checkbox?.addEventListener('change', () => this.generatePassword());
        });
        
        // Generate button
        this.generateBtn?.addEventListener('click', () => this.generatePassword());
        
        // Copy button
        this.copyBtn?.addEventListener('click', () => this.copyPassword());
        
        // Batch generator
        this.generateBatchBtn?.addEventListener('click', () => this.generateBatchPasswords());
    }

    updateLength() {
        const length = this.lengthSlider.value;
        this.lengthDisplay.textContent = length;
        this.generatePassword();
    }

    getCharacterSet() {
        let charset = '';
        
        if (this.uppercaseCheck?.checked) charset += this.charSets.uppercase;
        if (this.lowercaseCheck?.checked) charset += this.charSets.lowercase;
        if (this.numbersCheck?.checked) charset += this.charSets.numbers;
        if (this.symbolsCheck?.checked) charset += this.charSets.symbols;
        
        // Exclude similar characters if requested
        if (this.excludeSimilarCheck?.checked && charset) {
            charset = charset.split('').filter(char => 
                !this.similarChars.includes(char)
            ).join('');
        }
        
        return charset;
    }

    generateSecureRandom(max) {
        // Use Web Crypto API for secure random generation
        if (window.crypto && window.crypto.getRandomValues) {
            const array = new Uint32Array(1);
            window.crypto.getRandomValues(array);
            return array[0] % max;
        } else {
            // Fallback to Math.random (less secure)
            return Math.floor(Math.random() * max);
        }
    }

    generatePassword() {
        const length = parseInt(this.lengthSlider?.value || 16);
        const charset = this.getCharacterSet();
        
        if (!charset) {
            this.showError('Please select at least one character set');
            return '';
        }

        let password = '';
        
        // Ensure at least one character from each selected set
        const requiredChars = [];
        if (this.uppercaseCheck?.checked) {
            const upperSet = this.excludeSimilarCheck?.checked ? 
                this.charSets.uppercase.split('').filter(c => !this.similarChars.includes(c)).join('') :
                this.charSets.uppercase;
            requiredChars.push(upperSet[this.generateSecureRandom(upperSet.length)]);
        }
        if (this.lowercaseCheck?.checked) {
            const lowerSet = this.excludeSimilarCheck?.checked ?
                this.charSets.lowercase.split('').filter(c => !this.similarChars.includes(c)).join('') :
                this.charSets.lowercase;
            requiredChars.push(lowerSet[this.generateSecureRandom(lowerSet.length)]);
        }
        if (this.numbersCheck?.checked) {
            const numSet = this.excludeSimilarCheck?.checked ?
                this.charSets.numbers.split('').filter(c => !this.similarChars.includes(c)).join('') :
                this.charSets.numbers;
            requiredChars.push(numSet[this.generateSecureRandom(numSet.length)]);
        }
        if (this.symbolsCheck?.checked) {
            requiredChars.push(this.charSets.symbols[this.generateSecureRandom(this.charSets.symbols.length)]);
        }
        
        // Add required characters first
        password = requiredChars.join('');
        
        // Fill the rest randomly
        for (let i = password.length; i < length; i++) {
            password += charset[this.generateSecureRandom(charset.length)];
        }
        
        // Shuffle the password to avoid predictable patterns
        password = this.shuffleString(password);
        
        // Update UI
        if (this.passwordOutput) {
            this.passwordOutput.textContent = password;
        }
        
        this.updateStrengthMeter(password);
        return password;
    }

    shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = this.generateSecureRandom(i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    calculatePasswordStrength(password) {
        let score = 0;
        let feedback = [];
        
        // Length scoring
        if (password.length >= 12) score += 25;
        else if (password.length >= 8) score += 15;
        else feedback.push('Use at least 8 characters');
        
        // Character variety scoring
        if (/[a-z]/.test(password)) score += 10;
        else feedback.push('Include lowercase letters');
        
        if (/[A-Z]/.test(password)) score += 10;
        else feedback.push('Include uppercase letters');
        
        if (/[0-9]/.test(password)) score += 10;
        else feedback.push('Include numbers');
        
        if (/[^a-zA-Z0-9]/.test(password)) score += 15;
        else feedback.push('Include special characters');
        
        // Additional strength factors
        if (password.length >= 16) score += 10;
        if (password.length >= 20) score += 10;
        if (/[!@#$%^&*()_+\-=\[\]{}|;':\",./<>?]/.test(password)) score += 10;
        
        return { score: Math.min(score, 100), feedback };
    }

    updateStrengthMeter(password) {
        const { score, feedback } = this.calculatePasswordStrength(password);
        
        let strength = 'Very Weak';
        let color = '#ef4444';
        
        if (score >= 80) {
            strength = 'Very Strong';
            color = '#22c55e';
        } else if (score >= 60) {
            strength = 'Strong';
            color = '#eab308';
        } else if (score >= 40) {
            strength = 'Moderate';
            color = '#f97316';
        } else if (score >= 20) {
            strength = 'Weak';
            color = '#ef4444';
        }
        
        if (this.strengthMeter) {
            this.strengthMeter.style.width = `${score}%`;
            this.strengthMeter.style.backgroundColor = color;
        }
        
        if (this.strengthText) {
            this.strengthText.textContent = strength;
            this.strengthText.style.color = color;
        }
        
        if (this.strengthPercent) {
            this.strengthPercent.textContent = `${score}%`;
        }
    }

    copyPassword() {
        const password = this.passwordOutput?.textContent || '';
        if (!password) {
            this.showError('No password to copy');
            return;
        }
        
        this.copyToClipboard(password, 'Password copied to clipboard!');
    }

    generateBatchPasswords() {
        const count = parseInt(this.batchCountInput?.value || 5);
        if (count < 1 || count > 50) {
            this.showError('Please enter a number between 1 and 50');
            return;
        }
        
        const passwords = [];
        for (let i = 0; i < count; i++) {
            passwords.push(this.generatePassword());
        }
        
        if (this.batchOutput) {
            this.batchOutput.innerHTML = passwords.map((password, index) => `
                <div class="batch-password-item">
                    <span class="batch-number">${index + 1}.</span>
                    <code class="batch-password">${password}</code>
                    <button class="btn-small copy-batch-btn" onclick="window.copyToClipboardFallback('${password}')">Copy</button>
                </div>
            `).join('');
        }
    }

    showError(message) {
        // Create or update message element
        let messageEl = document.getElementById('password-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'password-message';
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                z-index: 1000;
                background: #ef4444;
                color: white;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(messageEl);
        }

        messageEl.textContent = message;
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

    showSuccess(message) {
        // Create or update message element
        let messageEl = document.getElementById('password-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'password-message';
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                z-index: 1000;
                background: #22c55e;
                color: white;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(messageEl);
        }

        messageEl.textContent = message;
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

// Initialize Password Generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new PasswordGenerator();
    }, 100);
});
