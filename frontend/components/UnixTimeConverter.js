// Unix Time Converter Component
class UnixTimeConverter {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.startCurrentTimeUpdater();
    }

    initializeElements() {
        // Current time elements
        this.currentUnixSeconds = document.getElementById('current-unix-seconds');
        this.currentUnixMillis = document.getElementById('current-unix-millis');
        this.currentUnixDays = document.getElementById('current-unix-days');
        this.currentHumanTime = document.getElementById('current-human-time');
        
        // Custom days calculator elements
        this.customDate = document.getElementById('custom-date');
        this.customTime = document.getElementById('custom-time');
        this.calculateCustomDaysBtn = document.getElementById('calculate-custom-days');
        this.customDaysResult = document.getElementById('custom-days-result');
        
        // Unix to human converter elements
        this.unixInput = document.getElementById('unix-input');
        this.unixTimezone = document.getElementById('unix-timezone');
        this.convertUnixBtn = document.getElementById('convert-unix-btn');
        this.unixConvertResult = document.getElementById('unix-convert-result');
        
        // Human to unix converter elements
        this.humanDate = document.getElementById('human-date');
        this.humanTime = document.getElementById('human-time');
        this.humanTimezone = document.getElementById('human-timezone');
        this.convertHumanBtn = document.getElementById('convert-human-btn');
        this.humanConvertResult = document.getElementById('human-convert-result');
        
        // Quick action buttons
        this.copyCurrentUnix = document.getElementById('copy-current-unix');
        this.copyCurrentIso = document.getElementById('copy-current-iso');
        this.setNowBtn = document.getElementById('set-now-btn');
        this.clearAllBtn = document.getElementById('clear-all-btn');
        this.copyCurrentDays = document.getElementById('copy-current-days');
        
        // Batch converter elements
        this.batchInput = document.getElementById('batch-input');
        this.batchConvertBtn = document.getElementById('batch-convert-btn');
        this.batchResult = document.getElementById('batch-result');
    }

    bindEvents() {
        // Custom days calculator
        this.calculateCustomDaysBtn?.addEventListener('click', () => this.calculateCustomDays());
        
        // Unix to human converter
        this.convertUnixBtn?.addEventListener('click', () => this.convertUnixToHuman());
        
        // Human to unix converter
        this.convertHumanBtn?.addEventListener('click', () => this.convertHumanToUnix());
        
        // Quick action buttons
        this.copyCurrentUnix?.addEventListener('click', () => this.copyCurrentUnixTime());
        this.copyCurrentIso?.addEventListener('click', () => this.copyCurrentIsoTime());
        this.setNowBtn?.addEventListener('click', () => this.setToNow());
        this.clearAllBtn?.addEventListener('click', () => this.clearAll());
        this.copyCurrentDays?.addEventListener('click', () => this.copyCurrentDaysValue());
        
        // Batch converter
        this.batchConvertBtn?.addEventListener('click', () => this.batchConvert());
        
        // Auto-convert on input
        this.unixInput?.addEventListener('input', () => {
            if (this.unixInput.value) {
                this.convertUnixToHuman();
            }
        });
    }

    startCurrentTimeUpdater() {
        this.updateCurrentTime();
        setInterval(() => this.updateCurrentTime(), 1000);
    }

    updateCurrentTime() {
        const now = new Date();
        const unixSeconds = Math.floor(now.getTime() / 1000);
        const unixMillis = now.getTime();
        const unixDays = Math.floor(unixSeconds / 86400);
        
        if (this.currentUnixSeconds) this.currentUnixSeconds.textContent = unixSeconds.toLocaleString();
        if (this.currentUnixMillis) this.currentUnixMillis.textContent = unixMillis.toLocaleString();
        if (this.currentUnixDays) this.currentUnixDays.textContent = unixDays.toString();
        if (this.currentHumanTime) this.currentHumanTime.textContent = now.toISOString();
    }

    calculateCustomDays() {
        const dateValue = this.customDate.value;
        const timeValue = this.customTime.value || '00:00';
        
        if (!dateValue) {
            this.showResult(this.customDaysResult, 'Please select a date', 'error');
            return;
        }

        const datetime = new Date(`${dateValue}T${timeValue}:00.000Z`);
        const unixSeconds = Math.floor(datetime.getTime() / 1000);
        const unixDays = Math.floor(unixSeconds / 86400);
        
        const results = [
            { label: 'Selected Date', value: datetime.toISOString().split('T')[0] },
            { label: 'Unix Timestamp (seconds)', value: unixSeconds.toLocaleString() },
            { label: 'Days since Unix Epoch', value: unixDays.toString() },
            { label: 'ISO Format', value: datetime.toISOString() }
        ];
        
        this.showResultItems(this.customDaysResult, results);
    }

    convertUnixToHuman() {
        const unixValue = this.unixInput.value.trim();
        
        if (!unixValue) {
            this.clearResult(this.unixConvertResult);
            return;
        }

        let timestamp = parseInt(unixValue);
        
        // Auto-detect if it's milliseconds (if > year 2020 in seconds)
        if (timestamp > 1577836800000) {
            timestamp = Math.floor(timestamp / 1000);
        }
        
        const date = new Date(timestamp * 1000);
        
        if (isNaN(date.getTime())) {
            this.showResult(this.unixConvertResult, 'Invalid timestamp', 'error');
            return;
        }

        const timezone = this.unixTimezone.value;
        const results = [
            { label: 'Unix Timestamp', value: timestamp.toLocaleString() },
            { label: 'ISO Format', value: date.toISOString() },
            { label: 'Local Time', value: date.toLocaleString() },
            { label: 'UTC Time', value: date.toUTCString() },
            { label: 'Days since Epoch', value: Math.floor(timestamp / 86400).toString() }
        ];

        // Add timezone-specific time if not UTC or local
        if (timezone !== 'UTC' && timezone !== 'local') {
            try {
                const timeInZone = date.toLocaleString('en-US', { timeZone: timezone });
                results.push({ label: `Time in ${timezone}`, value: timeInZone });
            } catch (e) {
                console.warn('Invalid timezone:', timezone);
            }
        }
        
        this.showResultItems(this.unixConvertResult, results);
    }

    convertHumanToUnix() {
        const dateValue = this.humanDate.value;
        const timeValue = this.humanTime.value || '00:00:00';
        
        if (!dateValue) {
            this.showResult(this.humanConvertResult, 'Please select a date', 'error');
            return;
        }

        const datetime = new Date(`${dateValue}T${timeValue}`);
        
        if (isNaN(datetime.getTime())) {
            this.showResult(this.humanConvertResult, 'Invalid date/time', 'error');
            return;
        }

        const unixSeconds = Math.floor(datetime.getTime() / 1000);
        const unixMillis = datetime.getTime();
        const unixDays = Math.floor(unixSeconds / 86400);
        
        const results = [
            { label: 'Selected DateTime', value: `${dateValue} ${timeValue}` },
            { label: 'Unix Timestamp (seconds)', value: unixSeconds.toLocaleString() },
            { label: 'Unix Timestamp (milliseconds)', value: unixMillis.toLocaleString() },
            { label: 'Days since Epoch', value: unixDays.toString() },
            { label: 'ISO Format', value: datetime.toISOString() }
        ];
        
        this.showResultItems(this.humanConvertResult, results);
    }

    batchConvert() {
        const input = this.batchInput.value.trim();
        
        if (!input) {
            this.showResult(this.batchResult, 'Please enter timestamps to convert', 'error');
            return;
        }

        const timestamps = input.split('\n').filter(line => line.trim());
        const results = [];
        
        timestamps.forEach((timestamp, index) => {
            const trimmed = timestamp.trim();
            if (!trimmed) return;
            
            let unix = parseInt(trimmed);
            if (isNaN(unix)) {
                results.push(`Line ${index + 1}: Invalid timestamp - ${trimmed}`);
                return;
            }
            
            // Auto-detect milliseconds
            if (unix > 1577836800000) {
                unix = Math.floor(unix / 1000);
            }
            
            const date = new Date(unix * 1000);
            if (isNaN(date.getTime())) {
                results.push(`Line ${index + 1}: Invalid timestamp - ${trimmed}`);
                return;
            }
            
            results.push(`${unix} → ${date.toISOString()}`);
        });
        
        this.batchResult.innerHTML = results.map(result => 
            `<div class="batch-result-item">${result}</div>`
        ).join('');
    }

    copyCurrentUnixTime() {
        const unixSeconds = Math.floor(Date.now() / 1000);
        this.copyToClipboard(unixSeconds.toString());
    }

    copyCurrentIsoTime() {
        const isoTime = new Date().toISOString();
        this.copyToClipboard(isoTime);
    }

    copyCurrentDaysValue() {
        const unixDays = Math.floor(Date.now() / 1000 / 86400);
        this.copyToClipboard(unixDays.toString());
    }

    setToNow() {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().split(' ')[0];
        
        if (this.humanDate) this.humanDate.value = dateStr;
        if (this.humanTime) this.humanTime.value = timeStr;
        if (this.customDate) this.customDate.value = dateStr;
        if (this.customTime) this.customTime.value = timeStr.substring(0, 5);
        
        // Auto-convert
        this.convertHumanToUnix();
        this.calculateCustomDays();
    }

    clearAll() {
        // Clear inputs
        if (this.unixInput) this.unixInput.value = '';
        if (this.humanDate) this.humanDate.value = '';
        if (this.humanTime) this.humanTime.value = '';
        if (this.customDate) this.customDate.value = '';
        if (this.customTime) this.customTime.value = '00:00';
        if (this.batchInput) this.batchInput.value = '';
        
        // Clear results
        this.clearResult(this.unixConvertResult);
        this.clearResult(this.humanConvertResult);
        this.clearResult(this.customDaysResult);
        if (this.batchResult) this.batchResult.innerHTML = '';
    }

    showResult(container, message, type = 'info') {
        if (!container) return;
        
        container.innerHTML = `
            <div class="result-item result-${type}">
                <span class="result-value">${message}</span>
            </div>
        `;
    }

    showResultItems(container, items) {
        if (!container) return;
        
        container.innerHTML = items.map(item => `
            <div class="result-item">
                <span class="result-label">${item.label}:</span>
                <span class="result-value">${item.value}</span>
                <button class="copy-item-btn" onclick="window.copyToClipboardFallback('${item.value}')">Copy</button>
            </div>
        `).join('');
    }

    clearResult(container) {
        if (container) container.innerHTML = '';
    }

    copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                console.log('Copied to clipboard:', text);
                this.showCopySuccess();
            }).catch(err => {
                console.error('Failed to copy with clipboard API:', err);
                this.fallbackCopyToClipboard(text);
            });
        } else {
            this.fallbackCopyToClipboard(text);
        }
    }

    fallbackCopyToClipboard(text) {
        // Fallback method using textarea
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
                console.log('Copied to clipboard (fallback):', text);
                this.showCopySuccess();
            } else {
                console.error('Failed to copy text');
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
        } finally {
            document.body.removeChild(textArea);
        }
    }

    showCopySuccess() {
        // Could add visual feedback here
        // For now, just log
    }
}

// Global fallback copy function for inline onclick handlers
window.copyToClipboardFallback = function(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard:', text);
        }).catch(err => {
            console.error('Failed to copy with clipboard API:', err);
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
    
    function fallbackCopy(text) {
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
                console.log('Copied to clipboard (fallback):', text);
            } else {
                console.error('Failed to copy text');
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
        } finally {
            document.body.removeChild(textArea);
        }
    }
};

// Initialize Unix Time Converter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure all elements are available
    setTimeout(() => {
        new UnixTimeConverter();
    }, 100);
});
