import { GAME_PIECES_TYPES } from '../constants';
import { cloneDeep } from 'lodash';

export const checkIfCanBeat = (gamePosition, orderToMove)=> {
  if(!gamePosition?.length) return;
  const oppositePiece = orderToMove === GAME_PIECES_TYPES.PLAYER1 ? GAME_PIECES_TYPES.PLAYER2 : GAME_PIECES_TYPES.PLAYER1;
  let availableBeat = false;
  const beatPieces = [];
  const beatPieceCoords = [];

  for (const row of gamePosition) {
    for (const cell of row) {
      let canBeat = false;
      const beatCells = [];
      if(cell.isLegal && cell.playerPiece === orderToMove) {
        const {x, y} = cell.coordinates;
        if(gamePosition[x-1]?.[y-1]?.playerPiece === oppositePiece && gamePosition[x-2]?.[y-2]?.playerPiece === null){
          canBeat = true;
          beatCells.push({x: x-2, y: y-2})
        }
        if(gamePosition[x-1]?.[y+1]?.playerPiece === oppositePiece && gamePosition[x-2]?.[y+2]?.playerPiece === null){
          canBeat = true;
          beatCells.push({x: x-2, y: y+2})
        }
        if(gamePosition[x+1]?.[y-1]?.playerPiece === oppositePiece && gamePosition[x+2]?.[y-2]?.playerPiece === null){
          canBeat = true;
          beatCells.push({x: x+2, y: y-2})
        }
        if(gamePosition[x+1]?.[y+1]?.playerPiece === oppositePiece && gamePosition[x+2]?.[y+2]?.playerPiece === null) {
          canBeat = true;
          beatCells.push({x: x+2, y: y+2})
        }
        if(canBeat){
          availableBeat = true;
          beatPieces.push({x: x, y: y});
          beatPieceCoords.push(beatCells);
        }

      }
    }
  }

  return {availableBeat, beatPieces, beatPieceCoords, beatPeaceType: orderToMove }
}

export const getDraggableCoordinates = ({prevPosition, orderToMove, mousePosition, setAllowedMoveCells})=>{
  const copyPosition = cloneDeep(prevPosition);
  const {availableBeat, beatPieces, beatPieceCoords, beatPeaceType} = checkIfCanBeat(prevPosition, orderToMove) || {};
  const {x, y} = mousePosition;
  if(availableBeat && beatPeaceType === prevPosition[x][y].playerPiece) {
    const idx = beatPieces.findIndex(item => item.x === x && item.y === y)
    if(idx === -1) return copyPosition;

    copyPosition[x][y].isDraggable = true;
    copyPosition[x][y].dropTargets = [beatPieceCoords[idx]];
    setAllowedMoveCells(beatPieceCoords[idx]);
    return copyPosition;
  }



  const { playerPiece } = prevPosition[x][y];
  const dropTargets = [];
  if(playerPiece === GAME_PIECES_TYPES.PLAYER1 && orderToMove === GAME_PIECES_TYPES.PLAYER1) { //6,5 => 5,4  5,6
    if(prevPosition[x-1][y-1]?.playerPiece === null) {
      dropTargets.push({x: x-1, y: y-1});
      copyPosition[x][y].isDraggable = true;
    }
    if(prevPosition[x-1][y+1]?.playerPiece === null){
      dropTargets.push({x: x-1, y: y+1});
      copyPosition[x][y].isDraggable = true;
    }
      setAllowedMoveCells(dropTargets)
  } else if(playerPiece === GAME_PIECES_TYPES.PLAYER2 && orderToMove === GAME_PIECES_TYPES.PLAYER2) { //1,6 => 2,5  2,7
    if(prevPosition[x+1][y-1]?.playerPiece === null){
      dropTargets.push({x: x+1, y: y-1});
      copyPosition[x][y].isDraggable = true;
    }
    if( prevPosition[x+1][y+1]?.playerPiece === null){
      dropTargets.push({x: x+1, y: y+1});
      copyPosition[x][y].isDraggable = true;
    }
    setAllowedMoveCells(dropTargets);
  } else {
    copyPosition[x][y].isDraggable = false;
    setAllowedMoveCells([])
  }
  copyPosition[x][y].dropTargets = dropTargets;
  return copyPosition;
}

export const checkIfCanBeatByCoord = (gamePosition, coordinates)=> {
  const {x, y} = coordinates;
  const oppositePiece = gamePosition[x][y].playerPiece === GAME_PIECES_TYPES.PLAYER1 ?
                                                          GAME_PIECES_TYPES.PLAYER2 :
                                                          GAME_PIECES_TYPES.PLAYER1;
  let availableBeat = false;
  const beatPieces = [];
  const beatPieceCoords = [];

  let canBeat = false;
  const beatCells = [];

  if(gamePosition[x-1]?.[y-1]?.playerPiece === oppositePiece && gamePosition[x-2]?.[y-2]?.playerPiece === null){
    canBeat = true;
    beatCells.push({x: x-2, y: y-2})
  }
  if(gamePosition[x-1]?.[y+1]?.playerPiece === oppositePiece && gamePosition[x-2]?.[y+2]?.playerPiece === null){
    canBeat = true;
    beatCells.push({x: x-2, y: y+2})
  }
  if(gamePosition[x+1]?.[y-1]?.playerPiece === oppositePiece && gamePosition[x+2]?.[y-2]?.playerPiece === null){
    canBeat = true;
    beatCells.push({x: x+2, y: y-2})
  }
  if(gamePosition[x+1]?.[y+1]?.playerPiece === oppositePiece && gamePosition[x+2]?.[y+2]?.playerPiece === null) {
    canBeat = true;
    beatCells.push({x: x+2, y: y+2})
  }
  if(canBeat){
    availableBeat = true;
    beatPieces.push({x: x, y: y});
    beatPieceCoords.push(beatCells);
  }

  return { availableBeat, beatPieces, beatPieceCoords }
}
