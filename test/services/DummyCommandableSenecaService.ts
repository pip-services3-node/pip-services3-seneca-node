import { Descriptor } from 'pip-services3-commons-node';
import { CommandableSenecaService } from '../../src/services/CommandableSenecaService';

export class DummyCommandableSenecaService extends CommandableSenecaService {
    public constructor() {
        super('dummy');
        this._dependencyResolver.put('controller', new Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
    }
}