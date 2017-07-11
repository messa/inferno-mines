import { Component } from 'react';
import Head from 'next/head';
import { Container } from 'semantic-ui-react'

const times = (n, f) => Array(n).fill(0).map((_, i) => f(i));

const CustomHead = () => (
  <Head>
    <title>Inferno Mines</title>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css" />
    <style>{`
      body {
        font-size: 14px;
        font-weight: 300;
        font-family: Roboto, sans-serif;
      }
      table.minefield {
        border-collapse: separate;
        border-spacing: 1px 1px;
        user-select: none;
      }
      table.minefield td {
        border: 2px solid #d0d0d0;
        border-radius: 2px;
        padding: 1px;
        background-color: #eaecef;
        width: 21px;
        height: 21px;
        font-family: Lato;
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        vertical-align: middle;
        overflow: hidden;
        line-height: 14px;
        padding: 0;
        color: #666;
        cursor: pointer;
      }
    `}</style>
  </Head>
);


const Cell = (props) => {
  const { rowNumber, colNumber, value, onClick } = props;
  var content = value;
  var style = null;
  switch (value) {
    case '-':
      content = '';
      style = { backgroundColor: '#d9d8d6' };
      break;
    case 'F':
      style = { backgroundColor: '#f00' };
      break;
    case 0:
      content = '';
      break;
    case 1:
      style = { color: '#333' };
      break;
    case 2:
      style = { color: '#363' };
      break;
    case 3:
      style = { color: '#339' };
      break;
    case 4:
      style = { color: '#933' };
      break;
    case 5:
      style = { color: '#333' };
      break;
    case 6:
      style = { color: '#333' };
      break;
    case 7:
      style = { color: '#333' };
      break;
    case 8:
      style = { color: '#333' };
      break;
  }
  return (
    <td
      id={'cell_' + rowNumber + '_' + colNumber}
      onClick={onClick}
      style={style}
    >
      {content}
    </td>
  );
};

const reveal = (bombs, rowNumber, colNumber, rowCount, colCount, newCells) => {
  if (rowNumber < 0 || rowNumber == rowCount || colNumber < 0 || colNumber == colCount) {
    return;
  }
  const pos = rowNumber * colCount + colNumber;
  if (newCells[pos] != '-') {
    return;
  }
  const leftEdge = (colNumber == 0);
  const rightEdge = (colNumber == colCount - 1);
  const topEdge = (rowNumber == 0);
  const bottomEdge = (rowNumber == rowCount - 1);
  const isBombL = (!leftEdge && bombs[pos-1]) ? 1 : 0;
  const isBombR = (!rightEdge && bombs[pos+1]) ? 1 : 0;
  const isBombT = (!topEdge && bombs[pos-colCount]) ? 1 : 0;
  const isBombB = (!bottomEdge && bombs[pos+colCount]) ? 1 : 0;
  const isBombTL = (!topEdge && !leftEdge && bombs[pos-colCount-1]) ? 1 : 0;
  const isBombTR = (!topEdge && !rightEdge && bombs[pos-colCount+1]) ? 1 : 0;
  const isBombBL = (!bottomEdge && !leftEdge && bombs[pos+colCount-1]) ? 1 : 0;
  const isBombBR = (!bottomEdge && !rightEdge && bombs[pos+colCount+1]) ? 1 : 0;
  const bombCount = (isBombL + isBombR + isBombT + isBombB + isBombTL + isBombTR + isBombBL + isBombBR);
  newCells[pos] = bombCount;
  if (bombCount == 0) {
    reveal(bombs, rowNumber - 1, colNumber, rowCount, colCount, newCells);
    reveal(bombs, rowNumber + 1, colNumber, rowCount, colCount, newCells);
    reveal(bombs, rowNumber, colNumber - 1, rowCount, colCount, newCells);
    reveal(bombs, rowNumber, colNumber + 1, rowCount, colCount, newCells);
    reveal(bombs, rowNumber - 1, colNumber - 1, rowCount, colCount, newCells);
    reveal(bombs, rowNumber - 1, colNumber + 1, rowCount, colCount, newCells);
    reveal(bombs, rowNumber + 1, colNumber - 1, rowCount, colCount, newCells);
    reveal(bombs, rowNumber + 1, colNumber + 1, rowCount, colCount, newCells);
  }
};

class IndexPage extends Component {

  constructor(props) {
    super(props);
    const rowCount = 16;
    const colCount = 30;
    const bombs = Array(rowCount * colCount).fill(false);
    times(99, () => {
      while (true) {
        var pos = Math.floor(Math.random() * rowCount * colCount);
        if (bombs[pos] === false) {
          bombs[pos] = true;
          break;
        }
      }
    });
    this.state = {
      rowCount, colCount, bombs,
      cells: Array(rowCount * colCount).fill('-'),
    }
  }

  onCellClick(rowNumber, colNumber) {
    this.setState((state) => {
      // console.debug('onCellClick', rowNumber, colNumber);
      const { rowCount, colCount, bombs, cells } = state;
      const newCells = Array.from(cells);
      const pos = rowNumber * colCount + colNumber;
      if (bombs[pos] === true) {
        newCells[pos] = 'F';
      } else {
        reveal(bombs, rowNumber, colNumber, rowCount, colCount, newCells);
      }
      return {
        cells: newCells,
      };
    })
  }

  render() {
    const { rowCount, colCount, cells } = this.state;

    return (
      <div id="indexPage">
        <CustomHead />
        <div style={{ paddingTop: 20, paddingBottom: 20 }}>
          <table style={{ margin: "0 auto" }} className="minefield">
            <tbody>
              {times(rowCount, (rowNumber) => (
                <tr key={rowNumber}>
                  {times(colCount, (colNumber) => (
                    <Cell
                      key={colNumber}
                      rowNumber={rowNumber}
                      colNumber={colNumber}
                      value={cells[rowNumber * colCount + colNumber]}
                      onClick={() => {
                        this.onCellClick(rowNumber, colNumber);
                      }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

}

export default IndexPage;
