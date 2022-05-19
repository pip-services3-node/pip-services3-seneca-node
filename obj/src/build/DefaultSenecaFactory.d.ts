/** @module build */
import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';
/**
 * Creates Seneca components by their descriptors.
 *
 * @see [[https://pip-services3-node.github.io/pip-services3-components-node/classes/build.factory.html Factory]]
 * @see [[SenecaEndpoint]]
 */
export declare class DefaultSenecaFactory extends Factory {
    static readonly Descriptor: Descriptor;
    static readonly SenecaEndpointDescriptor: Descriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
