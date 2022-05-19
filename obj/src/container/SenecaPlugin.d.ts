/** @module container */
import { IReferences } from 'pip-services3-commons-node';
/**
 * Seneca plugin that acts as a container for seneca services.
 *
 * ### Example ###
 *
 * Todo: Add example
 */
export declare class SenecaPlugin {
    private _name;
    private _seneca;
    private _references;
    private _logger;
    /**
     * Creates a new instance of this container.
     *
     * @param name          a plugin name
     * @param seneca        a seneca instance
     * @param references    references with components and services that run inside this plugin
     */
    constructor(name: string, seneca: any, references: IReferences);
    /**
     * Gets the plugin name.
     *
     * @returns the plugin name.
     */
    get name(): string;
    private build;
    private open;
    private close;
}
