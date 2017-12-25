import {getPuzzleInput} from "./puzzle-input";
import {
    countNonDestroyedParticles,
    createParticle, destroyCollidingParticles, findClosestParticle, findClosestParticlePart2, parseInput,
    parseVectorString, Particle,
    Vector3
} from "../day20";

it("should parse a vector string", () => {
    expect(parseVectorString("p=<5556,2862,7112>")).toEqual(new Vector3(5556, 2862, 7112));
    expect(parseVectorString("v=<-6,-118,-35>")).toEqual(new Vector3(-6, -118, -35));
    expect(parseVectorString("a=<-9,2,-10>")).toEqual(new Vector3(-9, 2, -10));
});

it("should create a proper particle", () => {
    const input = "p=<5556,2862,7112>, v=<-6,-118,-35>, a=<-9,2,-10>";
    const particle = new Particle(
        new Vector3(5556, 2862, 7112),
        new Vector3(-6, -118, -35),
        new Vector3(-9, 2, -10)
    );
    expect(createParticle(input, -1)).toEqual(particle);
});

it("should follow the example", () => {
    const input = `p=<3,0,0>, v=<2,0,0>, a=<-1,0,0>
p=<4,0,0>, v=<0,0,0>, a=<-2,0,0>`;
    const particles = parseInput(input);
    expect(particles[0].getPosition()).toEqual(new Vector3(3, 0, 0));
    expect(particles[0].getVelocity()).toEqual(new Vector3(2, 0, 0));
    expect(particles[0].acceleration).toEqual(new Vector3(-1, 0, 0));

    expect(particles[1].getPosition()).toEqual(new Vector3(4, 0, 0));
    expect(particles[1].getVelocity()).toEqual(new Vector3(0, 0, 0));
    expect(particles[1].acceleration).toEqual(new Vector3(-2, 0, 0));

    particles[0].move();
    particles[1].move();
    expect(particles[0].getPosition()).toEqual(new Vector3(4, 0, 0));
    expect(particles[0].getVelocity()).toEqual(new Vector3(1, 0, 0));
    expect(particles[0].acceleration).toEqual(new Vector3(-1, 0, 0));

    expect(particles[1].getPosition()).toEqual(new Vector3(2, 0, 0));
    expect(particles[1].getVelocity()).toEqual(new Vector3(-2, 0, 0));
    expect(particles[1].acceleration).toEqual(new Vector3(-2, 0, 0));

    particles[0].move();
    particles[1].move();
    expect(particles[0].getPosition()).toEqual(new Vector3(4, 0, 0));
    expect(particles[0].getVelocity()).toEqual(new Vector3(0, 0, 0));
    expect(particles[0].acceleration).toEqual(new Vector3(-1, 0, 0));

    expect(particles[1].getPosition()).toEqual(new Vector3(-2, 0, 0));
    expect(particles[1].getVelocity()).toEqual(new Vector3(-4, 0, 0));
    expect(particles[1].acceleration).toEqual(new Vector3(-2, 0, 0));

    particles[0].move();
    particles[1].move();
    expect(particles[0].getPosition()).toEqual(new Vector3(3, 0, 0));
    expect(particles[0].getVelocity()).toEqual(new Vector3(-1, 0, 0));
    expect(particles[0].acceleration).toEqual(new Vector3(-1, 0, 0));

    expect(particles[1].getPosition()).toEqual(new Vector3(-8, 0, 0));
    expect(particles[1].getVelocity()).toEqual(new Vector3(-6, 0, 0));
    expect(particles[1].acceleration).toEqual(new Vector3(-2, 0, 0));

});

it("should remove colliding particles", () => {
    const particle1 = new Particle(
        new Vector3(1, 1, 1),
        new Vector3(-6, -118, -35),
        new Vector3(-9, 2, -10),
        1
    );
    const particle2 = new Particle(
        new Vector3(2, 2, 2),
        new Vector3(-6, -118, -35),
        new Vector3(-9, 2, -10),
        2
    );
    const particle3 = new Particle(
        new Vector3(1, 1, 1),
        new Vector3(-6, -118, -35),
        new Vector3(-9, 2, -10),
        3
    );
    expect(destroyCollidingParticles([particle1, particle2, particle3])).toEqual([particle2]);
});

//console.log("Answer 1: ", findClosestParticle(getPuzzleInput()).id);
console.log("Answer 2: ", countNonDestroyedParticles(getPuzzleInput()));
