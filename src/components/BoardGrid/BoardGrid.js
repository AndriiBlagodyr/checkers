import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { cloneDeep } from 'lodash';

import { BoardCell } from '../BoardCell/BoardCell';
import { GamePiece } from '../GamePiece';
import { DEFAULT_BOARD_SIZE, GAME_PIECES_TYPES } from '../../constants';
import { getDraggableCoordinates, checkIfCanBeatByCoord } from '../../helpers';
import './BoardGrid.css';

export const BoardGrid = () => {
  const [mousePosition, setMousePosition] = useState(null);
  const [gamePosition, setGamePosition] = useState([]);
  const [allowedMoveCells, setAllowedMoveCells] = useState([]);
  const [orderToMove, setOrderToMove] = useState(GAME_PIECES_TYPES.PLAYER1);

  const canBeat = Math.abs(mousePosition?.x - allowedMoveCells?.[0]?.x) > 1;
useEffect(() => {
    if(mousePosition){
      setGamePosition(prevPosition => getDraggableCoordinates({ prevPosition, orderToMove, mousePosition, setAllowedMoveCells }))
    }
  }, [mousePosition]);

  const defaultBoard = useMemo(()=> {
    const matrixPiecesBoard = [];

    for (let i = 0; i < DEFAULT_BOARD_SIZE; i++) {
      let row = [];
      for (let j = 0; j < DEFAULT_BOARD_SIZE; j++) {
        const isLegal = (j%2 > 0 && i%2 === 0) || (j%2 === 0 && i%2 > 0);

        let playerPiece;
        if(i<=2 && isLegal) playerPiece = GAME_PIECES_TYPES.PLAYER2;
        else if(i>= DEFAULT_BOARD_SIZE-3 && isLegal) playerPiece = GAME_PIECES_TYPES.PLAYER1;
        else playerPiece = null;

        row.push({coordinates: {x: i, y: j}, isLegal: isLegal, isHighlighted: false, playerPiece, isDraggable: false, dropTargets: [] })
      }
      matrixPiecesBoard.push(row);
    }

    return matrixPiecesBoard;
  }, []);

  useEffect(() => {
    if(defaultBoard.length)  setGamePosition(defaultBoard);
  }, [defaultBoard]);

  const showAvailableMoves = useCallback(() => {
    const copyPosition = cloneDeep(gamePosition);
    for (const pos of allowedMoveCells) {
      const {x, y} = pos;
      copyPosition[x][y].isHighlighted = true;
    }
    setGamePosition(copyPosition);
  }, [allowedMoveCells, gamePosition])

  const resetHighlightDrag = useCallback((gamePosition )=> {
    for (const row of gamePosition) {
      for (const cell of row) {
        cell.isHighlighted = false;
        cell.isDraggable = false;
      }
    }
  }, [])

  const makePieceMove = useCallback((coordinates) =>{
    const {x, y} = coordinates || {};
    const moveCell = allowedMoveCells.find(move => {
      return move.x === x && move.y === y
    })
    if (!moveCell) return;
    const copyPosition = cloneDeep(gamePosition);
    if(canBeat){
      console.log("HERE....")
      copyPosition[x][y].playerPiece = copyPosition[mousePosition.x][mousePosition.y].playerPiece;
      copyPosition[mousePosition?.x][mousePosition?.y].playerPiece = null;
      copyPosition[(mousePosition?.x + x)/2][(mousePosition?.y+y)/2].playerPiece = null;
      resetHighlightDrag(copyPosition);

      const { availableBeat, beatPieceCoords } = checkIfCanBeatByCoord(copyPosition, {x, y});

      if(availableBeat){
        copyPosition[x][y].isDraggable = true;
        setAllowedMoveCells(beatPieceCoords);
        setGamePosition(copyPosition);
        return;
      }
      setOrderToMove(prev=> prev === GAME_PIECES_TYPES.PLAYER1 ?
                                      GAME_PIECES_TYPES.PLAYER2 :
                                      GAME_PIECES_TYPES.PLAYER1);
      setGamePosition(copyPosition);
      return;
    }

    copyPosition[x][y].playerPiece = copyPosition[mousePosition.x][mousePosition.y].playerPiece;
    copyPosition[mousePosition?.x][mousePosition?.y].playerPiece = null;
    resetHighlightDrag(copyPosition);
    setGamePosition(copyPosition);
    setOrderToMove(prev=> prev === GAME_PIECES_TYPES.PLAYER1 ? GAME_PIECES_TYPES.PLAYER2 : GAME_PIECES_TYPES.PLAYER1)
  }, [allowedMoveCells, gamePosition, mousePosition?.x, mousePosition?.y])

  const mouseLeaveHandler = useCallback(()=>{
    const copyPosition = cloneDeep(gamePosition);
    resetHighlightDrag(copyPosition);
    setGamePosition(copyPosition);
  },[gamePosition, resetHighlightDrag])

  const boardGrid = useMemo(() => {
    let boardLen = gamePosition?.length;
    const board = [];
    for (let i = 0; i < boardLen; i++) {

      let row = [];
      for (let j = 0; j < boardLen; j++) {
        const {coordinates, isLegal, isHighlighted, isKing, playerPiece, isDraggable, dropTargets} = gamePosition[i][j];
        const gamePiece = <GamePiece  type={playerPiece} isKing={isKing}
                                      coordinates={coordinates}
                                      setMousePosition={setMousePosition}
                                      isDraggable={isDraggable}
                                      dropTargets={dropTargets}
                                      showAvailableMoves={showAvailableMoves}
                                      mouseLeaveHandler={mouseLeaveHandler}/>

        row.push(<BoardCell coordinates={coordinates}
                            isLegal={isLegal}
                            isHighlighted={isHighlighted}
                            key={`cell-${i}-${j}`}
                            GamePiece={()=>gamePiece}
                            makePieceMove={makePieceMove} />)
      }
      board.push(<div className='board-cells-row' key={`row-${i}`}>{row}</div>)
    }
    return board;
  }, [gamePosition]);

  return (
    <div className="board-grid-wrapper">
      <button onClick={()=>{setGamePosition(defaultBoard); setOrderToMove(GAME_PIECES_TYPES.PLAYER1)}}>Start New Game</button>
      <h4>Player 2 {orderToMove=== GAME_PIECES_TYPES.PLAYER2 && 'turn to move'}</h4>
      {boardGrid}
      <h4>Player 1 {orderToMove=== GAME_PIECES_TYPES.PLAYER1 && 'turn to move'}</h4>
    </div>
  );
};

