export class Range {
    start: number;
    end: number;

    constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
    }

    toFragment(): string {
        if (this.start === this.end) {
            return `#${this.start.toString()}`;
        }
        return `#${this.start.toString()}-${this.end.toString()}`;
    }
}
