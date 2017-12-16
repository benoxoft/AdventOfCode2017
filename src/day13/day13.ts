
interface ILayer {
    readonly layerID: number;
    readonly steps: number;
    moveScanner();
    scannerOnTop(): boolean;
    reset(): void;
    clone(): ILayer;
}

export class UnscannedLayer implements ILayer {

    public readonly layerID: number;
    public readonly steps: number;

    public constructor(layerID: number) {
        this.layerID = layerID;
        this.steps = 0;
    }

    public moveScanner() {}

    public scannerOnTop(): boolean {
        return false;
    }

    public reset(): void {};

    public clone(): ILayer {
        return new UnscannedLayer(this.layerID);
    }
}

export class Layer implements ILayer{

    public readonly layerID: number;
    public readonly steps: number;
    private scannerPosition: number = 0;
    private directionUp: boolean = true;

    constructor(layerID:number, steps:number) {
        this.layerID = layerID;
        this.steps = steps;
    }

    public clone(): ILayer {
        const l = new Layer(this.layerID, this.steps);
        l.scannerPosition = this.scannerPosition;
        l.directionUp = this.directionUp;
        return l;
    }

    public moveScanner() {
        if(this.directionUp) {
            if(this.scannerOnTop()) {
                this.directionUp = !this.directionUp;
                this.scannerPosition++;
            } else {
                this.scannerPosition--;
            }
        } else {
            if(this.scannerPosition+1 === this.steps) {
                this.directionUp = !this.directionUp;
                this.scannerPosition--;
            } else {
                this.scannerPosition++;
            }
        }
    }

    public scannerOnTop(): boolean {
        return this.scannerPosition === 0;
    }

    public reset(): void {
        this.scannerPosition = 0;
        this.directionUp = true;
    }
}

export class Firewall {

    private readonly layers: ILayer[];
    private packetPosition: number = -1;
    private severity: number = 0;
    private caught: boolean = false;

    public clone(): Firewall {
        const newLayers = new Array<ILayer>();
        for(const layer of this.layers) {
            newLayers.push(layer.clone());
        }
        const f = new Firewall(newLayers);
        f.packetPosition = this.packetPosition;
        f.severity = this.severity;
        f.caught = this.caught;
        return f;
    }

    constructor(layers: ILayer[]) {
        this.layers = layers;
    }

    public tick() {
        if(this.packetPosition !== -1) {
            this.packetPosition++;
        }
        for(const layer of this.layers) {
            layer.moveScanner();
        }
        this.scan();
    }

    public injectPacket() {
        this.packetPosition = 0;
        this.scan();
    }

    public resetLayers() {
        this.severity = 0;
        this.caught = false;
        for(const layer of this.layers) {
            layer.reset();
        }
    }

    public getSeverity(): number {
        return this.severity;
    }

    public isCaught() {
        return this.caught;
    }

    private scan() {
        for(const layer of this.layers) {
            if(layer.scannerOnTop() && layer.layerID === this.packetPosition) {
                this.severity += layer.layerID * layer.steps
                this.caught = true;
            }
        }
    }
}

export function parseInput(input: string): ILayer[] {
    const retval = new Array<ILayer>();
    const lines = input.split("\n");
    let currentLayer = 0;
    for(const line of lines) {
        const [layerID, steps] = line.split(": ");
        while(currentLayer < +layerID) {
            currentLayer++;
            retval.push(new UnscannedLayer(currentLayer));
        }
        retval.push(new Layer(currentLayer, +steps));
    }
    return retval;
}

export function findSeverity(input: string) {
    const layers = parseInput(input);
    const firewall = new Firewall(layers);
    firewall.injectPacket();
    for(const layer of layers) {
        firewall.tick();
    }
    return firewall.getSeverity();
}

export function passThroughtFirewall(input: string) {
    const layers = parseInput(input);
    const baseFirewall = new Firewall(layers);
    let delay = 0;
    //for(let i=0;i<delay;i++) {
    //    baseFirewall.tick();
    //}
    while(delay < 10000000) {
        const firewall = baseFirewall.clone();
        firewall.injectPacket();
        for(const layer of layers) {
            firewall.tick();
            if(firewall.isCaught()) {
                break;
            }
        }
        if(!firewall.isCaught()) {
            return delay;
        } else {
            delay++;
            baseFirewall.tick();
        }
    }
    throw new Error("Could not find passage");
}