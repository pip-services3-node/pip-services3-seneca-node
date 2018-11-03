/** @module build */
import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { SenecaEndpoint } from '../services/SenecaEndpoint';

/**
 * Creates Seneca components by their descriptors.
 * 
 * @see [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/classes/build.factory.html Factory]]
 * @see [[SenecaEndpoint]]
 */
export class DefaultSenecaFactory extends Factory {
	public static readonly Descriptor: Descriptor = new Descriptor("pip-services", "factory", "seneca", "default", "1.0");
    public static readonly SenecaEndpointDescriptor: Descriptor = new Descriptor("pip-services", "endpoint", "seneca", "*", "1.0");

    /**
	 * Create a new instance of the factory.
	 */
    public constructor() {
        super();
        this.registerAsType(DefaultSenecaFactory.SenecaEndpointDescriptor, SenecaEndpoint);
    }
}
