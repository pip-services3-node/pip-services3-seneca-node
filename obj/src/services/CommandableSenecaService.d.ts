import { SenecaService } from './SenecaService';
/**
 * Abstract service that receives remove calls via Seneca protocol
 * to operations automatically generated for commands defined in [[https://pip-services3-node.github.io/pip-services3-commons-node/interfaces/commands.icommandable.html ICommandable]] components.
 * Each command is exposed as a Seneca action with the same name.
 *
 * Commandable services require only 3 lines of code to implement a robust external
 * SenecaHTTP-based remote interface.
 *
 * ### Configuration parameters ###
 *
 * - dependencies:
 *   - endpoint:              override for HTTP Endpoint dependency
 *   - controller:            override for Controller dependency
 * - connection(s):
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - protocol:              connection protocol: http or https
 *   - host:                  host name or IP address
 *   - port:                  port number
 *   - uri:                   resource URI or connection string with all parameters in it
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>           (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>         (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * - <code>\*:endpoint:seneca:\*:1.0</code>        (optional) [[SenecaEndpoint]] reference
 *
 * @see [[CommandableSenecaClient]]
 * @see [[RestService]]
 *
 * ### Example ###
 *
 *     class MyCommandableSenecaService extends CommandableSenecaService {
 *        public constructor() {
 *           base("mydata");
 *           this._dependencyResolver.put(
 *               "controller",
 *               new Descriptor("mygroup","controller","*","*","1.0")
 *           );
 *        }
 *     }
 *
 *     let service = new MyCommandableSenecaService();
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
 *        console.log("The REST service is running on port 8080");
 *     });
 */
export declare abstract class CommandableSenecaService extends SenecaService {
    private _role;
    private _commandSet;
    /**
     * Creates a new instance of this service.
     *
     * @param role      a service role (name).
     */
    constructor(role: string);
    /**
     * Registers all service actions.
     */
    register(): void;
}
