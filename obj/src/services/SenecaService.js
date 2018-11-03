"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @module services */
/** @hidden */
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_components_node_2 = require("pip-services3-components-node");
const pip_services3_components_node_3 = require("pip-services3-components-node");
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
class SenecaService {
    constructor() {
        this._opened = false;
        this._dependencyResolver = new pip_services3_commons_node_5.DependencyResolver(SenecaService._defaultConfig);
        this._connectionResolver = new pip_services3_components_node_1.ConnectionResolver();
        this._logger = new pip_services3_components_node_2.CompositeLogger();
        this._counters = new pip_services3_components_node_3.CompositeCounters();
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        config = config.setDefaults(SenecaService._defaultConfig);
        this._connectionResolver.configure(config);
        this._dependencyResolver.configure(config);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._connectionResolver.setReferences(references);
        this._dependencyResolver.setReferences(references);
        let senecaInstance = this._dependencyResolver.getOneRequired('seneca');
        senecaInstance.setReferences(references);
        this._seneca = senecaInstance.getInstance();
        this.register();
    }
    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a Timing object that is used to end the time measurement.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param name              a method name.
     * @returns Timing object to end the time measurement.
     */
    instrument(correlationId, name) {
        this._logger.trace(correlationId, "Executing %s method", name);
        return this._counters.beginTiming(name + ".exec_time");
    }
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen() {
        return this._opened;
    }
    /**
     * Resolves and validates connection for Seneca service.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback          callback function that receives connection parameters or error.
     */
    resolveConnection(correlationId, callback) {
        this._connectionResolver.resolve(correlationId, (err, connection) => {
            if (err) {
                callback(err, null);
                return;
            }
            // Check for connection
            if (connection == null) {
                err = new pip_services3_commons_node_3.ConfigException(correlationId, "NO_CONNECTION", "Connection for Seneca service is not defined");
            }
            else {
                // Check for type
                let protocol = connection.getProtocol("none");
                if (protocol == 'none') {
                    // Skip futher checks
                    // } else if (protocol != 'http' && protocol != 'https' && protocol != 'web') {
                    //     err = new ConfigException(
                    //         correlationId, "WRONG_PROTOCOL", "Protocol is not supported by Seneca connection")
                    //         .withDetails("protocol", protocol);
                    //     // Check for host
                }
                else if (connection.getHost() == null) {
                    err = new pip_services3_commons_node_3.ConfigException(correlationId, "NO_HOST", "No host is configured in REST connection");
                    // Check for port
                }
                else if (connection.getPort() == 0) {
                    err = new pip_services3_commons_node_3.ConfigException(correlationId, "NO_PORT", "No port is configured in REST connection");
                }
            }
            callback(err, connection);
        });
    }
    /**
     * Opens the component.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    open(correlationId, callback) {
        if (this.isOpen()) {
            if (callback)
                callback(null);
            return;
        }
        this.resolveConnection(correlationId, (err, connection) => {
            if (err) {
                if (callback)
                    callback(err);
                return;
            }
            this._seneca.ready((err) => {
                if (err) {
                    if (callback)
                        callback(err);
                    return;
                }
                if (connection.getProtocol('none') == 'none') {
                    this._opened = true;
                    this._logger.debug(correlationId, "Seneca service started locally");
                }
                else {
                    try {
                        let protocol = connection.getProtocol('none');
                        let host = connection.getHost();
                        let port = connection.getPort();
                        let uri = connection.getUri() || protocol + "://" + host + ":" + port + "/";
                        let transport = {
                            type: protocol,
                            host: host,
                            port: port
                        };
                        this._seneca.listen(transport);
                        this._opened = true;
                        this._logger.debug(correlationId, "Seneca service started listening at %s", connection.getUri());
                    }
                    catch (ex) {
                        err = ex;
                    }
                }
                // This line causes seneca plugins to hang
                //if (callback) callback(err);
            });
        });
        if (callback)
            callback(null);
    }
    /**
     * Closes component and frees used resources.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    close(correlationId, callback) {
        // Todo: close listening?
        this._opened = false;
        if (callback)
            callback();
    }
    /**
     * Registers an action in Seneca endpoint.
     *
     * @param role          a service role (name)
     * @param cmd           a command name
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when action is invoked.
     */
    registerAction(role, cmd, schema, action) {
        if (role == '')
            throw new pip_services3_commons_node_2.UnknownException(null, 'NO_ROLE', 'Missing Seneca pattern role');
        if (cmd == '')
            throw new pip_services3_commons_node_2.UnknownException(null, 'NO_COMMAND', 'Missing Seneca pattern cmd');
        if (action == null)
            throw new pip_services3_commons_node_2.UnknownException(null, 'NO_ACTION', 'Missing Seneca action');
        if (!_.isFunction(action))
            throw new pip_services3_commons_node_2.UnknownException(null, 'ACTION_NOT_FUNCTION', 'Seneca action is not a function');
        // Define command pattern
        let pattern = {
            role: role,
            cmd: cmd,
            correlation_id: { type$: 'string' }
        };
        // Remember verification schema
        let validationSchema = null;
        if (schema instanceof pip_services3_commons_node_4.Schema)
            validationSchema = schema;
        else if (_.isObject(schema))
            pattern = _.defaults(pattern, schema);
        // Hack!!! Wrapping action to preserve prototyping context
        let actionCurl = (params, callback) => {
            // Perform validation
            if (validationSchema != null) {
                let correlationId = params.correlaton_id;
                let err = validationSchema.validateAndReturnException(correlationId, params, false);
                if (err != null) {
                    callback(err, null);
                    return;
                }
            }
            // Todo: perform verification?
            action.call(this, params, callback);
        };
        this._seneca.add(pattern, actionCurl);
    }
}
SenecaService._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples("dependencies.seneca", "pip-services:seneca:endpoint:*:*", "connection.protocol", "none", "connection.host", "0.0.0.0", "connection.port", 3000, "options.connect_timeout", 30000);
exports.SenecaService = SenecaService;
//# sourceMappingURL=SenecaService.js.map