import {
    FilterParams,
    PagingParams,
    DataPage
} from 'pip-services3-commons-node';

import { SenecaClient } from '../../src/clients/SenecaClient';
import { IDummyClient } from '../IDummyClient';
import { Dummy } from '../Dummy';

export class DummySenecaClient extends SenecaClient implements IDummyClient {

    public getDummies(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, result: DataPage<Dummy>) => void): void {
        this.call(
            'dummy',
            'get_dummies',
            correlationId,
            {
                filter: filter,
                paging: paging
            },
            (err, result) => {
                callback(err, result);
            }
        );
    }

    public getDummyById(correlationId: string, dummyId: string, callback: (err: any, result: Dummy) => void): void {
        this.call(
            'dummy',
            'get_dummy_by_id',
            correlationId,
            {
                dummy_id: dummyId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    }

    public createDummy(correlationId: string, dummy: any, callback: (err: any, result: Dummy) => void): void {
        this.call(
            'dummy',
            'create_dummy',
            correlationId,
            {
                dummy: dummy
            },
            (err, result) => {
                callback(err, result);
            }
        );
    }

    public updateDummy(correlationId: string, dummy: any, callback: (err: any, result: Dummy) => void): void {
        this.call(
            'dummy',
            'update_dummy',
            correlationId,
            {
                dummy: dummy
            },
            (err, result) => {
                callback(err, result);
            }
        );
    }

    public deleteDummy(correlationId: string, dummyId: string, callback: (err: any, result: Dummy) => void): void {
        this.call(
            'dummy',
            'delete_dummy',
            correlationId,
            {
                dummy_id: dummyId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    }

}
