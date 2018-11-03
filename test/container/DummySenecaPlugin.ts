import { References } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { ConsoleLogger } from 'pip-services3-components-node';

import { SenecaPlugin } from '../../src/container/SenecaPlugin';
import { DummyController } from '../DummyController';
import { DummySenecaService } from '../services/DummySenecaService';

export class DummySenecaPlugin extends SenecaPlugin {
    public constructor(seneca: any, options: any) {
        super('pip-services-dummies', seneca, DummySenecaPlugin.createReferences(options));
    }

    private static createReferences(options: any): References {        
        let logger = new ConsoleLogger();
        let ctrl = new DummyController();
        let service = new DummySenecaService();
        service.configure(ConfigParams.fromValue(options));

        return References.fromTuples(
            new Descriptor('pip-services3-commons', 'logger', 'console', 'default', '1.0'), logger,
            new Descriptor('pip-services-dummies', 'controller', 'default', 'default', '1.0'), ctrl,
            new Descriptor('pip-services-dummies', 'service', 'rest', 'default', '1.0'), service
        );
    }
}

module.exports = function(options: any): any {
    let seneca = this;
    let plugin = new DummySenecaPlugin(seneca, options);
    return { name: plugin.name };
}