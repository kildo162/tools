// Enhanced JSON Formatter Component
class JSONFormatter {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.loadSampleData();
    }

    initializeElements() {
        // Input/Output elements
        this.jsonInput = document.getElementById('json-input');
        this.jsonOutput = document.getElementById('json-output');
        this.validationStatus = document.getElementById('validation-status');
        this.jsonStats = document.getElementById('json-stats');
        this.jsonSizeInfo = document.getElementById('json-size-info');
        
        // Options
        this.indentSize = document.getElementById('indent-size');
        this.sortKeys = document.getElementById('sort-keys');
        this.compactArrays = document.getElementById('compact-arrays');
        this.escapeUnicode = document.getElementById('escape-unicode');
        
        // Buttons
        this.formatBtn = document.getElementById('format-json');
        this.minifyBtn = document.getElementById('minify-json');
        this.validateBtn = document.getElementById('validate-json');
        this.escapeBtn = document.getElementById('escape-json');
        this.copyBtn = document.getElementById('copy-json');
        this.clearBtn = document.getElementById('clear-json');
        this.downloadBtn = document.getElementById('download-json');
        this.sampleBtn = document.getElementById('sample-json');
        this.loadFileBtn = document.getElementById('load-json-file');
        this.jsonFileInput = document.getElementById('json-file-input');
        
        // Path Explorer
        this.pathInput = document.getElementById('json-path-input');
        this.extractPathBtn = document.getElementById('extract-path');
        this.pathResult = document.getElementById('path-result');
        
        // Schema Validation
        this.schemaInput = document.getElementById('json-schema-input');
        this.validateSchemaBtn = document.getElementById('validate-schema');
        this.schemaResult = document.getElementById('schema-result');
        
        // Conversion
        this.jsonToCsvBtn = document.getElementById('json-to-csv');
        this.jsonToYamlBtn = document.getElementById('json-to-yaml');
        this.jsonToXmlBtn = document.getElementById('json-to-xml');
        this.csvToJsonBtn = document.getElementById('csv-to-json');
        this.conversionResult = document.getElementById('conversion-result');
    }

    bindEvents() {
        // Main actions
        this.formatBtn?.addEventListener('click', () => this.formatJSON(false));
        this.minifyBtn?.addEventListener('click', () => this.formatJSON(true));
        this.validateBtn?.addEventListener('click', () => this.validateJSON());
        this.escapeBtn?.addEventListener('click', () => this.escapeJSON());
        
        // File operations
        this.copyBtn?.addEventListener('click', () => this.copyToClipboard());
        this.clearBtn?.addEventListener('click', () => this.clearAll());
        this.downloadBtn?.addEventListener('click', () => this.downloadJSON());
        this.sampleBtn?.addEventListener('click', () => this.loadSampleJSON());
        this.loadFileBtn?.addEventListener('click', () => this.jsonFileInput?.click());
        this.jsonFileInput?.addEventListener('change', (e) => this.loadFileFromInput(e));
        
        // Auto-format with debounce
        let timeout;
        this.jsonInput?.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                this.updateStats();
                if (this.jsonInput.value.trim()) {
                    this.validateJSON();
                }
            }, 300);
        });
        
        // Options change handlers
        this.indentSize?.addEventListener('change', () => this.formatJSON(false));
        this.sortKeys?.addEventListener('change', () => this.formatJSON(false));
        this.compactArrays?.addEventListener('change', () => this.formatJSON(false));
        this.escapeUnicode?.addEventListener('change', () => this.formatJSON(false));
        
        // Path Explorer
        this.extractPathBtn?.addEventListener('click', () => this.extractPath());
        this.pathInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.extractPath();
        });
        
        // Schema Validation
        this.validateSchemaBtn?.addEventListener('click', () => this.validateAgainstSchema());
        
        // Conversions
        this.jsonToCsvBtn?.addEventListener('click', () => this.convertToCSV());
        this.jsonToYamlBtn?.addEventListener('click', () => this.convertToYAML());
        this.jsonToXmlBtn?.addEventListener('click', () => this.convertToXML());
        this.csvToJsonBtn?.addEventListener('click', () => this.convertFromCSV());
    }

    formatJSON(minify = false) {
        const input = this.jsonInput?.value.trim();
        if (!input) {
            this.clearOutput();
            return;
        }

        try {
            let json = JSON.parse(input);
            
            // Apply transformations
            if (this.sortKeys?.checked) {
                json = this.sortObjectKeys(json);
            }
            
            let formatted;
            if (minify) {
                formatted = JSON.stringify(json);
            } else {
                const indent = this.indentSize?.value === 'tab' ? '\t' : Number(this.indentSize?.value || 2);
                formatted = JSON.stringify(json, null, indent);
                
                // Apply compact arrays if enabled
                if (this.compactArrays?.checked) {
                    formatted = this.compactArraysFormat(formatted);
                }
            }
            
            // Escape unicode if needed
            if (this.escapeUnicode?.checked) {
                formatted = this.escapeUnicodeChars(formatted);
            }
            
            this.jsonOutput.textContent = formatted;
            this.showValidationStatus(true, 'Valid JSON');
            this.updateSizeInfo(input.length, formatted.length);
            
        } catch (error) {
            this.showValidationStatus(false, error.message);
            this.jsonOutput.textContent = '';
            this.updateSizeInfo(input.length, 0);
        }
    }

    validateJSON() {
        const input = this.jsonInput?.value.trim();
        if (!input) {
            this.clearValidationStatus();
            return;
        }

        try {
            JSON.parse(input);
            this.showValidationStatus(true, 'Valid JSON');
        } catch (error) {
            this.showValidationStatus(false, error.message);
        }
    }

    escapeJSON() {
        const input = this.jsonInput?.value.trim();
        if (!input) return;
        
        const escaped = JSON.stringify(input);
        this.jsonOutput.textContent = escaped;
        this.showValidationStatus(true, 'JSON escaped for string use');
    }

    sortObjectKeys(obj) {
        if (typeof obj !== 'object' || obj === null) return obj;
        if (Array.isArray(obj)) return obj.map(item => this.sortObjectKeys(item));
        
        return Object.keys(obj).sort().reduce((result, key) => {
            result[key] = this.sortObjectKeys(obj[key]);
            return result;
        }, {});
    }

    compactArraysFormat(jsonString) {
        // Simple implementation to keep short arrays on single lines
        return jsonString.replace(/\[\s*([^\[\]{}]+?)\s*\]/g, (match, content) => {
            if (content.length < 50 && !content.includes('{') && !content.includes('[')) {
                return `[${content.replace(/\s+/g, ' ').trim()}]`;
            }
            return match;
        });
    }

    escapeUnicodeChars(str) {
        return str.replace(/[\u0080-\uFFFF]/g, (match) => {
            return '\\u' + ('0000' + match.charCodeAt(0).toString(16)).slice(-4);
        });
    }

    extractPath() {
        const input = this.jsonInput?.value.trim();
        const path = this.pathInput?.value.trim();
        
        if (!input || !path) {
            this.pathResult.innerHTML = '<div class="error">Please provide both JSON and JSONPath</div>';
            return;
        }

        try {
            const json = JSON.parse(input);
            const result = this.evaluateJSONPath(json, path);
            this.pathResult.innerHTML = `
                <div class="path-success">
                    <h4>Path Result:</h4>
                    <pre>${JSON.stringify(result, null, 2)}</pre>
                </div>
            `;
        } catch (error) {
            this.pathResult.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        }
    }

    evaluateJSONPath(data, path) {
        // Basic JSONPath implementation
        if (path === '$') return data;
        
        const parts = path.replace(/^\$\.?/, '').split('.');
        let current = data;
        
        for (const part of parts) {
            if (part.includes('[') && part.includes(']')) {
                const [key, indexPart] = part.split('[');
                const index = indexPart.replace(']', '');
                
                if (key) current = current[key];
                if (index === '*') {
                    if (Array.isArray(current)) {
                        return current;
                    } else {
                        return Object.values(current);
                    }
                } else {
                    current = current[parseInt(index)];
                }
            } else {
                current = current[part];
            }
            
            if (current === undefined) break;
        }
        
        return current;
    }

    validateAgainstSchema() {
        const input = this.jsonInput?.value.trim();
        const schema = this.schemaInput?.value.trim();
        
        if (!input || !schema) {
            this.schemaResult.innerHTML = '<div class="error">Please provide both JSON data and schema</div>';
            return;
        }

        try {
            const json = JSON.parse(input);
            const schemaObj = JSON.parse(schema);
            
            // Basic schema validation (simplified)
            const isValid = this.basicSchemaValidation(json, schemaObj);
            
            this.schemaResult.innerHTML = isValid 
                ? '<div class="success">✅ Data matches schema</div>'
                : '<div class="error">❌ Data does not match schema</div>';
                
        } catch (error) {
            this.schemaResult.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        }
    }

    basicSchemaValidation(data, schema) {
        // Very basic schema validation - can be expanded
        if (schema.type && typeof data !== schema.type) return false;
        if (schema.required && schema.type === 'object') {
            for (const req of schema.required) {
                if (!(req in data)) return false;
            }
        }
        return true;
    }

    convertToCSV() {
        const input = this.jsonInput?.value.trim();
        if (!input) return;

        try {
            const json = JSON.parse(input);
            let csv = this.jsonToCSV(json);
            this.conversionResult.innerHTML = `
                <h4>CSV Output:</h4>
                <textarea rows="8" style="width: 100%;">${csv}</textarea>
            `;
        } catch (error) {
            this.conversionResult.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        }
    }

    jsonToCSV(data) {
        if (!Array.isArray(data)) {
            data = [data];
        }
        
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        
        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header];
                return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
            });
            csvRows.push(values.join(','));
        }
        
        return csvRows.join('\n');
    }

    convertToYAML() {
        this.conversionResult.innerHTML = '<div class="info">YAML conversion requires additional library</div>';
    }

    convertToXML() {
        const input = this.jsonInput?.value.trim();
        if (!input) return;

        try {
            const json = JSON.parse(input);
            const xml = this.jsonToXML(json);
            this.conversionResult.innerHTML = `
                <h4>XML Output:</h4>
                <textarea rows="8" style="width: 100%;">${xml}</textarea>
            `;
        } catch (error) {
            this.conversionResult.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        }
    }

    jsonToXML(obj, rootName = 'root') {
        function convert(obj, name) {
            if (typeof obj !== 'object' || obj === null) {
                return `<${name}>${obj}</${name}>`;
            }
            
            if (Array.isArray(obj)) {
                return obj.map(item => convert(item, name.slice(0, -1))).join('');
            }
            
            let xml = `<${name}>`;
            for (const [key, value] of Object.entries(obj)) {
                xml += convert(value, key);
            }
            xml += `</${name}>`;
            return xml;
        }
        
        return '<?xml version="1.0" encoding="UTF-8"?>\n' + convert(obj, rootName);
    }

    convertFromCSV() {
        this.conversionResult.innerHTML = '<div class="info">Please paste CSV data in input field, then click this button</div>';
        // Implementation would parse CSV from input and convert to JSON
    }

    loadSampleJSON() {
        const sampleData = {
            "users": [
                {
                    "id": 1,
                    "name": "John Doe",
                    "email": "john@example.com",
                    "age": 30,
                    "isActive": true,
                    "address": {
                        "street": "123 Main St",
                        "city": "New York",
                        "zipCode": "10001"
                    },
                    "hobbies": ["reading", "swimming", "coding"]
                },
                {
                    "id": 2,
                    "name": "Jane Smith", 
                    "email": "jane@example.com",
                    "age": 25,
                    "isActive": false,
                    "address": {
                        "street": "456 Oak Ave",
                        "city": "Los Angeles", 
                        "zipCode": "90210"
                    },
                    "hobbies": ["painting", "yoga"]
                }
            ],
            "metadata": {
                "version": "1.0",
                "createdAt": "2024-01-15T10:30:00Z",
                "totalUsers": 2
            }
        };
        
        this.jsonInput.value = JSON.stringify(sampleData, null, 2);
        this.formatJSON(false);
    }

    loadFileFromInput(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.jsonInput.value = e.target.result;
            this.formatJSON(false);
        };
        reader.readAsText(file);
    }

    downloadJSON() {
        const content = this.jsonOutput?.textContent;
        if (!content) return;
        
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    copyToClipboard() {
        const content = this.jsonOutput?.textContent;
        if (!content) return;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(content).then(() => {
                this.copyBtn.textContent = 'Copied!';
                setTimeout(() => this.copyBtn.textContent = '📋 Copy', 2000);
            });
        } else {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = content;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            this.copyBtn.textContent = 'Copied!';
            setTimeout(() => this.copyBtn.textContent = '📋 Copy', 2000);
        }
    }

    showValidationStatus(isValid, message) {
        if (!this.validationStatus) return;
        
        this.validationStatus.className = `validation-status ${isValid ? 'valid' : 'invalid'}`;
        this.validationStatus.textContent = isValid ? `✓ ${message}` : `✗ ${message}`;
    }

    clearValidationStatus() {
        if (this.validationStatus) {
            this.validationStatus.textContent = '';
            this.validationStatus.className = 'validation-status';
        }
    }

    updateStats() {
        const input = this.jsonInput?.value || '';
        const lines = input.split('\n').length;
        const chars = input.length;
        const words = input.trim().split(/\s+/).length;
        
        if (this.jsonStats) {
            this.jsonStats.textContent = `${lines} lines, ${chars} characters, ${words} words`;
        }
    }

    updateSizeInfo(inputSize, outputSize) {
        if (!this.jsonSizeInfo) return;
        
        const compression = inputSize > 0 ? Math.round((1 - outputSize / inputSize) * 100) : 0;
        this.jsonSizeInfo.textContent = `Input: ${inputSize}B | Output: ${outputSize}B | ${compression > 0 ? 'Compressed' : 'Expanded'}: ${Math.abs(compression)}%`;
    }

    clearOutput() {
        if (this.jsonOutput) this.jsonOutput.textContent = '';
        this.clearValidationStatus();
        this.updateSizeInfo(0, 0);
    }

    clearAll() {
        if (this.jsonInput) this.jsonInput.value = '';
        this.clearOutput();
        if (this.pathResult) this.pathResult.innerHTML = '';
        if (this.schemaResult) this.schemaResult.innerHTML = '';
        if (this.conversionResult) this.conversionResult.innerHTML = '';
        if (this.pathInput) this.pathInput.value = '';
        if (this.schemaInput) this.schemaInput.value = '';
    }

    loadSampleData() {
        // Auto-load sample if no content
        setTimeout(() => {
            if (!this.jsonInput?.value.trim()) {
                this.loadSampleJSON();
            }
        }, 500);
    }
}

// Initialize Enhanced JSON Formatter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new JSONFormatter();
    }, 100);
});
