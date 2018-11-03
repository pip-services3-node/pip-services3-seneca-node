let _ = require('lodash');

import { Descriptor } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams} from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { FilterParamsSchema } from 'pip-services3-commons-node';
import { PagingParamsSchema } from 'pip-services3-commons-node';

import { SenecaService } from '../../src/services/SenecaService';
import { IDummyController } from '../IDummyController';
import { DummySchema } from '../DummySchema';

export class DummySenecaService extends SenecaService {
    private _controller: IDummyController;

    public constructor() {
        super();
        this._dependencyResolver.put('controller', new Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);
        this._controller = this._dependencyResolver.getOneRequired<IDummyController>('controller');
    }

    private getPageByFilter(params: any, callback: (err: any, result?: any) => void): void {
        this._controller.getPageByFilter(
            params.correlation_id,
            new FilterParams(params.filter),
            new PagingParams(params.paging),
            callback
        );
    }

    private getOneById(params: any, callback: (err: any, result?: any) => void): void {
        this._controller.getOneById(
            params.correlation_id,
            params.dummy_id,
            callback
        );
    }

    private create(params: any, callback: (err: any, result?: any) => void): void {
        this._controller.create(
            params.correlation_id,
            params.dummy,
            callback
        );
    }

    private update(params: any, callback: (err: any, result?: any) => void): void {
        this._controller.update(
            params.correlation_id,
            params.dummy,
            callback
        );
    }

    private deleteById(params: any, callback: (err: any, result?: any) => void): void {
        this._controller.deleteById(
            params.correlation_id,
            params.dummy_id,
            callback
        );
    }

    protected register() {
        let role = 'dummy';

        this.registerAction(role,
            'get_dummies',
            new ObjectSchema(true)
                .withOptionalProperty("filter", new FilterParamsSchema())
                .withOptionalProperty("paging", new PagingParamsSchema()),
            this.getPageByFilter
        );

        this.registerAction(role,
            'get_dummy_by_id',
            new ObjectSchema(true)
                .withRequiredProperty("dummy_id", TypeCode.String),
            this.getOneById
        );

        this.registerAction(role,
            'create_dummy',
            new ObjectSchema(true)
                .withRequiredProperty("dummy", new DummySchema()),
            this.create
        );

        this.registerAction(role,
            'update_dummy',
            new ObjectSchema(true)
                .withRequiredProperty("dummy", new DummySchema()),
            this.update
        );

        this.registerAction(role,
            'delete_dummy',
            new ObjectSchema(true)
                .withRequiredProperty("dummy_id", TypeCode.String),
            this.deleteById
        );
    }
}
