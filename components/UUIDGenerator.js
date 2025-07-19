// UUID Generator Component
class UUIDGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.generateUUIDs();
    }

    initializeElements() {
        // Version selection
        this.versionSelect = document.getElementById('uuid-version');
        
        // Number of UUIDs
        this.countSlider = document.getElementById('uuid-count');
        this.countDisplay = document.getElementById('uuid-count-display');
        
        // Namespace and name for v5 (name-based)
        this.namespaceSelect = document.getElementById('uuid-namespace');
        this.nameInput = document.getElementById('uuid-name');
        this.v5Section = document.getElementById('uuid-v5-section');
        
        // Generate button and output
        this.generateBtn = document.getElementById('generate-uuids-btn');
        this.uuidOutput = document.getElementById('uuid-output');
        this.copyAllBtn = document.getElementById('copy-all-uuids-btn');
        
        // Statistics
        this.statsContainer = document.getElementById('uuid-stats');
        
        // Predefined namespaces for UUID v5
        this.predefinedNamespaces = {
            'dns': '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
            'url': '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
            'oid': '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
            'x500': '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
            'custom': ''
        };
    }

    bindEvents() {
        // Version change
        this.versionSelect?.addEventListener('change', () => {
            this.updateVersionUI();
            this.generateUUIDs();
        });
        
        // Count slider
        this.countSlider?.addEventListener('input', () => {
            this.updateCountDisplay();
            this.generateUUIDs();
        });
        
        // v5 specific inputs
        this.namespaceSelect?.addEventListener('change', () => {
            this.updateNamespaceUI();
            this.generateUUIDs();
        });
        
        this.nameInput?.addEventListener('input', () => {
            if (this.versionSelect?.value === 'v5') {
                this.generateUUIDs();
            }
        });
        
        // Generate button
        this.generateBtn?.addEventListener('click', () => this.generateUUIDs());
        
        // Copy all button
        this.copyAllBtn?.addEventListener('click', () => this.copyAllUUIDs());
        
        // Initialize UI
        this.updateVersionUI();
        this.updateCountDisplay();
    }

    updateVersionUI() {
        const version = this.versionSelect?.value || 'v4';
        
        if (this.v5Section) {
            this.v5Section.style.display = version === 'v5' ? 'block' : 'none';
        }
        
        this.updateVersionInfo(version);
    }

    updateVersionInfo(version) {
        const versionInfo = document.getElementById('version-info');
        if (!versionInfo) return;
        
        const info = {
            'v1': {
                name: 'Version 1 (Time-based)',
                description: 'Based on timestamp and MAC address. Contains time and node information.',
                security: 'Lower privacy - contains MAC address and timestamp'
            },
            'v4': {
                name: 'Version 4 (Random)',
                description: 'Based on random or pseudo-random numbers. Most commonly used.',
                security: 'High security - cryptographically random'
            },
            'v5': {
                name: 'Version 5 (Name-based)',
                description: 'Generated from a namespace and name using SHA-1 hash.',
                security: 'Deterministic - same namespace+name = same UUID'
            }
        };
        
        const versionData = info[version] || info['v4'];
        
        versionInfo.innerHTML = `
            <div class="version-info-content">
                <h4>${versionData.name}</h4>
                <p><strong>Description:</strong> ${versionData.description}</p>
                <p><strong>Security:</strong> ${versionData.security}</p>
            </div>
        `;
    }

    updateCountDisplay() {
        const count = this.countSlider?.value || 5;
        if (this.countDisplay) {
            this.countDisplay.textContent = count;
        }
    }

    updateNamespaceUI() {
        const namespace = this.namespaceSelect?.value || 'dns';
        const customInput = document.getElementById('custom-namespace');
        
        if (customInput) {
            customInput.style.display = namespace === 'custom' ? 'block' : 'none';
        }
    }

    // Generate UUID v1 (time-based)
    generateUUIDv1() {
        // Simplified UUID v1 implementation
        const now = new Date().getTime();
        const clockSeq = Math.floor(Math.random() * 16384);
        
        // Convert timestamp to UUID format (100-nanosecond intervals since 1582-10-15)
        const uuidTime = (now * 10000) + 0x01B21DD213814000;
        
        const timeLow = (uuidTime & 0xffffffff).toString(16).padStart(8, '0');
        const timeMid = ((uuidTime >> 32) & 0xffff).toString(16).padStart(4, '0');
        const timeHigh = (((uuidTime >> 48) & 0x0fff) | 0x1000).toString(16).padStart(4, '0');
        
        const clockSeqHigh = ((clockSeq >> 8) | 0x80).toString(16).padStart(2, '0');
        const clockSeqLow = (clockSeq & 0xff).toString(16).padStart(2, '0');
        
        // Generate random node (MAC address simulation)
        const node = Array.from({length: 6}, () => 
            Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
        ).join('');
        
        return `${timeLow}-${timeMid}-${timeHigh}-${clockSeqHigh}${clockSeqLow}-${node}`;
    }

    // Generate UUID v4 (random)
    generateUUIDv4() {
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

    // Simplified SHA-1 hash for UUID v5
    async sha1(data) {
        if (window.crypto && window.crypto.subtle) {
            const encoder = new TextEncoder();
            const dataBuffer = encoder.encode(data);
            const hashBuffer = await crypto.subtle.digest('SHA-1', dataBuffer);
            return new Uint8Array(hashBuffer);
        } else {
            // Fallback: very basic hash (not cryptographically secure)
            let hash = 0;
            for (let i = 0; i < data.length; i++) {
                const char = data.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            
            // Convert to bytes array (16 bytes)
            const bytes = new Uint8Array(16);
            for (let i = 0; i < 16; i++) {
                bytes[i] = (hash >> (i * 2)) & 0xff;
            }
            return bytes;
        }
    }

    // Generate UUID v5 (name-based)
    async generateUUIDv5(namespace, name) {
        if (!name || !namespace) {
            return this.generateUUIDv4(); // Fallback to v4
        }
        
        // Convert namespace UUID to bytes
        const nsBytes = this.uuidToBytes(namespace);
        const nameBytes = new TextEncoder().encode(name);
        
        // Combine namespace and name
        const combined = new Uint8Array(nsBytes.length + nameBytes.length);
        combined.set(nsBytes, 0);
        combined.set(nameBytes, nsBytes.length);
        
        // Generate hash
        const hashBytes = await this.sha1(String.fromCharCode.apply(null, combined));
        
        // Set version (5) and variant bits
        hashBytes[6] = (hashBytes[6] & 0x0f) | 0x50; // Version 5
        hashBytes[8] = (hashBytes[8] & 0x3f) | 0x80; // Variant 10
        
        // Convert to UUID format
        const hex = Array.from(hashBytes.slice(0, 16))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        
        return `${hex.substr(0, 8)}-${hex.substr(8, 4)}-${hex.substr(12, 4)}-${hex.substr(16, 4)}-${hex.substr(20, 12)}`;
    }

    uuidToBytes(uuid) {
        const hex = uuid.replace(/-/g, '');
        const bytes = new Uint8Array(16);
        for (let i = 0; i < 32; i += 2) {
            bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return bytes;
    }

    async generateUUIDs() {
        const version = this.versionSelect?.value || 'v4';
        const count = parseInt(this.countSlider?.value || 5);
        const uuids = [];
        
        for (let i = 0; i < count; i++) {
            let uuid = '';
            
            switch (version) {
                case 'v1':
                    uuid = this.generateUUIDv1();
                    break;
                case 'v4':
                    uuid = this.generateUUIDv4();
                    break;
                case 'v5':
                    const namespace = this.getNamespaceUUID();
                    const name = this.nameInput?.value || `name-${i}`;
                    uuid = await this.generateUUIDv5(namespace, name);
                    break;
                default:
                    uuid = this.generateUUIDv4();
            }
            
            uuids.push(uuid);
        }
        
        this.displayUUIDs(uuids, version);
        this.updateStatistics(uuids, version);
    }

    getNamespaceUUID() {
        const selected = this.namespaceSelect?.value || 'dns';
        if (selected === 'custom') {
            const customInput = document.getElementById('custom-namespace');
            return customInput?.value || this.predefinedNamespaces.dns;
        }
        return this.predefinedNamespaces[selected] || this.predefinedNamespaces.dns;
    }

    displayUUIDs(uuids, version) {
        if (!this.uuidOutput) return;
        
        this.uuidOutput.innerHTML = uuids.map((uuid, index) => `
            <div class="uuid-item">
                <div class="uuid-header">
                    <span class="uuid-number">${index + 1}.</span>
                    <span class="uuid-version">UUID ${version.toUpperCase()}</span>
                    <button class="btn-small copy-uuid-btn" onclick="window.copyToClipboardFallback('${uuid}')">📋 Copy</button>
                </div>
                <code class="uuid-value">${uuid}</code>
            </div>
        `).join('');
    }

    updateStatistics(uuids, version) {
        if (!this.statsContainer) return;
        
        const uniqueUUIDs = new Set(uuids).size;
        const duplicates = uuids.length - uniqueUUIDs;
        
        this.statsContainer.innerHTML = `
            <div class="uuid-stats-section">
                <h4>Generation Statistics</h4>
                <div class="stats-grid">
                    <div class="stat-item">
                        <label>Version:</label>
                        <span>UUID ${version.toUpperCase()}</span>
                    </div>
                    <div class="stat-item">
                        <label>Generated:</label>
                        <span>${uuids.length} UUIDs</span>
                    </div>
                    <div class="stat-item">
                        <label>Unique:</label>
                        <span>${uniqueUUIDs} UUIDs</span>
                    </div>
                    <div class="stat-item">
                        <label>Duplicates:</label>
                        <span>${duplicates} ${duplicates > 0 ? '(unusual for random UUIDs)' : ''}</span>
                    </div>
                </div>
            </div>
        `;
    }

    copyAllUUIDs() {
        const uuidElements = document.querySelectorAll('.uuid-value');
        if (!uuidElements.length) {
            this.showError('No UUIDs to copy');
            return;
        }
        
        const allUUIDs = Array.from(uuidElements)
            .map(el => el.textContent)
            .join('\n');
        
        this.copyToClipboard(allUUIDs, `Copied ${uuidElements.length} UUIDs to clipboard!`);
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        let messageEl = document.getElementById('uuid-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'uuid-message';
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

// Initialize UUID Generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new UUIDGenerator();
    }, 100);
});
