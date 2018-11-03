import { IOpenable } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { DependencyResolver } from 'pip-services3-commons-node';
import { ConnectionParams } from 'pip-services3-components-node';
import { ConnectionResolver } from 'pip-services3-components-node';
import { CompositeLogger } from 'pip-services3-components-node';
import { CompositeCounters } from 'pip-services3-components-node';
import { Timing } from 'pip-services3-components-node';
/**
 * Abstract service that receives remove calls via Seneca protocol.
 *
 * ### Configuration parameters ###
 *
 * - dependencies:
 *   - endpoint:              override for HTTP Endpoint dependency
 *   - controller:            override for Controller dependency
 * - connection(s):
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/interfaces/connect.idiscovery.html IDiscovery]]
 *   - protocol:              connection protocol: http or https
 *   - host:                  host name or IP address
 *   - port:                  port number
 *   - uri:                   resource URI or connection string with all parameters in it
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>         (optional) [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>         (optional) [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * - <code>\*:endpoint:seneca:\*:1.0</code>        (optional) [[SenecaEndpoint]] reference
 *
 * @see [[SenecaClient]]
 *
 * ### Example ###
 *
 *     class MySenecaService extends SenecaService {
 *        private _controller: IMyController;
 *        ...
 *        public constructor() {
 *           base();
 *           this._dependencyResolver.put(
 *               "controller",
 *               new Descriptor("mygroup","controller","*","*","1.0")
 *           );
 *        }
 *
 *        public setReferences(references: IReferences): void {
 *           base.setReferences(references);
 *           this._controller = this._dependencyResolver.getRequired<IMyController>("controller");
 *        }
 *
 *        public register(): void {
 *            registerAction("mydata", "get_data", null, (params, callback) => {
 *                let correlationId = params.correlation_id;
 *                let id = params.id;
 *                this._controller.getMyData(correlationId, id, callback);
 *            });
 *            ...
 *        }
 *     }
 *
 *     let service = new MySenecaService();
 *     service.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *     service.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","controller","default","default","1.0"), controller
 *     ));
 *
 *     service.open("123", (err) => {
 *        console.log("The Seneca service is running on port 8080");
 *     });
 */
export declare abstract class SenecaService implements IOpenable, IConfigurable, IReferenceable {
    private static readonly _defaultConfig;
    protected _seneca: any;
    protected _opened: boolean;
    protected transport: any;
    protected _dependencyResolver: DependencyResolver;
    protected _connectionResolver: ConnectionResolver;
    protected _logger: CompositeLogger;
    protected _counters: CompositeCounters;
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references: IReferences): void;
    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a Timing object that is used to end the time measurement.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param name              a method name.
     * @returns Timing object to end the time measurement.
     */
    protected instrument(correlationId: string, name: string): Timing;
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen(): boolean;
    /**
     * Resolves and validates connection for Seneca service.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback          callback function that receives connection parameters or error.
     */
    protected resolveConnection(correlationId: string, callback: (err: any, result: ConnectionParams) => void): void;
    /**
     * Opens the component.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    open(correlationId: string, callback: (err?: any) => void): void;
    /**
     * Closes component and frees used resources.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    close(correlationId: string, callback?: (err?: any) => void): void;
    /**
     * Registers an action in Seneca endpoint.
     *
     * @param role          a service role (name)
     * @param cmd           a command name
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when action is invoked.
     */
    protected registerAction(role: string, cmd: string, schema: any, action: (params: any, callback: (err: any, result: any) => void) => void): void;
    /**
     * Registers all service actions.
     *
     * This method is called by the service and must be overriden
     * in child classes.
     */
    protected abstract register(): void;
}
