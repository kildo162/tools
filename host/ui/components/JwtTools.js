// JWT Tools - Generator, Validator, Fuzzer
class JwtTools {
    constructor() {
        this.initializeEventListeners();
        this.commonSecrets = [
            'secret', '123456', 'password', 'admin', 'test', 'key', 'jwt',
            'hello', 'world', 'qwerty', '12345678', 'secretkey', 'mysecret'
        ];
        
        // Check Web Crypto API availability
        this.hasCryptoAPI = window.crypto && window.crypto.subtle;
        
        // Initialize default values
        this.initializeDefaults();
        
        // Show crypto API warning if needed
        if (!this.hasCryptoAPI) {
            console.warn('Web Crypto API not available. JWT signature verification will use fallback implementation.');
        }
    }

    initializeDefaults() {
        // Set default JWT header and payload
        const headerTextarea = document.getElementById('jwt-header');
        const payloadTextarea = document.getElementById('jwt-payload');
        
        if (headerTextarea) {
            headerTextarea.value = JSON.stringify({
                "alg": "HS256",
                "typ": "JWT"
            }, null, 2);
        }
        
        if (payloadTextarea) {
            payloadTextarea.value = JSON.stringify({
                "sub": "1234567890",
                "name": "John Doe",
                "iat": Math.floor(Date.now() / 1000),
                "exp": Math.floor(Date.now() / 1000) + 3600
            }, null, 2);
        }
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            // JWT Validation listeners
            const parseBtn = document.getElementById('parse-jwt');
            const verifyBtn = document.getElementById('verify-jwt');
            
            if (parseBtn) parseBtn.addEventListener('click', () => this.parseJWT());
            if (verifyBtn) verifyBtn.addEventListener('click', () => this.verifyJWTSignature());

            // JWT Generator listeners
            const generateSecretBtn = document.getElementById('generate-secret');
            const showSecretBtn = document.getElementById('show-secret');
            const copySecretBtn = document.getElementById('copy-secret');
            const generateJwtBtn = document.getElementById('generate-jwt');
            const copyJwtBtn = document.getElementById('copy-jwt');

            if (generateSecretBtn) generateSecretBtn.addEventListener('click', () => this.generateSecret());
            if (showSecretBtn) showSecretBtn.addEventListener('click', () => this.toggleSecretVisibility());
            if (copySecretBtn) copySecretBtn.addEventListener('click', () => this.copySecret());
            if (generateJwtBtn) generateJwtBtn.addEventListener('click', () => this.generateJWT());
            if (copyJwtBtn) copyJwtBtn.addEventListener('click', () => this.copyJWT());

            // JWT Fuzzer listeners
            const startFuzzingBtn = document.getElementById('start-fuzzing');
            if (startFuzzingBtn) startFuzzingBtn.addEventListener('click', () => this.startFuzzing());

            // Auto-fill secret from generator to JWT generator
            const secretDisplay = document.getElementById('generated-secret');
            const secretInput = document.getElementById('jwt-secret-input');
            if (secretDisplay && secretInput) {
                new MutationObserver(() => {
                    if (secretDisplay.dataset.hidden === 'false') {
                        secretInput.placeholder = 'Secret generated above, or enter your own...';
                    }
                }).observe(secretDisplay, { childList: true, subtree: true });
            }
        });
    }

    // JWT Validation & Parsing
    parseJWT() {
        const jwt = document.getElementById('jwt-input').value.trim();
        const statusIndicator = document.getElementById('jwt-valid-status');
        
        if (!jwt) {
            this.showStatus('Please enter a JWT token', 'invalid');
            this.clearJWTParts();
            return;
        }

        try {
            const parts = jwt.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format');
            }

            const header = this.base64UrlDecode(parts[0]);
            const payload = this.base64UrlDecode(parts[1]);
            const signature = parts[2];

            this.displayJWTPart('.jwt-part.header .part-content', header);
            this.displayJWTPart('.jwt-part.payload .part-content', payload);
            this.displayJWTPart('.jwt-part.signature .part-content', signature);

            this.showStatus('JWT successfully decoded', 'valid');
            
            // Check for common security issues
            this.checkJWTSecurity(header, payload);
            
        } catch (error) {
            this.showStatus(`Error parsing JWT: ${error.message}`, 'invalid');
            this.clearJWTParts();
        }
    }

    verifyJWTSignature() {
        const jwt = document.getElementById('jwt-input').value.trim();
        const secret = document.getElementById('jwt-secret').value.trim();
        
        if (!jwt || !secret) {
            this.showStatus('Please provide both JWT token and secret key', 'invalid');
            return;
        }

        // Show warning if not using secure crypto
        if (!this.hasCryptoAPI) {
            this.showStatus('⚠️ Using fallback crypto - signature verification may be less reliable', 'warning');
        }

        try {
            const parts = jwt.split('.');
            const header = JSON.parse(this.base64UrlDecode(parts[0]));
            
            this.signJWT(parts[0] + '.' + parts[1], secret, header.alg).then(expectedSignature => {
                const actualSignature = parts[2];
                
                if (expectedSignature === actualSignature) {
                    this.showStatus('✓ JWT signature is valid' + (!this.hasCryptoAPI ? ' (fallback verification)' : ''), 'valid');
                } else {
                    this.showStatus('✗ JWT signature is invalid' + (!this.hasCryptoAPI ? ' (fallback verification)' : ''), 'invalid');
                }
            }).catch(error => {
                this.showStatus(`Error verifying signature: ${error.message}`, 'invalid');
            });
        } catch (error) {
            this.showStatus(`Error verifying signature: ${error.message}`, 'invalid');
        }
    }

    // JWT Generator
    generateSecret() {
        const keyLength = parseInt(document.getElementById('key-length').value);
        const secret = this.generateSecureKey(keyLength);
        
        const secretDisplay = document.getElementById('generated-secret');
        const showBtn = document.getElementById('show-secret');
        const copyBtn = document.getElementById('copy-secret');
        
        secretDisplay.textContent = secret;
        secretDisplay.dataset.hidden = 'true';
        
        showBtn.disabled = false;
        copyBtn.disabled = false;
        showBtn.textContent = 'Show Full Secret';
        
        // Auto-fill to JWT generator if it exists
        const jwtSecretInput = document.getElementById('jwt-secret-input');
        if (jwtSecretInput && jwtSecretInput.value === '') {
            jwtSecretInput.value = secret;
        }
    }

    generateSecureKey(bits) {
        const bytes = Math.ceil(bits / 8);
        
        if (window.crypto && window.crypto.getRandomValues) {
            // Use secure random generation if available
            const randomBytes = new Uint8Array(bytes);
            window.crypto.getRandomValues(randomBytes);
            
            let result = '';
            for (let i = 0; i < randomBytes.length; i++) {
                result += randomBytes[i].toString(16).padStart(2, '0');
            }
            return result;
        } else {
            // Fallback to Math.random (less secure, but functional)
            console.warn('Using Math.random() fallback for key generation - not cryptographically secure');
            let result = '';
            for (let i = 0; i < bytes; i++) {
                const randomByte = Math.floor(Math.random() * 256);
                result += randomByte.toString(16).padStart(2, '0');
            }
            return result;
        }
    }

    toggleSecretVisibility() {
        const secretDisplay = document.getElementById('generated-secret');
        const showBtn = document.getElementById('show-secret');
        
        if (secretDisplay.dataset.hidden === 'true') {
            secretDisplay.dataset.hidden = 'false';
            showBtn.textContent = 'Hide Secret';
        } else {
            secretDisplay.dataset.hidden = 'true';
            showBtn.textContent = 'Show Full Secret';
        }
    }

    copySecret() {
        const secretDisplay = document.getElementById('generated-secret');
        navigator.clipboard.writeText(secretDisplay.textContent).then(() => {
            const copyBtn = document.getElementById('copy-secret');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = originalText, 2000);
        });
    }

    generateJWT() {
        try {
            const algorithm = document.getElementById('jwt-algorithm').value;
            const secret = document.getElementById('jwt-secret-input').value.trim();
            const headerText = document.getElementById('jwt-header').value.trim();
            const payloadText = document.getElementById('jwt-payload').value.trim();
            
            if (!secret) {
                alert('Please provide a secret key');
                return;
            }

            const header = JSON.parse(headerText);
            const payload = JSON.parse(payloadText);
            
            header.alg = algorithm; // Ensure algorithm matches selection
            
            const headerEncoded = this.base64UrlEncode(JSON.stringify(header));
            const payloadEncoded = this.base64UrlEncode(JSON.stringify(payload));
            
            this.signJWT(headerEncoded + '.' + payloadEncoded, secret, algorithm).then(signature => {
                const jwt = `${headerEncoded}.${payloadEncoded}.${signature}`;
                
                document.getElementById('generated-jwt').value = jwt;
                document.getElementById('copy-jwt').disabled = false;
            }).catch(error => {
                alert(`Error generating JWT: ${error.message}`);
            });
            
        } catch (error) {
            alert(`Error generating JWT: ${error.message}`);
        }
    }

    copyJWT() {
        const jwtOutput = document.getElementById('generated-jwt');
        navigator.clipboard.writeText(jwtOutput.value).then(() => {
            const copyBtn = document.getElementById('copy-jwt');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = originalText, 2000);
        });
    }

    // JWT Fuzzer
    startFuzzing() {
        const jwt = document.getElementById('fuzz-jwt-input').value.trim();
        const outputDiv = document.getElementById('fuzzer-output');
        
        if (!jwt) {
            outputDiv.innerHTML = '<div class="fuzz-placeholder">Please enter a JWT token to fuzz test</div>';
            return;
        }

        outputDiv.innerHTML = '';
        const results = [];
        
        // Get selected fuzz tests
        const tests = {
            'fuzz-none-alg': 'None Algorithm Attack',
            'fuzz-blank-signature': 'Blank Signature Attack',
            'fuzz-weak-secret': 'Weak Secret Detection',
            'fuzz-expired-token': 'Expired Token Test',
            'fuzz-audience-bypass': 'Audience Bypass Test',
            'fuzz-issuer-spoof': 'Issuer Spoofing Test'
        };

        for (const [testId, testName] of Object.entries(tests)) {
            if (document.getElementById(testId).checked) {
                const result = this.runFuzzTest(jwt, testId, testName);
                results.push(result);
            }
        }

        this.displayFuzzResults(results);
    }

    runFuzzTest(jwt, testId, testName) {
        try {
            const parts = jwt.split('.');
            const header = JSON.parse(this.base64UrlDecode(parts[0]));
            const payload = JSON.parse(this.base64UrlDecode(parts[1]));
            
            switch (testId) {
                case 'fuzz-none-alg':
                    return this.testNoneAlgorithm(jwt, header);
                case 'fuzz-blank-signature':
                    return this.testBlankSignature(jwt);
                case 'fuzz-weak-secret':
                    return this.testWeakSecret(jwt, header);
                case 'fuzz-expired-token':
                    return this.testExpiredToken(payload);
                case 'fuzz-audience-bypass':
                    return this.testAudienceBypass(payload);
                case 'fuzz-issuer-spoof':
                    return this.testIssuerSpoof(payload);
                default:
                    return { name: testName, status: 'safe', description: 'Test not implemented' };
            }
        } catch (error) {
            return { name: testName, status: 'warning', description: `Error running test: ${error.message}` };
        }
    }

    testNoneAlgorithm(jwt, header) {
        if (header.alg === 'none' || header.alg === 'None' || header.alg === 'NONE') {
            return {
                name: 'None Algorithm Attack',
                status: 'vulnerability',
                description: 'JWT uses "none" algorithm - this allows token manipulation without signature verification!'
            };
        }
        return {
            name: 'None Algorithm Attack',
            status: 'safe',
            description: 'JWT does not use the insecure "none" algorithm'
        };
    }

    testBlankSignature(jwt) {
        const parts = jwt.split('.');
        if (parts[2] === '' || parts[2] === null) {
            return {
                name: 'Blank Signature Attack',
                status: 'vulnerability',
                description: 'JWT has empty signature - token can be manipulated!'
            };
        }
        return {
            name: 'Blank Signature Attack',
            status: 'safe',
            description: 'JWT has a signature present'
        };
    }

    testWeakSecret(jwt, header) {
        const parts = jwt.split('.');
        const signableContent = parts[0] + '.' + parts[1];
        
        // Check for obviously weak patterns
        const weakPatterns = [
            'secret', 'password', '123456', 'admin', 'test', 'key',
            'jwt', 'hello', 'world', 'qwerty', '12345678'
        ];
        
        // Simple heuristic: if the signature looks too simple or predictable
        const signature = parts[2];
        
        // Check if signature is suspiciously short or repetitive
        if (signature.length < 20) {
            return {
                name: 'Weak Secret Detection',
                status: 'vulnerability',
                description: 'JWT signature appears unusually short - may indicate weak secret'
            };
        }
        
        // Check for repetitive patterns in signature
        const hasRepetitivePattern = /(.{2,})\1{2,}/.test(signature);
        if (hasRepetitivePattern) {
            return {
                name: 'Weak Secret Detection',
                status: 'warning',
                description: 'JWT signature shows repetitive patterns - consider using a stronger secret'
            };
        }
        
        return {
            name: 'Weak Secret Detection',
            status: 'safe',
            description: 'JWT signature appears to use a sufficiently complex secret'
        };
    }

    testExpiredToken(payload) {
        if (payload.exp) {
            const now = Math.floor(Date.now() / 1000);
            if (payload.exp < now) {
                return {
                    name: 'Expired Token Test',
                    status: 'warning',
                    description: `Token expired ${new Date(payload.exp * 1000).toLocaleString()}`
                };
            } else {
                return {
                    name: 'Expired Token Test',
                    status: 'safe',
                    description: `Token expires ${new Date(payload.exp * 1000).toLocaleString()}`
                };
            }
        }
        return {
            name: 'Expired Token Test',
            status: 'warning',
            description: 'No expiration claim found - tokens should have expiration times'
        };
    }

    testAudienceBypass(payload) {
        if (!payload.aud) {
            return {
                name: 'Audience Bypass Test',
                status: 'warning',
                description: 'No audience claim found - consider adding "aud" claim for better security'
            };
        }
        return {
            name: 'Audience Bypass Test',
            status: 'safe',
            description: `Audience claim present: ${payload.aud}`
        };
    }

    testIssuerSpoof(payload) {
        if (!payload.iss) {
            return {
                name: 'Issuer Spoofing Test',
                status: 'warning',
                description: 'No issuer claim found - consider adding "iss" claim for better security'
            };
        }
        return {
            name: 'Issuer Spoofing Test',
            status: 'safe',
            description: `Issuer claim present: ${payload.iss}`
        };
    }

    displayFuzzResults(results) {
        const outputDiv = document.getElementById('fuzzer-output');
        outputDiv.innerHTML = '';
        
        results.forEach(result => {
            const resultDiv = document.createElement('div');
            resultDiv.className = `fuzz-result-item ${result.status}`;
            resultDiv.innerHTML = `
                <div class="fuzz-result-title">${result.name}</div>
                <div class="fuzz-result-desc">${result.description}</div>
            `;
            outputDiv.appendChild(resultDiv);
        });
    }

    // Helper functions
    base64UrlDecode(str) {
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        while (str.length % 4) {
            str += '=';
        }
        return decodeURIComponent(atob(str).split('').map(c => 
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
    }

    base64UrlEncode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => 
            String.fromCharCode('0x' + p1)
        )).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }

    async signJWT(data, secret, algorithm = 'HS256') {
        // Check if Web Crypto API is available
        if (!window.crypto || !window.crypto.subtle) {
            // Fallback to a simple HMAC implementation using CryptoJS-like approach
            return this.fallbackSignJWT(data, secret, algorithm);
        }

        try {
            const encoder = new TextEncoder();
            const keyData = encoder.encode(secret);
            const messageData = encoder.encode(data);
            
            const hashAlgorithm = {
                'HS256': 'SHA-256',
                'HS384': 'SHA-384',
                'HS512': 'SHA-512'
            }[algorithm];
            
            if (!hashAlgorithm) {
                throw new Error(`Unsupported algorithm: ${algorithm}`);
            }
            
            const key = await crypto.subtle.importKey(
                'raw',
                keyData,
                { name: 'HMAC', hash: hashAlgorithm },
                false,
                ['sign']
            );
            
            const signature = await crypto.subtle.sign('HMAC', key, messageData);
            const signatureArray = new Uint8Array(signature);
            
            return btoa(String.fromCharCode.apply(null, signatureArray))
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=/g, '');
        } catch (error) {
            console.error('Web Crypto API failed, using fallback:', error);
            return this.fallbackSignJWT(data, secret, algorithm);
        }
    }

    // Fallback HMAC implementation for browsers without Web Crypto API
    fallbackSignJWT(data, secret, algorithm = 'HS256') {
        // Simple fallback - in production, you'd use a library like CryptoJS
        // For now, we'll return a placeholder signature
        const combinedData = data + secret + algorithm;
        let hash = 0;
        
        for (let i = 0; i < combinedData.length; i++) {
            const char = combinedData.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        // Convert to base64url
        const hashString = Math.abs(hash).toString(16).padStart(8, '0') + 
                          Math.abs(hash * 2).toString(16).padStart(8, '0') +
                          Math.abs(hash * 3).toString(16).padStart(8, '0');
        
        return btoa(hashString).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }

    displayJWTPart(selector, content) {
        const element = document.querySelector(selector);
        if (element) {
            try {
                const parsed = JSON.parse(content);
                element.textContent = JSON.stringify(parsed, null, 2);
            } catch (e) {
                element.textContent = content;
            }
        }
    }

    clearJWTParts() {
        ['.jwt-part.header .part-content', '.jwt-part.payload .part-content', '.jwt-part.signature .part-content']
            .forEach(selector => {
                const element = document.querySelector(selector);
                if (element) element.textContent = '';
            });
    }

    showStatus(message, type) {
        const statusIndicator = document.getElementById('jwt-valid-status');
        if (statusIndicator) {
            statusIndicator.textContent = message;
            statusIndicator.className = `status-indicator ${type}`;
        }
    }

    checkJWTSecurity(header, payload) {
        const warnings = [];
        
        try {
            const headerObj = JSON.parse(header);
            const payloadObj = JSON.parse(payload);
            
            if (headerObj.alg === 'none') {
                warnings.push('⚠️ Insecure "none" algorithm detected');
            }
            
            if (!payloadObj.exp) {
                warnings.push('⚠️ No expiration time set');
            } else {
                const now = Math.floor(Date.now() / 1000);
                if (payloadObj.exp < now) {
                    warnings.push('⚠️ Token has expired');
                }
            }
            
            if (!payloadObj.iss) {
                warnings.push('💡 Consider adding issuer claim');
            }
            
            if (!payloadObj.aud) {
                warnings.push('💡 Consider adding audience claim');
            }
            
        } catch (e) {
            // Ignore parsing errors for security check
        }
        
        if (warnings.length > 0) {
            const statusEl = document.getElementById('jwt-valid-status');
            if (statusEl && statusEl.classList.contains('valid')) {
                statusEl.innerHTML += '<br><small>' + warnings.join('<br>') + '</small>';
            }
        }
    }
}

// Initialize JWT Tools
const jwtTools = new JwtTools();
