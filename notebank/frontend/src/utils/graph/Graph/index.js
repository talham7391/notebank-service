import Node from 'utils/graph/Node';

class Graph {
  _size = 0;
  _currentNode = undefined;
  _steps = undefined;

  constructor(values, steps) {
    this._steps = steps;

    const nodes = [];
    for (let i in values) {
      const node = new Node(values[i]);
      nodes.push(node);
    }
  
    let first = null;
    while(true) {
      let current = nodes.shift();
      this._size += 1;
      if (first == null) {
        first = current;
      }
      for (let i = 0; i < steps; i++) {
        const node = new Node();
        node.copy(current);
        current.setNext(node);
        current = node;
        this._size += 1;
      }
      if (nodes.length === 0) {
        current.setNext(first);
        break;
      } else {
        current.setNext(nodes[0]);
      }
    }

    this._currentNode = first;
  }

  print = _ => {
    const visited = {};
    let current = this._currentNode;
    while(true) {
      if (visited[current.getValue()] === this._steps) {
        break;
      }
      console.log(current.getValue());
      visited[current.getValue()] = visited[current.getValue()] == null ? 0 : visited[current.getValue()] + 1;
      current = current.getNext();
    }
  };

  jumpTo = value => {
    while (true) {
      if (this._currentNode.getValue() === value) {
        return;
      }
      this._currentNode = this._currentNode.getNext();
    }
  };

  gotoNext = _ => {
    this._currentNode = this._currentNode.getNext();
  };

  getCurrentValue = _ => this._currentNode.getValue();

  getSize = _ => this._size;
}

export default Graph;