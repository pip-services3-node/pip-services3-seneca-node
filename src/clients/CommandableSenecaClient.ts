/** @module clients */
import { SenecaClient } from './SenecaClient';

/**
 * Abstract client that calls commandable Seneca service.
 * 
 * Commandable services are generated automatically for [[https://pip-services3-node.github.io/pip-services3-commons-node/interfaces/commands.icommandable.html ICommandable objects]].
 * Each command is exposed as Seneca action.
 * 
 * ### Configuration parameters ###
 * 
 * - connection(s):           
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]]
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
 * - <code>\*:logger:\*:\*:1.0</code>         (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>         (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * 
 * ### Example ###
 * 
 *     class MyCommandableSenecaClient extends CommandableSenecaClient implements IMyClient {
 *        ...
 * 
 *        public getData(correlationId: string, id: string, 
 *            callback: (err: any, result: MyData) => void): void {
 *        
 *            this.callCommand(
 *                "get_data",
 *                correlationId,
 *                { id: id },
 *                (err, result) => {
 *                    callback(err, result);
 *                }
 *             );        
 *        }
 *        ...
 *     }
 * 
 *     let client = new MyCommandableSenecaClient();
 *     client.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 * 
 *     client.getData("123", "1", (err, result) => {
 *       ...
 *     });
 */
export class CommandableSenecaClient extends SenecaClient {
    private _role: string;

    /**
     * Creates a new instance of the client.
     * 
     * @param role     a service role (name). 
     */
    public constructor(role: string) {
        super();
        this._role = role;
    }

    /**
     * Calls a remote method via Seneca commadable protocol.
     * 
     * @param cmd               a name of the command to call. 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param params            command parameters.
     * @param callback          callback function that receives result or error.
     */
    public callCommand(cmd: string, correlationId: string, params: any, callback: (err: any, result: any) => void): void {
        let timing = this.instrument(correlationId, this._role + '.' + cmd);

        this.call(this._role, cmd, correlationId, params, (err, result) => {
            timing.endTiming();

            if (callback) callback(err, result);
        });
    }
}