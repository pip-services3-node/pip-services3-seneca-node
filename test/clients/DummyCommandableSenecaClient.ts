import {
    FilterParams,
    PagingParams,
    DataPage
} from 'pip-services3-commons-node';

import { CommandableSenecaClient } from '../../src/clients/CommandableSenecaClient';
import { IDummyClient } from '../IDummyClient';
import { Dummy } from '../Dummy';

export class DummyCommandableSenecaClient extends CommandableSenecaClient implements IDummyClient {

    public constructor() {
        super('dummy');
    }

    public getDummies(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, result: DataPage<Dummy>) => void): void {
        this.callCommand(
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
        this.callCommand(
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
        this.callCommand(
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
        this.callCommand(
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
        this.callCommand(
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
