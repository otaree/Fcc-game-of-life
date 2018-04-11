import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// =============================================================================
// Helper function
// =============================================================================
const createTwoDimensionalArray = (rows, cols) => Array(rows).fill().map(() => Array(cols).fill(0));
const arrayClone = (arr) => JSON.parse(JSON.stringify(arr));

const Cell = (props) => {
    let cellColor = "#222";
    if (props.value === 1) {
        cellColor = "white";
    }

    return (
        <div className="cell"
            style={{backgroundColor: cellColor, width: '14px', height: '14px'}}
            onClick={props.onClick}
        />    
    );
};

class Buttons extends React.Component {
    screenSizeHandler = (e) => {
        this.props.onScreenChange(e.target.value);
    };

    render() {
        return (
            <div className="Buttons">
                <button className="Btn start" onClick={this.props.onStart}>Start</button>
                <button className="Btn pause" onClick={this.props.onPause}>Pause</button>
                <button className="Btn" onClick={this.props.onClear}>Clear</button>
                <button className="Btn" onClick={this.props.onSeed}>Seed</button>
                <button className="Btn" onClick={this.props.onFast}>Fast</button>
                <button className="Btn" onClick={this.props.onSlow}>Slow</button>
                <select name="screensize" onChange={this.screenSizeHandler} >
                    <option value="1">50X30</option>
                    <option value="2">30X20</option>
                </select>
            </div>
        );
    }
}



class Main extends React.Component {
    rows = 30;
    cols = 50;
    speed = 100;
    gridSize = this.rows * this.cols;
    state = {
        grid: createTwoDimensionalArray(this.rows, this.cols),
        generations: 0,
    }

    componentDidMount() {
        this.seed();
        this.startGame();
    }

    screenSizeHander = (size) => {
        switch (size) {
            case "2":
                this.rows = 20;
                this.cols = 30;
                break;
            default:
            this.rows = 30;
            this.cols = 50;
        }

        clearInterval(this.intervalId);
        this.setState(() => {
            return {
                grid: createTwoDimensionalArray(this.rows, this.cols),
                generations: 0,
            }
        });
    };

    selectCellHandler = (row, col) => {
        this.setState(prevState => {
            prevState.grid[row][col] = 1;
            return {
                grid: prevState.grid,
            };
        });
    }

    pauseGame = () => {
        clearInterval(this.intervalId);
    }

    slow = () => {
        this.speed = 1000;
        this.startGame();
    }


    fast = () => {
        this.speed = 100;
        this.startGame();
    }

    startGame = () => {
        clearInterval(this.intervalId);
        this.intervalId = setInterval(this.checkGrid, this.speed);
    }

    clearGame = () => {
        clearInterval(this.intervalId);
        this.setState(() => {
            return {
                grid: createTwoDimensionalArray(this.rows, this.cols),
            };
        });
    }

    checkGrid = () => {
        const g = arrayClone(this.state.grid);
        let g2 = arrayClone(this.state.grid);

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let count = 0;
                if (i === 0 && j === 0) { // TOP LEFT
                    count = g[i][j] + g[i][j+1];
                    count += g[i+1][j] + g[i+1][j+1];
                } else if (i === 0 && j === this.cols -1) { // TOP RIGHT
                    count = g[i][j-1] + g[i][j];
                    count += g[i+1][j-1] + g[i+1][j];
                } else if (i === this.rows - 1 && j === this.cols -1) { // BOTTOM LEFT
                    count = g[i-1][j-1] + g[i-1][j];
                    count += g[i][j-1] + g[i][j];
                } else if (i === this.rows - 1 && j === 0) { // BOTTOM RIGHT
                    count = g[i][j+1] + g[i][j];
                    count += g[i-1][j+1] + g[i-1][j];
                } else if (i === 0 && j > 0) { // TOP MIDDLE
                    count = g[i][j-1] + g[i][j] + g[i][j+1];
                    count += g[i+1][j-1] + g[i+1][j] + g[i+1][j+1];
                } else if (i === this.rows - 1 && j > 0) { // BOTTOM MIDDLE
                    count = g[i][j-1] + g[i][j] + g[i][j+1];
                    count += g[i-1][j-1] + g[i-1][j] + g[i-1][j+1];
                }else if (i > 0 && j === this.cols -1) { // MIDDLE LEFT
                    count = g[i-1][j] + g[i-1][j-1];
                    count += g[i][j] + g[i][j-1];
                    count += g[i+1][j] + g[i+1][j-1];
                } else if (i > 0 && i < this.rows -1 && j === 0) { // MIDDLE RIGHT
                    count = g[i-1][j] + g[i-1][j+1];
                    count += g[i][j] + g[i][j+1];
                    count += g[i+1][j] + g[i+1][j+1];
                }  else if (i > 0 && j > 0 && i < this.rows -1  && j < this.cols -1) { // MIDDLE
                    count = g[i-1][j-1] + g[i-1][j] + g[i-1][j+1];
                    count += g[i][j-1] + g[i][j] + g[i][j+1];
                    count += g[i+1][j-1] + g[i+1][j] + g[i+1][j+1];
                }

                if (count === 3) {
                    g2[i][j] = 1;
                } else if (count !==4 ) {
                    g2[i][j] = 0;
                }
            }
        }

        this.setState(prevState => {
            return {
                grid: g2,
                generations: prevState.generations + 1,
            };
        });
    }


    seed = () => {
        const grid = arrayClone(this.state.grid);

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                grid[i][j] = Math.floor(Math.random() * 4) === 1 ? 1 : 0;
            }
        }

        this.setState(() => {
            return {
                grid,
            };
        });

    }

    render() {
        const cells = [];
        for (let i = 0; i < this.rows; i ++) {
            for (let j = 0; j < this.cols; j++) {
                cells.push(<Cell key={`${i}_${j}`} value={this.state.grid[i][j]} onClick={() => this.selectCellHandler(i, j)} />);
            }
        }

        return (
            <div className="main">
                <div className="BoardContainer">
                <h1 >Game of Life</h1>
                    <div className="MainBoard">
                        <div className="grid" style={{width: `${this.cols * 14}px`}}>
                            {cells}
                        </div>
                        <Buttons 
                            onStart={this.startGame}
                            onPause={this.pauseGame}
                            onClear={this.clearGame}
                            onSeed={this.seed}
                            onFast={this.fast}
                            onSlow={this.slow}
                            onScreenChange={this.screenSizeHander}
                        />
                    </div>
                    <h2 className="generation">Generation: <strong>{this.state.generations}</strong></h2>
                </div>
            </div>
        );
    }
}



ReactDOM.render(<Main />, document.getElementById('root'));