import * as constants from './constants';
import { GitContext } from './git';
import * as range from './range';

type RangeConfigParams = {
    lineSeparator: string | undefined;
    linePrefix: string | undefined;
    lineRangeSeparator: string | undefined;
};

type ContextParams = {
    git?: GitContext | null,
    lines?: range.Range,
    rangeConfig?: RangeConfigParams,
};

export class Context {
    env: NodeJS.ProcessEnv;
    git: GitContext | null;
    lines: range.Range | null;
    match: RegExpExecArray | null;
    rangeConfig: range.Config;

    constructor(params: ContextParams) {
        this.env = process.env;
        this.git = params.git ?? null;
        this.lines = params.lines ?? null;
        this.match = null;
        this.rangeConfig = {
            lineSeparator: constants.DEFAULT_LINE_SEPARATOR,
            linePrefix: null,
            lineRangeSeparator: constants.DEFAULT_LINE_RANGE_SEPARATOR,
        };

        if (params.rangeConfig) {
            this.setRangeConfigParams(params.rangeConfig);
        }
    }

    setRangeConfigParams(params: RangeConfigParams): void {
        this.rangeConfig.lineSeparator = params.lineSeparator ?? this.rangeConfig.lineSeparator;
        this.rangeConfig.linePrefix = params.linePrefix ?? this.rangeConfig.linePrefix;
        this.rangeConfig.lineRangeSeparator = params.lineRangeSeparator ?? this.rangeConfig.lineRangeSeparator;
    }
}
