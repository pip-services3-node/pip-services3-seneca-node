import { IOpenable } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { Schema } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { DependencyResolver } from 'pip-services3-commons-node';
import { ConnectionResolver } from 'pip-services3-components-node';
import { ConnectionParams } from 'pip-services3-components-node';
import { CompositeLogger } from 'pip-services3-components-node';
import { CompositeCounters } from 'pip-services3-components-node';
import { Timing } from 'pip-services3-components-node';
/**
 * Abstract client that calls remove endpoints using Seneca protocol.
 *
 * ### Configuration parameters ###
 *
 * - connection(s):
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/interfaces/connect.idiscovery.html IDiscovery]]
 *   - protocol:              connection protocol: http or https
 *   - host:                  host name or IP address
 *   - port:                  port number
 *   - uri:                   resource URI or connection string with all parameters in it
 * - options:
 *   - retries:               number of retries (default: 3)
 *   - connect_timeout:       connection timeout in milliseconds (default: 10 sec)
 *   - timeout:               invocation timeout in milliseconds (default: 10 sec)
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>         (optional) [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>         (optional) [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 *
 * @see [[RestService]]
 * @see [[CommandableHttpService]]
 *
 * ### Example ###
 *
 *     class MySenecaClient extends SenecaClient implements IMyClient {
 *        ...
 *
 *        public getData(correlationId: string, id: string,
 *            callback: (err: any, result: MyData) => void): void {
 *
 *            let timing = this.instrument(correlationId, 'myclient.get_data');
 *            this.call("mydata", "get_data" correlationId, { id: id }, (err, result) => {
 *                timing.endTiming();
 *                callback(err, result);
 *            });
 *        }
 *        ...
 *     }
 *
 *     let client = new MySenecaClient();
 *     client.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *
 *     client.getData("123", "1", (err, result) => {
 *       ...
 *    });
 */
export declare abstract class SenecaClient implements IOpenable, IConfigurable, IReferenceable {
    private static readonly _defaultConfig;
    protected _seneca: any;
    protected _opened: boolean;
    protected _schemas: {
        [id: string]: Schema;
    };
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
     * Resolves and validates connection to Seneca service.
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
     * Calls a remote method via HTTP/REST protocol.
     *
     * @param role              a service role (service name)
     * @param cmd               a command name
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param params            (optional) command parameters.
     * @param callback          (optional) callback function that receives result object or error.
     */
    protected call(role: string, cmd: string, correlationId: string, params?: any, callback?: (err: any, result: any) => void): void;
}
