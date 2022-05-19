"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultSenecaFactory = void 0;
/** @module build */
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const SenecaEndpoint_1 = require("../services/SenecaEndpoint");
/**
 * Creates Seneca components by their descriptors.
 *
 * @see [[https://pip-services3-node.github.io/pip-services3-components-node/classes/build.factory.html Factory]]
 * @see [[SenecaEndpoint]]
 */
class DefaultSenecaFactory extends pip_services3_components_node_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultSenecaFactory.SenecaEndpointDescriptor, SenecaEndpoint_1.SenecaEndpoint);
    }
}
exports.DefaultSenecaFactory = DefaultSenecaFactory;
DefaultSenecaFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "factory", "seneca", "default", "1.0");
DefaultSenecaFactory.SenecaEndpointDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "endpoint", "seneca", "*", "1.0");
//# sourceMappingURL=DefaultSenecaFactory.js.map