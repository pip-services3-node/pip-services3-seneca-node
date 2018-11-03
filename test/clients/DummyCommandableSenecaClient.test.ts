let assert = require('chai').assert;
let async = require('async');

import {
    Descriptor,
    ConfigParams,
    References
} from 'pip-services3-commons-node';
import { ConsoleLogger } from 'pip-services3-components-node';

import { DummyController } from '../DummyController';
import { DummyCommandableSenecaService } from '../services/DummyCommandableSenecaService';
import { DummyCommandableSenecaClient } from './DummyCommandableSenecaClient';
import { DummyClientFixture } from '../DummyClientFixture';
import { SenecaEndpoint } from '../../src/services/SenecaEndpoint';

let senecaConfig = ConfigParams.fromTuples(
    "connection.protocol", "none"
);

suite('DummyCommandableSenecaClient', () => {
    let service: DummyCommandableSenecaService;
    let client: DummyCommandableSenecaClient;
    let fixture: DummyClientFixture;

    suiteSetup((done) => {
        let ctrl = new DummyController();

        service = new DummyCommandableSenecaService();
        let seneca = new SenecaEndpoint();
        let logger = new ConsoleLogger();

        let references: References = References.fromTuples(
            new Descriptor('pip-services3-commons', 'logger', 'console', 'default', '1.0'), logger,
            new Descriptor('pip-services', 'seneca', 'endpoint', 'default', '1.0'), seneca,
            new Descriptor('pip-services-dummies', 'controller', 'default', 'default', '1.0'), ctrl,
            new Descriptor('pip-services-dummies', 'service', 'commandable-seneca', 'default', '1.0'), service
        );
        seneca.setReferences(references);

        service.setReferences(references);
        service.configure(senecaConfig);

        client = new DummyCommandableSenecaClient();
        client.setReferences(references);
        client.configure(senecaConfig);

        fixture = new DummyClientFixture(client);

        service.open(null, (err) => {
            client.open(null, done);
        });
    });

    suiteTeardown((done) => {
        client.close(null);
        service.close(null, done);
    });

    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

});
