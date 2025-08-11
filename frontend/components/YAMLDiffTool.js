// YAML Diff Tool Component
class YAMLDiffTool {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        // Input elements
        this.input1 = document.getElementById('yaml-diff-input-1');
        this.input2 = document.getElementById('yaml-diff-input-2');
        
        // File inputs
        this.fileInput1 = document.getElementById('yaml-diff-file-1');
        this.fileInput2 = document.getElementById('yaml-diff-file-2');
        
        // Control buttons
        this.loadBtn1 = document.getElementById('yaml-diff-load-1');
        this.loadBtn2 = document.getElementById('yaml-diff-load-2');
        this.sampleBtn1 = document.getElementById('yaml-diff-sample-1');
        this.sampleBtn2 = document.getElementById('yaml-diff-sample-2');
        this.clearBtn1 = document.getElementById('yaml-diff-clear-1');
        this.clearBtn2 = document.getElementById('yaml-diff-clear-2');
        
        // Action buttons
        this.compareBtn = document.getElementById('yaml-diff-compare');
        this.clearAllBtn = document.getElementById('yaml-diff-clear-all');
        this.swapBtn = document.getElementById('yaml-diff-swap');
        this.exportBtn = document.getElementById('yaml-diff-export');
        this.copyBtn = document.getElementById('yaml-diff-copy');
        
        // Options
        this.ignoreCaseCheckbox = document.getElementById('yaml-diff-ignore-case');
        this.ignoreWhitespaceCheckbox = document.getElementById('yaml-diff-ignore-whitespace');
        this.sortKeysCheckbox = document.getElementById('yaml-diff-sort-keys');
        
        // Result elements
        this.resultContent = document.getElementById('yaml-diff-result');
        this.statsElement = document.getElementById('yaml-diff-stats');
        
        this.lastComparisonResult = null;
    }

    bindEvents() {
        // File loading events
        this.loadBtn1?.addEventListener('click', () => this.fileInput1.click());
        this.loadBtn2?.addEventListener('click', () => this.fileInput2.click());
        this.fileInput1?.addEventListener('change', (e) => this.handleFileLoad(e, this.input1));
        this.fileInput2?.addEventListener('change', (e) => this.handleFileLoad(e, this.input2));
        
        // Sample loading events
        this.sampleBtn1?.addEventListener('click', () => this.loadSample(1));
        this.sampleBtn2?.addEventListener('click', () => this.loadSample(2));
        
        // Clear events
        this.clearBtn1?.addEventListener('click', () => this.clearInput(1));
        this.clearBtn2?.addEventListener('click', () => this.clearInput(2));
        this.clearAllBtn?.addEventListener('click', () => this.clearAll());
        
        // Action events
        this.compareBtn?.addEventListener('click', () => this.compareYAML());
        this.swapBtn?.addEventListener('click', () => this.swapInputs());
        this.exportBtn?.addEventListener('click', () => this.exportResults());
        this.copyBtn?.addEventListener('click', () => this.copyResults());
        
        // Auto-compare on input change (debounced)
        if (this.input1 && this.input2) {
            let debounceTimer;
            const debounceCompare = () => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => this.compareYAML(), 500);
            };
            
            this.input1.addEventListener('input', debounceCompare);
            this.input2.addEventListener('input', debounceCompare);
            this.ignoreCaseCheckbox?.addEventListener('change', debounceCompare);
            this.ignoreWhitespaceCheckbox?.addEventListener('change', debounceCompare);
            this.sortKeysCheckbox?.addEventListener('change', debounceCompare);
        }
    }

    async handleFileLoad(event, targetInput) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            targetInput.value = text;
            this.compareYAML();
        } catch (error) {
            this.showError(`Failed to load file: ${error.message}`);
        }
    }

    loadSample(inputNumber) {
        const samples = {
            1: {
                original: `# Application Configuration
app:
  name: "My Application"
  version: "1.0.0"
  debug: false
  
database:
  host: "localhost"
  port: 5432
  name: "myapp_db"
  user: "admin"
  
features:
  - authentication
  - logging
  
settings:
  timeout: 30
  retries: 3`,
                modified: `# Application Configuration
app:
  name: "My Application"
  version: "2.0.0"
  debug: true
  environment: "production"
  
database:
  host: "db.example.com"
  port: 5432
  name: "myapp_production"
  user: "admin"
  ssl: true
  
features:
  - authentication
  - logging
  - monitoring
  - caching
  
settings:
  timeout: 60
  retries: 5
  cache_ttl: 300`
            }
        };

        const sample = samples[1];
        this.input1.value = sample.original;
        this.input2.value = sample.modified;
        this.compareYAML();
    }

    clearInput(inputNumber) {
        if (inputNumber === 1) {
            this.input1.value = '';
        } else if (inputNumber === 2) {
            this.input2.value = '';
        }
        this.compareYAML();
    }

    clearAll() {
        this.input1.value = '';
        this.input2.value = '';
        this.resultContent.innerHTML = '<div class="diff-placeholder"><span>📋 Compare two YAML documents to see differences</span></div>';
        this.statsElement.innerHTML = '';
        this.lastComparisonResult = null;
    }

    swapInputs() {
        const temp = this.input1.value;
        this.input1.value = this.input2.value;
        this.input2.value = temp;
        this.compareYAML();
    }

    compareYAML() {
        const yaml1 = this.input1.value.trim();
        const yaml2 = this.input2.value.trim();

        if (!yaml1 && !yaml2) {
            this.clearResults();
            return;
        }

        if (!yaml1 || !yaml2) {
            this.showError('Please provide both YAML documents to compare');
            return;
        }

        try {
            const obj1 = this.parseYAML(yaml1);
            const obj2 = this.parseYAML(yaml2);

            // Apply options
            const options = {
                ignoreCase: this.ignoreCaseCheckbox?.checked || false,
                ignoreWhitespace: this.ignoreWhitespaceCheckbox?.checked || false,
                sortKeys: this.sortKeysCheckbox?.checked || false
            };

            let processedObj1 = this.preprocessObject(obj1, options);
            let processedObj2 = this.preprocessObject(obj2, options);

            const diff = this.deepCompare(processedObj1, processedObj2);
            this.displayResults(diff, obj1, obj2, yaml1, yaml2);

        } catch (error) {
            this.showError(`Invalid YAML: ${error.message}`);
        }
    }

    parseYAML(yamlString) {
        // Simple YAML parser for basic structures
        // This is a simplified parser - in a real application you'd use a library like js-yaml
        try {
            const lines = yamlString.split('\n');
            const result = {};
            const stack = [{ obj: result, indent: -1 }];
            
            for (let line of lines) {
                line = line.replace(/\r$/, ''); // Remove carriage return
                
                // Skip empty lines and comments
                if (!line.trim() || line.trim().startsWith('#')) continue;
                
                const indent = line.length - line.trimStart().length;
                const trimmedLine = line.trim();
                
                // Pop from stack if we've decreased indentation
                while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
                    stack.pop();
                }
                
                const current = stack[stack.length - 1].obj;
                
                if (trimmedLine.startsWith('- ')) {
                    // Array item
                    const value = trimmedLine.substring(2).trim();
                    if (!Array.isArray(current)) {
                        // This shouldn't happen in well-formed YAML, but handle it
                        continue;
                    }
                    current.push(this.parseValue(value));
                } else if (trimmedLine.includes(':')) {
                    // Key-value pair
                    const [key, ...valueParts] = trimmedLine.split(':');
                    const keyTrimmed = key.trim().replace(/['"]/g, '');
                    const valueString = valueParts.join(':').trim();
                    
                    if (valueString === '') {
                        // This key will have nested values
                        current[keyTrimmed] = {};
                        stack.push({ obj: current[keyTrimmed], indent });
                    } else if (valueString === '[]' || valueString === '-') {
                        // Empty array or array indicator
                        current[keyTrimmed] = [];
                        stack.push({ obj: current[keyTrimmed], indent });
                    } else {
                        // Simple value
                        current[keyTrimmed] = this.parseValue(valueString);
                    }
                }
            }
            
            return result;
        } catch (error) {
            throw new Error(`YAML parsing error: ${error.message}`);
        }
    }

    parseValue(value) {
        value = value.trim();
        
        // Remove quotes
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
            return value.slice(1, -1);
        }
        
        // Boolean values
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (value === 'null' || value === '~') return null;
        
        // Numbers
        if (/^-?\d+(\.\d+)?$/.test(value)) {
            return value.includes('.') ? parseFloat(value) : parseInt(value);
        }
        
        return value;
    }

    preprocessObject(obj, options) {
        if (options.sortKeys) {
            obj = this.sortObjectKeys(obj);
        }
        
        if (options.ignoreCase || options.ignoreWhitespace) {
            obj = this.preprocessStringValues(obj, options);
        }
        
        return obj;
    }

    preprocessStringValues(obj, options) {
        if (Array.isArray(obj)) {
            return obj.map(item => this.preprocessStringValues(item, options));
        } else if (obj !== null && typeof obj === 'object') {
            const processed = {};
            for (const [key, value] of Object.entries(obj)) {
                processed[key] = this.preprocessStringValues(value, options);
            }
            return processed;
        } else if (typeof obj === 'string') {
            let processed = obj;
            if (options.ignoreWhitespace) {
                processed = processed.replace(/\s+/g, ' ').trim();
            }
            if (options.ignoreCase) {
                processed = processed.toLowerCase();
            }
            return processed;
        }
        return obj;
    }

    sortObjectKeys(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => this.sortObjectKeys(item));
        } else if (obj !== null && typeof obj === 'object') {
            const sorted = {};
            Object.keys(obj).sort().forEach(key => {
                sorted[key] = this.sortObjectKeys(obj[key]);
            });
            return sorted;
        }
        return obj;
    }

    deepCompare(obj1, obj2, path = '') {
        const differences = [];

        const allKeys = new Set([
            ...Object.keys(obj1 || {}),
            ...Object.keys(obj2 || {})
        ]);

        for (const key of allKeys) {
            const currentPath = path ? `${path}.${key}` : key;
            const val1 = obj1?.[key];
            const val2 = obj2?.[key];

            if (!(key in (obj1 || {}))) {
                differences.push({
                    type: 'added',
                    path: currentPath,
                    value: val2
                });
            } else if (!(key in (obj2 || {}))) {
                differences.push({
                    type: 'removed',
                    path: currentPath,
                    value: val1
                });
            } else if (typeof val1 === 'object' && val1 !== null && 
                      typeof val2 === 'object' && val2 !== null &&
                      !Array.isArray(val1) && !Array.isArray(val2)) {
                const nestedDiff = this.deepCompare(val1, val2, currentPath);
                differences.push(...nestedDiff);
            } else if (JSON.stringify(val1) !== JSON.stringify(val2)) {
                differences.push({
                    type: 'modified',
                    path: currentPath,
                    oldValue: val1,
                    newValue: val2
                });
            }
        }

        return differences;
    }

    displayResults(differences, obj1, obj2, yaml1, yaml2) {
        if (differences.length === 0) {
            this.showNoChanges();
            return;
        }

        const stats = {
            added: differences.filter(d => d.type === 'added').length,
            removed: differences.filter(d => d.type === 'removed').length,
            modified: differences.filter(d => d.type === 'modified').length
        };

        this.updateStats(stats);

        const summary = this.createSummary(stats);
        const diffLines = differences.map(diff => this.formatDifference(diff)).join('\n');

        this.resultContent.innerHTML = summary + '<pre>' + diffLines + '</pre>';
        this.lastComparisonResult = { differences, stats, obj1, obj2, yaml1, yaml2 };
    }

    createSummary(stats) {
        const total = stats.added + stats.removed + stats.modified;
        return `
            <div class="diff-summary">
                <h4>📊 Comparison Summary</h4>
                <div class="diff-summary-stats">
                    <div class="diff-stat added">
                        <span>Added:</span>
                        <strong>${stats.added}</strong>
                    </div>
                    <div class="diff-stat removed">
                        <span>Removed:</span>
                        <strong>${stats.removed}</strong>
                    </div>
                    <div class="diff-stat modified">
                        <span>Modified:</span>
                        <strong>${stats.modified}</strong>
                    </div>
                    <div class="diff-stat">
                        <span>Total Changes:</span>
                        <strong>${total}</strong>
                    </div>
                </div>
            </div>
        `;
    }

    formatDifference(diff) {
        switch (diff.type) {
            case 'added':
                return `<span class="diff-line added">+ ${diff.path}: ${this.formatValue(diff.value)}</span>`;
            case 'removed':
                return `<span class="diff-line removed">- ${diff.path}: ${this.formatValue(diff.value)}</span>`;
            case 'modified':
                return `<span class="diff-line removed">- ${diff.path}: ${this.formatValue(diff.oldValue)}</span>\n<span class="diff-line added">+ ${diff.path}: ${this.formatValue(diff.newValue)}</span>`;
            default:
                return '';
        }
    }

    formatValue(value) {
        if (typeof value === 'string') {
            return `"${value}"`;
        } else if (Array.isArray(value)) {
            return `[${value.map(v => this.formatValue(v)).join(', ')}]`;
        } else if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value);
        }
        return String(value);
    }

    updateStats(stats) {
        const total = stats.added + stats.removed + stats.modified;
        this.statsElement.innerHTML = `
            <span class="diff-stat added">${stats.added} added</span>
            <span class="diff-stat removed">${stats.removed} removed</span>
            <span class="diff-stat modified">${stats.modified} modified</span>
            <span class="diff-stat">${total} total</span>
        `;
    }

    showNoChanges() {
        this.resultContent.innerHTML = '<div class="diff-no-changes">✅ No differences found! The YAML documents are identical.</div>';
        this.statsElement.innerHTML = '<span class="diff-stat">0 differences</span>';
        this.lastComparisonResult = { differences: [], stats: { added: 0, removed: 0, modified: 0 }, obj1: null, obj2: null };
    }

    showError(message) {
        this.resultContent.innerHTML = `<div class="diff-error">❌ Error: ${message}</div>`;
        this.statsElement.innerHTML = '<span class="diff-stat">Error</span>';
        this.lastComparisonResult = null;
    }

    clearResults() {
        this.resultContent.innerHTML = '<div class="diff-placeholder"><span>📋 Compare two YAML documents to see differences</span></div>';
        this.statsElement.innerHTML = '';
        this.lastComparisonResult = null;
    }

    exportResults() {
        if (!this.lastComparisonResult || this.lastComparisonResult.differences.length === 0) {
            alert('No comparison results to export');
            return;
        }

        const { differences, stats } = this.lastComparisonResult;
        const exportData = {
            timestamp: new Date().toISOString(),
            type: 'yaml-diff',
            summary: stats,
            differences: differences
        };

        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `yaml-diff-${new Date().toISOString().slice(0, 19)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async copyResults() {
        if (!this.lastComparisonResult || this.lastComparisonResult.differences.length === 0) {
            alert('No comparison results to copy');
            return;
        }

        const text = this.resultContent.textContent;
        try {
            await navigator.clipboard.writeText(text);
            this.copyBtn.textContent = '✅ Copied!';
            setTimeout(() => {
                this.copyBtn.textContent = '📋 Copy';
            }, 2000);
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            this.copyBtn.textContent = '✅ Copied!';
            setTimeout(() => {
                this.copyBtn.textContent = '📋 Copy';
            }, 2000);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('yaml-diff-tool')) {
        window.yamlDiffTool = new YAMLDiffTool();
    }
});
