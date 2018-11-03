let assert = require('chai').assert;
let async = require('async');

import {
    Descriptor,
    ConfigParams,
    References,
} from 'pip-services3-commons-node';
import { ConsoleLogger } from 'pip-services3-components-node';

import { Dummy } from '../Dummy';
import { DummyController } from '../DummyController';
import { IDummyClient } from '../IDummyClient';
import { DummySenecaClient } from '../clients/DummySenecaClient';
import { DummyClientFixture } from '../DummyClientFixture';
import { SenecaEndpoint } from '../../src/services/SenecaEndpoint';

let senecaConfig = ConfigParams.fromTuples(
    "connection.protocol", "none"
);

suite('DummySenecaPlugin', () => {
    let client: DummySenecaClient;
    let fixture: DummyClientFixture;

    suiteSetup((done) => {
        let ctrl = new DummyController();

        let seneca = new SenecaEndpoint();
        let logger = new ConsoleLogger();

        let references: References = References.fromTuples(
            new Descriptor('pip-services3-commons', 'logger', 'console', 'default', '1.0'), logger,
            new Descriptor('pip-services', 'seneca', 'endpoint', 'default', '1.0'), seneca
        );
        seneca.setReferences(references);

        // Load Seneca plugin
        let plugin = require('./DummySenecaPlugin');
        seneca.getInstance().use(plugin, { test: '123' });

        client = new DummySenecaClient();
        client.setReferences(references);
        client.configure(senecaConfig);

        fixture = new DummyClientFixture(client);

        client.open(null, done);
    });

    suiteTeardown((done) => {
        client.close(null, done);
    });

    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

});
