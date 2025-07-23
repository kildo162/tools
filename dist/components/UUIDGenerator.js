// UUIDGenerator Component
window.UUIDGenerator = {
    init() {
        const content = `
            <div class="uuid-generator">
                <div class="section-header">
                    <h2>UUID Generator</h2>
                    <p>Generate universally unique identifiers (UUIDs) in various formats</p>
                </div>
                
                <div class="controls">
                    <div class="control-group">
                        <label for="uuid-version">UUID Version:</label>
                        <select id="uuid-version">
                            <option value="4" selected>Version 4 (Random)</option>
                            <option value="1">Version 1 (Timestamp)</option>
                        </select>
                    </div>
                    
                    <div class="control-group">
                        <label for="uuid-count">Number of UUIDs:</label>
                        <input type="number" id="uuid-count" value="1" min="1" max="100">
                    </div>
                    
                    <button onclick="UUIDGenerator.generate()" class="btn btn-primary">Generate UUID</button>
                </div>
                
                <div class="output">
                    <label for="uuid-output">Generated UUIDs:</label>
                    <textarea id="uuid-output" readonly rows="10" placeholder="Generated UUIDs will appear here..."></textarea>
                    <div class="actions">
                        <button onclick="UUIDGenerator.copyToClipboard()" class="btn btn-secondary">Copy to Clipboard</button>
                        <button onclick="UUIDGenerator.clear()" class="btn btn-secondary">Clear</button>
                    </div>
                </div>
            </div>
        `;
        
        return content;
    },
    
    generate() {
        const version = document.getElementById('uuid-version').value;
        const count = parseInt(document.getElementById('uuid-count').value) || 1;
        const output = document.getElementById('uuid-output');
        
        const uuids = [];
        
        for (let i = 0; i < count; i++) {
            if (version === '4') {
                uuids.push(this.generateUUIDv4());
            } else if (version === '1') {
                uuids.push(this.generateUUIDv1());
            }
        }
        
        output.value = uuids.join('\n');
    },
    
    generateUUIDv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    
    generateUUIDv1() {
        // Simplified UUID v1 implementation
        const timestamp = Date.now();
        const random = Math.random().toString(16).substring(2);
        const clockSeq = Math.random().toString(16).substring(2, 6);
        const node = Math.random().toString(16).substring(2, 14);
        
        const timeLow = (timestamp & 0xffffffff).toString(16).padStart(8, '0');
        const timeMid = ((timestamp >>> 32) & 0xffff).toString(16).padStart(4, '0');
        const timeHi = (((timestamp >>> 48) & 0x0fff) | 0x1000).toString(16).padStart(4, '0');
        
        return `${timeLow}-${timeMid}-${timeHi}-${clockSeq}-${node}`;
    },
    
    copyToClipboard() {
        const output = document.getElementById('uuid-output');
        if (output.value) {
            output.select();
            document.execCommand('copy');
            this.showNotification('UUIDs copied to clipboard!');
        }
    },
    
    clear() {
        document.getElementById('uuid-output').value = '';
    },
    
    showNotification(message) {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 1000;
            font-size: 14px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 2000);
    }
};
