/** @module services */
import { IReferenceable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { CompositeLogger } from 'pip-services3-components-node';

export class SenecaEndpoint implements IReferenceable {
    private _logger: CompositeLogger = new CompositeLogger();
    private _instance: any;

    public constructor(instance?: any) {
        this._instance = instance;
    }

    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
    }

    public getInstance(): any {
        // Initialize seneca instance
        if (this._instance == null) {
            this._instance = require('seneca')({ strict: { result: false } });
            this._instance.error((err) => {
                if (err) this._logger.error(null, err, err.message);
            });
        }

        return this._instance;
    }

    public setInstance(seneca: any): void {
        this._instance = seneca;
    }
}