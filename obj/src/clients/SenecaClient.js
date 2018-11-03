"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @module clients */
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
class SenecaClient {
    constructor() {
        this._opened = false;
        this._schemas = {};
        this._dependencyResolver = new pip_services3_commons_node_5.DependencyResolver(SenecaClient._defaultConfig);
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
        config = config.setDefaults(SenecaClient._defaultConfig);
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
     * Resolves and validates connection to Seneca service.
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
                callback();
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
                    this._logger.debug(correlationId, "Seneca client connected locally");
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
                        this._seneca.client(transport);
                        this._opened = true;
                        this._logger.debug(correlationId, "Seneca client connected to %s", uri);
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
     * Calls a remote method via HTTP/REST protocol.
     *
     * @param role              a service role (service name)
     * @param cmd               a command name
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param params            (optional) command parameters.
     * @param callback          (optional) callback function that receives result object or error.
     */
    call(role, cmd, correlationId, params = {}, callback) {
        let err = null;
        if (role == '')
            err = new pip_services3_commons_node_4.UnknownException(null, 'NO_ROLE', 'Missing Seneca pattern role');
        if (cmd == '')
            err = new pip_services3_commons_node_4.UnknownException(null, 'NO_COMMAND', 'Missing Seneca pattern cmd');
        if (err) {
            if (callback)
                callback(err, null);
            else
                this._logger.error(correlationId, err, 'Failed to call %s:%s', role, cmd);
            return;
        }
        params = _.clone(params);
        params.role = role;
        params.cmd = cmd;
        correlationId = correlationId || pip_services3_commons_node_2.IdGenerator.nextShort();
        params.correlation_id = correlationId;
        this._seneca.act(params, callback);
    }
}
SenecaClient._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples("dependencies.seneca", "pip-services:seneca:endpoint:*:*", "connection.protocol", "http", "connection.host", "0.0.0.0", "connection.port", 3000, "options.connect_timeout", 30000);
exports.SenecaClient = SenecaClient;
//# sourceMappingURL=SenecaClient.js.map