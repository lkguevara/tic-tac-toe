import { useState } from "react"
import confetti from 'canvas-confetti';

//Turnos
const TURNS = {
  X: 'x',
  O: 'o'
}

const Square = ({children, isSelected, updateBoard, index}) => {
  const className = `square ${isSelected ? 'is-selected' : ''}`

  const handleClick = () => {
    updateBoard(index)
  }

  return (
    <div 
      onClick={handleClick}
      className={className}
    >
      {children}
    </div>
  )
}

const WINNER_COMBOS = [
  //combinaciones ganadoras
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

function App() {
  // Estado que crea un array de 9 posiciones con valor null
  const [board, setBoard] = useState(Array(9).fill(null));
  // Estado que crea un string con el valor de TURNS.X
  const [turno, setTurno] = useState(TURNS.X);
  // Estado del ganador
  const [winner, setWinner] = useState(null);

  const checkWinner = (boardToCheck) =>{
    // recorrer las combinaciones ganadoras y verificar si hay un ganador
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo;
      if (
        boardToCheck[a] && 
        boardToCheck[a] === boardToCheck[b] && 
        boardToCheck[a] === boardToCheck[c]
      ){
        return boardToCheck[a];
      }
    }
    // si no hay ganador, retornar null
    return null;
  }

  const updateBoard = (index) => {
    // si ya se ha marcado la posición, no actualizar nuevamente
    if(board[index] || winner) return 

    //actualizar el tablero con una copia 
    const newBoard = [...board];
    newBoard[index] = turno;
    setBoard(newBoard);

    //cambiar el turno
    const nuevoTurno = turno === TURNS.X ? TURNS.O : TURNS.X;
    setTurno(nuevoTurno);

    //verificar si hay un ganador
    const newWinner = checkWinner(newBoard);
    if(newWinner){
      confetti();
      setWinner(newWinner);
    }
    //verificar si hay un empate
    else if(!newBoard.includes(null)){
      setWinner(false);
    }

  }

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurno(TURNS.X);
    setWinner(null);
  }

  return (
    <main className="board">
      <h1>Tic tac toe</h1>
      <button onClick={resetGame}>Reiniciar</button>
      <section className="game">
        {
          board.map((square, index) =>{
            return (
             <Square 
                key={index}
                index = {index}
                updateBoard={updateBoard}
              >
                {square}
              </Square>
            )
          })
        }
      </section>

      <section className="turn">
        <Square isSelected={turno === TURNS.X}>
          {TURNS.X}
        </Square>
        <Square isSelected={turno === TURNS.O}>
          {TURNS.O}
        </Square>
      </section>

      {
        winner != null && (
          <section className="winner">
            <div className="text">
              <h2>
                {
                  winner === false ? 'Empate' : `Ganador: ${winner}`
                }
              </h2>
              <header className="win">
                {winner && <Square>{winner}</Square> }
              </header>

              <footer>
                <button onClick={resetGame}>Volver a jugar</button>
              </footer>
              
            </div>
          </section>
        )
      }

    </main>
  )
}

export default App
