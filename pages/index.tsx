import type { NextPage } from 'next'
import React, { useState } from 'react'
import styles from '../styles/Home.module.css'


function calculateWinner(squares: string|null[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]; // 勝ちパターン
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // 同じプレイヤーなら勝利
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

const Square  = (props: {value:string|null, onClick:() => void}) => {
  return (
    <button className={styles.square} onClick={props.onClick}>
      {props.value}
    </button>
  )
}

const selectPlayer = (flag: boolean) => {
  return flag?'X':'O';
}

const Board = () => {
  const [squares, setSquares] = useState(Array(9).fill(null)) // 履歴
  const [xIsNext, setXisNext] = useState(true)
  const [history, setHistory] = useState([squares])
  const [stepNumber, setStepNumber] = useState(0);

  const jumpTo = (step:number) => {
    setStepNumber(step)
    setXisNext((step % 2) === 0)
  }

  const handleClick = (i:number) => {
    const historyObj = history.slice(0, stepNumber + 1)
    const current = historyObj[historyObj.length - 1];
    const squares = current.slice();
    if(calculateWinner(squares) || squares[i]){
      //早期に決着した時、すでに値が入っている場所は更新しない。
      return
    }
    squares[i] = selectPlayer(xIsNext);
    setHistory(historyObj.concat([squares]))
    setSquares(squares)
    setStepNumber(historyObj.length)
    setXisNext(!xIsNext)
  }

  const moves = history.map((step, move) => {
    const desc = move ? 'Go to move #' + move: 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    )
  })

  const renderSquare = (i:number) => {
    return <Square onClick={() =>handleClick(i)} value={history[stepNumber][i]}/>;
  }


  const current = history[stepNumber];
  const winner = calculateWinner(current)
  
  let status: string;
  if(winner){
    status = 'Winner: ' + winner;
  }else{
    status = "Next player: " + selectPlayer(xIsNext);
  }

  
  return (
    <div >
      <div className={styles.status}>{status}</div>
      <div className={styles.boardRow}>
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className={styles.boardRow}>
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className={styles.boardRow}>
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <div className={styles.gameInfo}>
        <ol className={styles.olInfo}>{moves}</ol>
      </div>
    </div>
  )
}

const Game  = () => {
  return (
    <div className={styles.game}>
      <div className='game-info'>
        <Board />
      </div>
    </div>
  )
}



const Home: NextPage = () => {
  return (
    <Game />
  )
}

export default Home
