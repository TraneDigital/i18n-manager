import { CommanderStatic } from "commander";
export declare function prettifyJson<T>(object: T): string;
/**
 * Validate input options
 * if not valid exit with code 1
 * @param {CommanderStatic} program
 */
export declare function programValidate(program: CommanderStatic): Promise<void>;
