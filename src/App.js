import { useState, useCallback, useRef } from "react";
import { produce } from "immer";
import "./App.css";
const numRows = 55;
const numCols = 138;
const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];
function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  });
  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;
  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbours = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbours += g[newI][newJ];
              }
            });
            if (neighbours < 2 || neighbours > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbours === 3) gridCopy[i][j] = 1;
          }
        }
      });
    });

    setTimeout(runSimulation, 50);
  }, []);
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          padding: "10px 0px 0px 0px",
        }}
      >
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          start
        </button>
        <button
          onClick={() => {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
              rows.push(
                Array.from(Array(numCols), () => (Math.random() > 0.8 ? 1 : 0))
              );
            }
            setGrid(rows);
          }}
        >
          random
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 15px)`,
          margin: "10px 20px",
        }}
      >
        {grid.map((rows, ri) =>
          rows.map((c, ci) => (
            <div
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[ri][ci] = gridCopy[ri][ci] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              key={`${ri}-${ci}`}
              style={{
                width: 15,
                height: 15,
                backgroundColor: grid[ri][ci] ? "rgb(0,0,0,0.85)" : undefined,
                border: "solid .5px rgb(0,0,0,0.1)",
              }}
            ></div>
          ))
        )}
      </div>
    </>
  );
}

export default App;
