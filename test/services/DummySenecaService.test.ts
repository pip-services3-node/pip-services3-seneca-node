let assert = require('chai').assert;
let async = require('async');

import {
    Descriptor,
    ConfigParams,
    References
} from 'pip-services3-commons-node';
import { ConsoleLogger } from 'pip-services3-components-node';

import { Dummy } from '../Dummy';
import { DummyController } from '../DummyController';
import { DummySenecaService } from './DummySenecaService';
import { SenecaEndpoint } from '../../src/services/SenecaEndpoint';

var senecaConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3001
);

suite('DummySenecaService', () => {
    var _dummy1: Dummy;
    var _dummy2: Dummy;

    let service: DummySenecaService;

    let seneca: any;

    suiteSetup((done) => {
        let ctrl = new DummyController();

        service = new DummySenecaService();
        let senecaAddon = new SenecaEndpoint();
        let logger = new ConsoleLogger();

        let references: References = References.fromTuples(
            new Descriptor('pip-services3-commons', 'logger', 'console', 'default', '1.0'), logger,
            new Descriptor('pip-services', 'seneca', 'endpoint', 'default', '1.0'), senecaAddon,
            new Descriptor('pip-services-dummies', 'controller', 'default', 'default', '1.0'), ctrl,
            new Descriptor('pip-services-dummies', 'service', 'rest', 'default', '1.0'), service
        );
        service.setReferences(references);
        senecaAddon.setReferences(references);

        service.configure(senecaConfig);

        seneca = senecaAddon.getInstance();

        service.open(null, done);
    });

    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup(() => {
        _dummy1 = { id: null, key: "Key 1", content: "Content 1" };
        _dummy2 = { id: null, key: "Key 2", content: "Content 2" };
    });

    test('CRUD Operations', (done) => {
        var dummy1, dummy2;

        async.series([
            // Create one dummy
            (callback) => {
                seneca.act(
                    {
                        role: 'dummy',
                        cmd: 'create_dummy',
                        dummy: _dummy1
                    },
                    (err, dummy) => {
                        assert.isNull(err);

                        assert.isObject(dummy);
                        assert.equal(dummy.content, _dummy1.content);
                        assert.equal(dummy.key, _dummy1.key);

                        dummy1 = dummy;

                        callback();
                    }
                );
            },
            // Create another dummy
            (callback) => {
                seneca.act(
                    {
                        role: 'dummy',
                        cmd: 'create_dummy',
                        dummy: _dummy2
                    },
                    (err, dummy) => {
                        assert.isNull(err);

                        assert.isObject(dummy);
                        assert.equal(dummy.content, _dummy2.content);
                        assert.equal(dummy.key, _dummy2.key);

                        dummy2 = dummy;

                        callback();
                    }
                );
            },
            // Get all dummies
            (callback) => {
                seneca.act(
                    {
                        role: 'dummy',
                        cmd: 'get_dummies'
                    },
                    (err, dummies) => {
                        assert.isNull(err);

                        assert.isObject(dummies);
                        assert.lengthOf(dummies.data, 2);

                        callback();
                    }
                );
            },
            // Update the dummy
            (callback) => {
                dummy1.content = 'Updated Content 1'
                seneca.act(
                    {
                        role: 'dummy',
                        cmd: 'update_dummy',
                        dummy: dummy1
                    },
                    (err, dummy) => {
                        assert.isNull(err);

                        assert.isObject(dummy);
                        assert.equal(dummy.id, dummy1.id);
                        assert.equal(dummy.content, dummy1.content);
                        assert.equal(dummy.key, dummy1.key);

                        callback();
                    }
                );
            },
            // Delete dummy
            (callback) => {
                seneca.act(
                    {
                        role: 'dummy',
                        cmd: 'delete_dummy',
                        dummy_id: dummy1.id
                    },
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
            // Try to get delete dummy
            (callback) => {
                seneca.act(
                    {
                        role: 'dummy',
                        cmd: 'get_dummy_by_id',
                        dummy_id: dummy1.id
                    },
                    (err, dummy) => {
                        assert.isNull(err);

                        assert.isNull(dummy || null);

                        callback();
                    }
                );
            }
        ], done);
    });

});
