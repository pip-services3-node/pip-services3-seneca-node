"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SenecaPlugin = void 0;
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
const SenecaEndpoint_1 = require("../services/SenecaEndpoint");
/**
 * Seneca plugin that acts as a container for seneca services.
 *
 * ### Example ###
 *
 * Todo: Add example
 */
class SenecaPlugin {
    /**
     * Creates a new instance of this container.
     *
     * @param name          a plugin name
     * @param seneca        a seneca instance
     * @param references    references with components and services that run inside this plugin
     */
    constructor(name, seneca, references) {
        if (name == null)
            throw new Error('Plugin name cannot be null');
        if (seneca == null)
            throw new Error('Seneca reference cannot be null');
        if (references == null)
            throw new Error('References cannot be null');
        this._name = name;
        this._seneca = seneca;
        this._references = references;
        this._logger = new pip_services3_components_node_1.CompositeLogger(this._references);
        this.build();
    }
    /**
     * Gets the plugin name.
     *
     * @returns the plugin name.
     */
    get name() {
        return this._name;
    }
    build() {
        // Initialize seneca instance
        let senecaDescriptor = new pip_services3_commons_node_1.Descriptor('pip-services', 'seneca', 'endpoint', '*', '*');
        let senecaInstance = this._references.getOneOptional(senecaDescriptor);
        if (senecaInstance != null) {
            senecaInstance.setInstance(this._seneca);
        }
        else {
            senecaInstance = new SenecaEndpoint_1.SenecaEndpoint(this._seneca);
            this._references.put(senecaDescriptor, senecaInstance);
        }
        // Open plugin on seneca init
        this._seneca.add({ init: this._name }, (args, done) => {
            this.open((err) => {
                if (err) {
                    this._logger.fatal(this._name, err, 'Failed to open seneca plugin %s', this._name);
                    process.exit(1);
                }
                done();
            });
        });
        // Close plugin on seneca close
        this._seneca.on('close', () => {
            this.close();
        });
    }
    open(callback) {
        let components = this._references.getAll();
        try {
            pip_services3_commons_node_2.Referencer.setReferences(this._references, components);
            pip_services3_commons_node_3.Opener.open(this._name, components, callback);
        }
        catch (err) {
            if (callback)
                callback(err);
        }
    }
    close(callback) {
        let components = this._references.getAll();
        pip_services3_commons_node_4.Closer.close(this._name, components, callback);
    }
}
exports.SenecaPlugin = SenecaPlugin;
//# sourceMappingURL=SenecaPlugin.js.map