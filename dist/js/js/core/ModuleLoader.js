/**
 * Module Loader for lazy loading components
 */
class ModuleLoader {
    constructor() {
        this.loadedModules = new Set();
        this.loadingPromises = new Map();
    }

    /**
     * Load a component module dynamically
     * @param {string} componentName - Name of the component
     * @returns {Promise}
     */
    async loadComponent(componentName) {
        if (this.loadedModules.has(componentName)) {
            return Promise.resolve();
        }

        if (this.loadingPromises.has(componentName)) {
            return this.loadingPromises.get(componentName);
        }

        const loadPromise = this._loadModule(componentName);
        this.loadingPromises.set(componentName, loadPromise);

        try {
            await loadPromise;
            this.loadedModules.add(componentName);
            this.loadingPromises.delete(componentName);
        } catch (error) {
            this.loadingPromises.delete(componentName);
            throw error;
        }

        return loadPromise;
    }

    /**
     * Load module script and CSS
     * @private
     */
    async _loadModule(componentName) {
        const promises = [];
        
        // Load JavaScript
        promises.push(this._loadScript(`/components/${componentName}.js`));
        
        // Load component-specific CSS if exists
        promises.push(this._loadCSS(`/styles/components/${componentName.toLowerCase()}.css`));

        await Promise.all(promises);
    }

    /**
     * Load script dynamically
     * @private
     */
    _loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(script);
        });
    }

    /**
     * Load CSS dynamically
     * @private
     */
    _loadCSS(href) {
        return new Promise((resolve) => {
            // Check if CSS already exists
            if (document.querySelector(`link[href="${href}"]`)) {
                resolve();
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            link.onerror = resolve; // Don't fail if component CSS doesn't exist
            document.head.appendChild(link);
        });
    }
}

// Global instance
window.moduleLoader = new ModuleLoader();
