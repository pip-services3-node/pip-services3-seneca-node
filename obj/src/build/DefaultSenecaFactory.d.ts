/** @module build */
import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';
/**
 * Creates Seneca components by their descriptors.
 *
 * @see [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/classes/build.factory.html Factory]]
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
