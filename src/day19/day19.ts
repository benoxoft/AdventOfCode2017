import {lintSyntaxError} from "tslint/lib/verify/lintError";

export enum Direction {
    top = 1,
    bottom,
    left,
    right
};

export interface IRoute {
    link(line: number, column: number, map: IRoute[][]);
    travel(toDirection: Direction, letterAggregator: string[]): [IRoute, Direction];
    canTravel(toDirection: Direction, fromRoute: IRoute): boolean;
    getTopRoute(): IRoute;
    getBottomRoute(): IRoute;
    getRightRoute(): IRoute;
    getLeftRoute(): IRoute;
    toString(): String;
    getX(): number;
    getY(): number;
}

export class BlankRoute implements IRoute {

    public getX(): number {
        return -1
    }

    public getY(): number {
        return -1;
    }

    public link(line: number, column: number, map: IRoute[][]) {

    }

    public travel(toDirection: Direction, letterAggregator: string[]): [IRoute, Direction] {
        throw new Error("Can't travel");
    }

    public canTravel(toDirection: Direction, fromRoute: IRoute) {
        return false;
    }

    public getTopRoute(): IRoute {
        return undefined;
    }

    public getBottomRoute(): IRoute {
        return undefined;
    }

    public getRightRoute(): IRoute {
        return undefined;
    }

    public getLeftRoute(): IRoute {
        return undefined;
    }

    public printLetters(): string {
        throw new Error("Cannot print letters");
    }

    public toString(): string {
        return "Blank space";
    }
}

export abstract class BaseRoute implements IRoute {

    protected topRoute: IRoute;
    protected bottomRoute: IRoute;
    protected leftRoute: IRoute;
    protected rightRoute: IRoute;

    public abstract travel(toDirection: Direction, letterAggregator: string[]): [IRoute, Direction];
    public abstract canTravel(toDirection: Direction, fromRoute: IRoute);

    private line: number;
    private column: number;

    public getX(): number {
        return this.line;
    }

    public getY(): number {
        return this.column;
    }

    public link(line: number, column: number, map: IRoute[][]) {
        this.line = line;
        this.column = column;
        if(line - 1 >= 0) {
            this.topRoute = map[line-1][column];
        }
        if(line + 1 < map.length) {
            this.bottomRoute = map[line+1][column];
        }
        if(column - 1 >= 0) {
            this.leftRoute = map[line][column-1];
        }
        if(column + 1 < map[0].length) {
            this.rightRoute = map[line][column+1];
        }
    }

    public getTopRoute(): IRoute {
        return this.topRoute;
    }

    public getBottomRoute(): IRoute {
        return this.bottomRoute;
    }

    public getRightRoute(): IRoute {
        return this.rightRoute;
    }

    public getLeftRoute(): IRoute {
        return this.leftRoute;
    }

    public toString(): string {
        return "(" + this.line.toString() + "," + this.column.toString() + ")";
    }
}

export class LetterRoute extends BaseRoute {

    public readonly letter: string;

    public constructor(letter: string) {
        super();
        this.letter = letter;
    }

    public skipLetterRoute(toDirection: Direction, letterAggregator: string[]): IRoute {
        if(toDirection === Direction.right) {
            if(this.rightRoute instanceof PipeRoute) {
                return this.rightRoute.skipPipeRoute(toDirection, letterAggregator);
            } else if(this.rightRoute instanceof DashRoute) {
                return this.rightRoute;
            }
        } else if(toDirection === Direction.bottom) {
            if(this.bottomRoute instanceof DashRoute) {
                return this.bottomRoute.skipDashRoute(toDirection, letterAggregator);
            } else if(this.bottomRoute instanceof PipeRoute) {
                return this.bottomRoute
            }
        } else if(toDirection === Direction.left) {
            if(this.leftRoute instanceof PipeRoute) {
                return this.leftRoute.skipPipeRoute(toDirection, letterAggregator);
            } else if(this.leftRoute instanceof DashRoute) {
                return this.leftRoute;
            }
        } else if(toDirection === Direction.top) {
            if(this.topRoute instanceof DashRoute) {
                return this.topRoute.skipDashRoute(toDirection, letterAggregator)
            } else {
                return this.topRoute;
            }
        } else {
            throw new Error("Can't skip letter route");
        }
    }

    public travel(toDirection: Direction, letterAggregator: string[]): [IRoute, Direction] {
        throw new Error("Can't travel on a letter " + this.letter);
    }

    public canTravel(toDirection: Direction, fromRoute: IRoute) {
        return false;
    }

    public toString(): string {
        return super.toString() + " " + "Letter: " + this.letter;
    }
}

export class PlusRoute extends BaseRoute {

    public travel(toDirection: Direction, letterAggregator: string[]): [IRoute, Direction] {
        if(toDirection !== Direction.bottom) {
            if(this.topRoute !== undefined && !(this.topRoute instanceof BlankRoute)) {
                if(this.topRoute instanceof LetterRoute) {
                    letterAggregator.push(this.topRoute.letter);
                    return [this.topRoute.skipLetterRoute(Direction.top, letterAggregator), Direction.top];
                } else {
                    return [this.topRoute, Direction.top];
                }
            }
        }
        if(toDirection !== Direction.left) {
            if(this.rightRoute !== undefined && !(this.rightRoute instanceof BlankRoute)) {
                if(this.rightRoute instanceof LetterRoute) {
                    letterAggregator.push(this.rightRoute.letter);
                    return [this.rightRoute.skipLetterRoute(Direction.right, letterAggregator), Direction.right];
                } else {
                    return [this.rightRoute, Direction.right];
                }
            }
        }
        if(toDirection !== Direction.right) {
            if(this.leftRoute !== undefined && !(this.leftRoute instanceof BlankRoute)) {
                if(this.leftRoute instanceof LetterRoute) {
                    letterAggregator.push(this.leftRoute.letter);
                    return [this.leftRoute.skipLetterRoute(Direction.left, letterAggregator), Direction.left];
                } else {
                    return [this.leftRoute, Direction.left];
                }
            }
        }
        if(toDirection !== Direction.top) {
            if(this.bottomRoute !== undefined && !(this.bottomRoute instanceof BlankRoute)) {
                if(this.bottomRoute instanceof LetterRoute) {
                    letterAggregator.push(this.bottomRoute.letter);
                    return [this.bottomRoute.skipLetterRoute(Direction.bottom, letterAggregator), Direction.bottom]
                } else {
                    return [this.bottomRoute, Direction.bottom];
                }
            }
        }
        throw new Error("Can't travel");
    }

    public canTravel(toDirection: Direction, fromRoute: IRoute): boolean {
        return true;
    }

    public toString(): string {
        return super.toString() + " +";
    }
}

export class PipeRoute extends BaseRoute {

    public travel(toDirection: Direction, letterAggregator: string[]): [IRoute, Direction] {
        if(toDirection === Direction.top) {
            if(this.topRoute instanceof LetterRoute) {
                letterAggregator.push(this.topRoute.letter);
                return [this.topRoute.skipLetterRoute(toDirection, letterAggregator), toDirection];
            } else if(this.topRoute instanceof DashRoute) {
                return [this.topRoute.skipDashRoute(toDirection, letterAggregator), toDirection];
            } else {
                return [this.topRoute, Direction.top];
            }
        } else if(toDirection === Direction.bottom) {
            if(this.bottomRoute instanceof LetterRoute) {
                letterAggregator.push(this.bottomRoute.letter);
                return [this.bottomRoute.skipLetterRoute(toDirection, letterAggregator), toDirection];
            } else if(this.bottomRoute instanceof DashRoute) {
                return [this.bottomRoute.skipDashRoute(toDirection, letterAggregator), toDirection];
            }
            return [this.bottomRoute, Direction.bottom];
        } else {
            throw new Error("Can't travel");
        }

    }

    public skipPipeRoute(toDirection: Direction, letterAggregator: string[]): IRoute {
        if(toDirection === Direction.right) {
            if(this.rightRoute instanceof LetterRoute) {
                letterAggregator.push(this.rightRoute.letter);
                return this.rightRoute.skipLetterRoute(toDirection, letterAggregator);
            } else if(this.rightRoute instanceof DashRoute) {
                return this.rightRoute;
            }
        } else if(toDirection === Direction.left) {
            if(this.leftRoute instanceof LetterRoute) {
                letterAggregator.push(this.leftRoute.letter);
                return this.leftRoute.skipLetterRoute(toDirection, letterAggregator);
            } else if(this.leftRoute instanceof DashRoute) {
                return this.leftRoute;
            }

        }
        throw new Error("Can't skip pipe");
    }

    public canTravel(toDirection: Direction, fromRoute: IRoute): boolean {
        if(toDirection === Direction.top && fromRoute !instanceof DashRoute) {
            return true;
        } else if(toDirection === Direction.bottom && fromRoute !instanceof DashRoute) {
            return true;
        } else {
            return false;
        }
    }

    public toString(): string {
        return super.toString() + " |";
    }
}

export class DashRoute extends BaseRoute {

    public skipDashRoute(toDirection: Direction, letterAggregator: string[]): IRoute {
        if(toDirection === Direction.top) {
            if(this.topRoute instanceof LetterRoute) {
                letterAggregator.push(this.topRoute.letter);
                return this.topRoute.skipLetterRoute(toDirection, letterAggregator);
            } else if(this.topRoute instanceof PipeRoute) {
                return this.topRoute;
            }
        } else if(toDirection === Direction.bottom) {
            if(this.bottomRoute instanceof LetterRoute) {
                letterAggregator.push(this.bottomRoute.letter);
                return this.bottomRoute.skipLetterRoute(toDirection, letterAggregator);
            } else if(this.bottomRoute instanceof PipeRoute) {
                return this.bottomRoute;
            }

        }
        throw new Error("Can't skip dash");
    }

    public travel(toDirection: Direction, letterAggregator: string[]): [IRoute, Direction] {
        if(toDirection === Direction.right) {
            if(this.rightRoute instanceof LetterRoute) {
                letterAggregator.push(this.rightRoute.letter);
                return [this.rightRoute.skipLetterRoute(toDirection, letterAggregator), toDirection];
            } else if(this.rightRoute instanceof PipeRoute) {
                return [this.rightRoute.skipPipeRoute(toDirection, letterAggregator), Direction.right];
            } else if(this.rightRoute instanceof LetterRoute) {

            } else {
                return [this.rightRoute, Direction.right];
            }
        } else if(toDirection === Direction.left) {
            if(this.leftRoute instanceof LetterRoute) {
                letterAggregator.push(this.leftRoute.letter);
                return [this.leftRoute.skipLetterRoute(toDirection, letterAggregator), toDirection];
            } else if(this.leftRoute instanceof PipeRoute) {
                return [this.leftRoute.skipPipeRoute(toDirection, letterAggregator), Direction.left];
            } else {
                return [this.leftRoute, Direction.left];
            }
        } else {
            throw new Error("Unknown directon");
        }
    }

    public canTravel(toDirection: Direction): boolean {
        return false;
    }

    public toString(): string {
        return super.toString() + " -";
    }
}

export function createRoute(c: string): IRoute {
    if(c === " ") {
        return new BlankRoute();
    } else if(c === "-") {
        return new DashRoute();
    } else if(c === "|") {
        return new PipeRoute();
    } else if(c === "+") {
        return new PlusRoute();
    } else {
        return new LetterRoute(c);
    }
}

export function parseMap(input: string) {
    const lines = input.split("\n");
    const map = new Array<Array<IRoute>>();
    for(const line of lines) {
        const mapLine = new Array<IRoute>();
        map.push(mapLine);
        for(const c of line) {
            mapLine.push(createRoute(c));
        }
    }

    for(let i=0;i<map.length;i++) {
        for(let j=0;j<map[0].length;j++) {
            map[i][j].link(i, j, map);
        }
    }
    return map;
}

export function followRoute(map: IRoute[][]): [string, number] {
    let nextRoute: IRoute;

    for(const route of map[0]) {
        if(route instanceof PipeRoute) {
            nextRoute = route;
            break;
        }
    }
    console.log("initial route: ", nextRoute.toString());
    const letterAggregator = new Array<string>();
    let direction: Direction;
    [nextRoute, direction] = nextRoute.travel(Direction.bottom, letterAggregator);
    let steps = 2;
    console.log("second route: ", nextRoute.toString());
    while(true) {
        const line = nextRoute.getX();
        const column = nextRoute.getY();
        [nextRoute, direction] = nextRoute.travel(direction, letterAggregator);
        if(nextRoute === undefined || nextRoute instanceof BlankRoute) {
            break;
        }
        steps += Math.abs(nextRoute.getX() - line);
        steps += Math.abs(nextRoute.getY() - column);
        console.log(nextRoute.toString(), direction, letterAggregator.join(""));
    }
    return [letterAggregator.join(""), steps+1];
}
