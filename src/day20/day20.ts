
export class Vector3 {

    public readonly x: number;
    public readonly y: number;
    public readonly z: number;

    public constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public add(vect: Vector3): Vector3 {
        return new Vector3(this.x+vect.x, this.y+vect.y, this.z+vect.z);
    }

    public distance(vect: Vector3): number {
        return Math.abs(this.x - vect.x)+ Math.abs(this.y - vect.y) + Math.abs(this.z - vect.z);
    }

    public equals(vect: Vector3): boolean {
        return this.x === vect.x && this.y === vect.y && this.z === vect.z;
    }

    public toString(): string {
        return "Vector<" + this.x.toString() + "," + this.y.toString() + "," + this.z.toString() + ">";
    }
}

export class Particle {

    public readonly acceleration: Vector3;
    private velocity: Vector3;
    private position: Vector3;
    public readonly id: number;

    public constructor(position: Vector3, velocity: Vector3, acceleration: Vector3, id: number=-1) {
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.position = position;
        this.id = id;
    }

    public getPosition(): Vector3 {
        return this.position;
    }

    public getVelocity(): Vector3 {
        return this.velocity;
    }

    public move() {
        this.velocity = this.velocity.add(this.acceleration);
        this.position = this.position.add(this.velocity);
    }
}

export function parseVectorString(vStr): Vector3 {
    const tokens = vStr.slice(3).replace(">", "").split(",");
    const vect = new Vector3(+tokens[0], +tokens[1], +tokens[2]);
    return vect;
}

export function createParticle(line: string, id: number): Particle {
    const tokens = line.split(", ");
    const pos = parseVectorString(tokens[0]);
    const vel = parseVectorString(tokens[1]);
    const acc = parseVectorString(tokens[2]);
    return new Particle(pos, vel, acc, id);
}

export function parseInput(input: string): Particle[] {
    //p=<5556,2862,7112>, v=<-6,-118,-35>, a=<-9,2,-10>
    const retval = new Array<Particle>();
    let counter = 0;
    for(const line of input.split("\n")) {
        retval.push(createParticle(line, counter));
        counter++;
    }

    return retval;
}

export function moveParticles(particles: Particle[], iterations: number, destroyParticle: boolean) {
    for(let i=0; i<iterations; i++) {
        for(const particle of particles) {
            particle.move();
        }
        if(destroyParticle)
            particles = destroyCollidingParticles(particles);
    }
    return particles;
}

export function closestToZero(particles: Particle[]): Particle {
    const vect0 = new Vector3(0, 0, 0,);
    let smallestDistance = Number.MAX_SAFE_INTEGER;
    let closestParticle = undefined;
    for(const particle of particles) {
        const distance = particle.getPosition().distance(vect0);
        if(distance < smallestDistance) {
            smallestDistance = distance;
            closestParticle = particle;
        }
    }
    return closestParticle;
}

export function destroyCollidingParticles(particles: Particle[]): Particle[] {
    const toDelete = new Array<Particle>();

    for(const part1 of particles) {
        for(const part2 of particles) {
            if(part1.getPosition().equals(part2.getPosition()) && part1.id !== part2.id) {
                toDelete.push(part1);
                toDelete.push(part2);
            }
        }
    }
    if(toDelete.length > 0)
        return particles.filter(particle => toDelete.indexOf(particle) === -1);
    else
        return particles;

}

export function findClosestParticle(input: string): Particle {
    let particles = parseInput(input);
    let countSameParticle = 0;
    const iterations = 10000;
    let closestParticle: Particle;
    while(countSameParticle <= 10) {
        particles = moveParticles(particles, iterations, false);
        const foundParticle = closestToZero(particles);
        if(foundParticle === closestParticle) {
            countSameParticle++;
        } else {
            countSameParticle = 0;
            closestParticle = foundParticle;
        }
    }
    return closestParticle;
}

export function countNonDestroyedParticles(input: string): number {
    let particles = parseInput(input);
    let countSameParticle = 0;
    const iterations = 10000;
    let closestParticle: Particle;
    particles = destroyCollidingParticles(particles);
    while(countSameParticle <= 10) {
        particles = moveParticles(particles, iterations, true);
        const foundParticle = closestToZero(particles);
        if(foundParticle === closestParticle) {
            countSameParticle++;
        } else {
            countSameParticle = 0;
            closestParticle = foundParticle;
        }
    }
    return particles.length;
}
