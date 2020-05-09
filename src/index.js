import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button 
    style={(props.didWin ? {backgroundColor: "red", color: "white"} : {backgroundColor: "white"})}
    className={props.size}
    onClick={props.onClick}> 
    {props.value} </button>
  );
}

class Board extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      size: "square",
    }
    this.SmallSize = this.SmallSize.bind(this);
    this.RegularSize = this.RegularSize.bind(this);
    this.LargeSize = this.LargeSize.bind(this);
  }

  SmallSize() {
    this.setState({size: "squareSm"});
  }

  RegularSize() {
    this.setState({size: "square"});
  }
  
  LargeSize() {
    this.setState({size: "squareLg"});
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        size={this.state.size}
        didWin={this.props.winSq.includes(i)}
      />
    );
  }

  createTable = () => {
    let table = []
    let tables = []

    var h = 0
    for(let i = 0; i < 3; i++) {
      table[i] = []
      let children = []
      for(let j = 0; j < 3; j++) {
        table[i][j]=h++
      children.push(<p>{this.renderSquare(table[i][j])}</p>)
      }
    tables.push(<div className="board-row">{children}</div>)
    }
    return tables
  }

  render() {
    return (
      <div className="size">
        { }
        <div className="game-rule">
          <p>Pick Size: </p>
          <button className="buttonSize" onClick={ this.SmallSize }> Small</button>
          <button className="buttonSize" onClick={ this.RegularSize }> Regular</button> 
          <button className="buttonSize" onClick={ this.LargeSize }> Large</button>
        </div>
        { }
        {this.createTable()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      order: true
    };
    this.handleSort = this.handleSort.bind(this);
  }

  handleSort() {
    this.setState(prevState => ({
      order: !prevState.order
    }));
  }

  SortTitle() {
    return !this.state.order ? "Ascending" : "Descending";
  } 

  handleClick(i) {
    const rowAndCol = [
      ' Row[0]Col[0]',
      ' Row[1]Col[0]',
      ' Row[2]Col[0]',
      ' Row[0]Col[1]',
      ' Row[1]Col[1]',
      ' Row[2]Col[1]',
      ' Row[0]Col[2]',
      ' Row[1]Col[2]',
      ' Row[2]Col[2]'
    ];
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          rowCol: rowAndCol[i]
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }


  cats(mo,win){
    if(mo === 9 && win === null) {
      return alert("Cat's Game");
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      this.cats(move,winner)
      const desc = move ?
        'Go to move #' + move + history[move].rowCol :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            { }
      {move === this.state.stepNumber ? <b>{desc}</b> : desc }</button>
        </li>
      );
    });

    if(this.state.order === false){
      const reverse = moves.reverse((step, move) => {
        this.end(move,winner)
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
    }

    let status;
    if (winner) {
      let player = (!this.state.xIsNext ? "X" : "O");
      status = "Winner: " + player + " with coordinates: " + winner ;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winSq={winner ? winner : []}
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="sort">
          <p>Pick Ascending or Descending </p>
    <button className="buttonSize" onClick={ this.handleSort }> { this.SortTitle() } </button>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}


ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}