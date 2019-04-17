
class Node {
  _value = null;
  _next = null;

  constructor(value) {
    this._value = value;
  }

  getValue = _ => this._value;

  getNext = _ => this._next;

  setNext = next => {
    this._next = next;
  }

  copy = node => {
    this._value = node.getValue();
    this._next = node.getNext();
  };
}

export default Node;