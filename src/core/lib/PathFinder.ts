import { Matrix } from './Matrix';

interface Vector2 {
  x: number;
  y: number;
}

type PathFinderHeuristic = (
  a: PNode,
  b: PNode,
  instance?: PathFinder,
) => number;
type CanWalkFunction = (cell: PNode, current: PNode) => boolean;

function processNeighbors(
  grid: Grid,
  current: PNode,
  start: PNode,
  goal: PNode,
  instance: PathFinder,
) {
  const neighbors = [];

  const possibleNeighbors = grid.neighborsOf(current.x, current.y, instance.diagonalEnabled ? Matrix.NEIGHBORS_ALL : Matrix.NEIGHBORS_ADJACENT)
  const len = possibleNeighbors.length;
  for (let i = 0; i < len; i++) {
    const block = possibleNeighbors[i];
    if (
      block &&
      !block.closed &&
      block.walkable &&
      instance.canWalk(block, current)
    ) {
      const diagonal = instance.diagonalEnabled && i % 2 === 0;

      const cost = instance.getCostsOf(block, diagonal);
      block.parent = current;
      block.closed = true;
      block.g = instance.heuristic(block, start, instance) * cost;
      block.h = instance.heuristic(block, goal, instance) * cost;
      neighbors.push(block);
    }
  }
  return neighbors;
}

class PNode {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0,
    public walkable = false,
    public g: number = 0,
    public h: number = 0,
    public parent: PNode = null,
    public closed: boolean = false,
  ) {}

  get f() {
    return this.g + this.h;
  }
}

class Grid extends Matrix<PNode> {
  constructor(grid: Matrix<number> | number[][] = []) {
    let height: number, width: number, grd: Matrix<number>

    if (grid instanceof Matrix) {
      height = grid.height
      width = grid.width
      grd = Matrix.from(grid)
    } else {
      height = grid.length
      width = grid[0].length
      grd = Matrix.from(grid)
    }

    super(width, height)

    this.forEach((_, x, y) => {
      const tile = grd.get(x, y)
      const node = new PNode(x, y, tile, tile !== 0);
      this.set(x, y, node)
    })
  }
}

function getPath(node: PNode) {
  let path: [number, number][] = [];

  while (node.parent) {
    path.unshift([node.x, node.y]);
    node = node.parent;
  }

  return path;
}

const { abs, sqrt, SQRT2 } = Math;

export class PathFinder {
  static DIAGONAL_COST = Math.SQRT2; //SQRT2
  static STRAIGHT_COST = 1;
  static Heuristic = {
    Manhattan: (a: PNode, b: PNode) => abs(a.y - b.y) + abs(a.x - b.x),
    Euclidean: (a: PNode, b: PNode) =>
      sqrt((a.x - b.x) ** 2 + (a.x - b.x) ** 2),
  };

  public heuristic: PathFinderHeuristic = PathFinder.Heuristic.Manhattan;
  public grid: Grid;
  public diagonalEnabled = true;
  private costs: {
    test: (block: PNode) => boolean;
    cost: number;
  }[] = [];

  addAdditionalCost(test: (block: PNode) => boolean, cost = 1) {
    this.costs.push({ cost, test });
    return this;
  }

  getCostsOf(block: PNode, diagonal = false) {
    const cost = this.costs
      .filter(item => item.test(block))
      .reduce((sum, item) => sum + item.cost, 1);

    return cost;
  }

  constructor(
    grid: Grid | Matrix<number> | number[][] = [],
    public canWalk: CanWalkFunction = () => true,
  ) {
    if (grid instanceof Grid) this.grid = grid;
    else if (grid instanceof Matrix || Array.isArray(grid)) {
      this.grid = new Grid(grid);
    }
  }

  find(start: Vector2, end: Vector2): any[] {
    const grid = this.grid.clone();
    const startNode = grid.get(start.x, start.y);
    const goalNode = grid.get(end.x, end.y);

    if (!startNode || !goalNode) return null;
    if (startNode === goalNode) return [];

    let currentNode: PNode;
    let opened: PNode[] = [startNode];

    while ((currentNode = opened.shift())) {
      const neighbors = processNeighbors(
        grid,
        currentNode,
        startNode,
        goalNode,
        this,
      ).sort((a, b) => a.f - b.f);

      currentNode.closed = true;

      // Chegou ao fim
      if (currentNode === goalNode) return getPath(currentNode);
      opened = opened.concat(neighbors).sort((a, b) => a.f - b.f);
    }

    // Não encontrou
    return null;
  }
}
