/*
37  36  35  34  33  32  31
38  17  16  15  14  13  30
39  18   5   4   3  12  29
40  19   6   1   2  11  28
41  20   7   8   9  10  27
42  21  22  23  24  25  26
43  44  45  46  47  48  49
*/

/*
147  142  133  122   59
304    5    4    2   57
330   10    1    1   54
351   11   23   25   26
362  747  806  880  931
*/

enum Direction {
    RIGHT = 0,
    UP,
    LEFT,
    DOWN,
}

class MemoryNode {

    private  topLeftNode: MemoryNode;
    private topNode: MemoryNode;
    private topRightNode: MemoryNode;
    private leftNode: MemoryNode;
    private rightNode: MemoryNode;
    private bottomLeftNode: MemoryNode;
    private bottomNode: MemoryNode;
    private bottomRightNode: MemoryNode;
    private readonly nodeValue: number;
    private readonly direction: Direction;
    private readonly step: number;

    private constructor({
            step,
            topLeftNode = undefined,
            topNode = undefined,
            topRightNode = undefined,
            leftNode = undefined,
            rightNode = undefined,
            bottomLeftNode = undefined,
            bottomNode = undefined,
            bottomRightNode = undefined,
            nodeValue = 0,
            direction = Direction.RIGHT,
        } : {
            topLeftNode?: MemoryNode,
            topNode?: MemoryNode,
            topRightNode?: MemoryNode,
            leftNode?: MemoryNode,
            rightNode?: MemoryNode,
            bottomLeftNode?: MemoryNode,
            bottomNode?: MemoryNode,
            bottomRightNode?: MemoryNode,
            nodeValue?: number,
            direction?: Direction,
            step: number,
    }) {
        this.step = step + 1;
        this.topLeftNode = topLeftNode;
        this.topNode = topNode;
        this.topRightNode = topRightNode;
        this.rightNode = rightNode;
        this.leftNode = leftNode;
        this.bottomLeftNode = bottomLeftNode;
        this.bottomNode = bottomNode;
        this.bottomRightNode = bottomRightNode;
        this.direction = direction;
        if(nodeValue === 0) {
            this.nodeValue = this.calculateNodeValue();
        } else {
            this.nodeValue = nodeValue;
        }
        this.backlink();
    }

    private backlink(): void {
        if(this.topLeftNode !== undefined)
            this.topLeftNode.topRightNode = this;
        if(this.topNode !== undefined)
            this.topNode.bottomNode = this;
        if(this.topRightNode !== undefined)
            this.topRightNode.bottomLeftNode = this;
        if(this.leftNode !== undefined)
            this.leftNode.rightNode = this;
        if(this.rightNode !== undefined)
            this.rightNode.leftNode = this;
        if(this.bottomRightNode !== undefined)
            this.bottomRightNode.topLeftNode = this;
        if(this.bottomNode !== undefined)
            this.bottomNode.topNode = this;
        if(this.bottomLeftNode !== undefined)
            this.bottomLeftNode.topRightNode = this;
    }

    private calculateNodeValue(): number {
        let value = 0;
        if(this.topLeftNode !== undefined)
            value += this.topLeftNode.nodeValue;
        if(this.topNode !== undefined)
            value += this.topNode.nodeValue;
        if(this.topRightNode !== undefined)
            value += this.topRightNode.nodeValue;
        if(this.leftNode !== undefined)
            value += this.leftNode.nodeValue;
        if(this.rightNode !== undefined)
            value += this.rightNode.nodeValue;
        if(this.bottomRightNode !== undefined)
            value += this.bottomRightNode.nodeValue;
        if(this.bottomNode !== undefined)
            value += this.bottomNode.nodeValue;
        if(this.bottomLeftNode !== undefined)
            value += this.bottomLeftNode.nodeValue;

        return value;
    }

    public static createInitialNode(): MemoryNode {
         return new MemoryNode({step: 0, nodeValue: 1, direction: Direction.RIGHT});
    }

    public getNodeValue(): number {
        return this.nodeValue;
    }

    public getDirection(): Direction {
        return this.direction;
    }

    public createNextNode(): MemoryNode {
        if(this.direction === Direction.RIGHT)
            return this.createRightNode();
        else if(this.direction === Direction.DOWN)
            return this.createBottomNode();
        else if(this.direction === Direction.LEFT)
            return this.createLeftNode();
        else if(this.direction === Direction.UP)
            return this.createTopNode();
        else
            throw new Error("Unknown direction");
    }

    private createRightNode(): MemoryNode {
        let direction = Direction.RIGHT;
        let topRightNode = undefined;
        if(this.topRightNode === undefined) {
            direction = Direction.UP;
        } else {
            topRightNode = this.topRightNode.rightNode;
        }
        return new MemoryNode({
            step: this.step,
            leftNode: this,
            topLeftNode: this.topNode,
            topNode: this.topRightNode,
            topRightNode: topRightNode,
            direction: direction,
        });
    }

    private createTopNode(): MemoryNode {
        let direction = Direction.UP;
        let topLeftNode = undefined;
        if(this.topLeftNode === undefined) {
            direction = Direction.LEFT;
        } else {
            topLeftNode = this.topLeftNode.topNode;
        }
        return new MemoryNode({
            step: this.step,
            bottomNode: this,
            bottomLeftNode: this.leftNode,
            leftNode: this.topLeftNode,
            topLeftNode: topLeftNode,
            direction: direction,
        });
    }

    private createLeftNode(): MemoryNode {
        let direction = Direction.LEFT;
        let bottomLeftNode = undefined;
        if(this.bottomLeftNode === undefined) {
            direction = Direction.DOWN;
        } else {
            bottomLeftNode = this.bottomLeftNode.leftNode;
        }
        return new MemoryNode({
            step: this.step,
            rightNode: this,
            bottomRightNode: this.bottomNode,
            bottomNode: this.bottomLeftNode,
            bottomLeftNode: bottomLeftNode,
            direction: direction,
        });
    }

    private createBottomNode(): MemoryNode{
        let direction = Direction.DOWN;
        let bottomRightNode = undefined;
        if(this.bottomRightNode === undefined) {
            direction = Direction.RIGHT;
        } else {
            bottomRightNode = this.bottomRightNode.bottomNode;
        }
        return new MemoryNode({
            step: this.step,
            topNode: this,
            topRightNode: this.rightNode,
            rightNode: this.bottomRightNode,
            bottomRightNode: bottomRightNode,
            direction: direction,
        });
    }
}

export function findStepAfterValue(input: number): number {
    let node = MemoryNode.createInitialNode();
    let count = 10000;
    while(count > 0) {
        count --;
        node = node.createNextNode();
        if(node.getNodeValue() > input) {
            return node.getNodeValue();
        }
    }
}