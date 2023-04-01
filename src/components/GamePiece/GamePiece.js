import React, { useState, useEffect, useRef} from 'react'
import cx from 'classnames';

import { GAME_PIECES_TYPES } from '../../constants';
import './GamePiece.css';

export const GamePiece = ({type, isKing, setMousePosition, coordinates, isDraggable,
    dropTargets, showAvailableMoves, mouseLeaveHandler }) => {
  const [hovered, setHovered] = useState(false);

  const {x, y} = coordinates;
  const indicatorRef = useRef();

  const onDragStartHandler = (event)=>{
    event.dataTransfer.setData('text', 'drop-id');
  }

  const onMouseDownHandler= ()=>{
    if(isDraggable) showAvailableMoves();
  }

  const mouseEnterHandler = () => {
    setMousePosition({ x, y });
    setHovered(true);
  }

  const mouseOutHandler = () => {
    setMousePosition(null);
    mouseLeaveHandler();
  }

  useEffect(() => {
    if (
      !hovered &&
      indicatorRef.current &&
      indicatorRef.current.matches(':hover') === false
    ) {
      setMousePosition(null);
      mouseLeaveHandler();
    }
  }, [hovered, setMousePosition]);

  if(!type) return null;
  return (
    <div draggable={isDraggable} onMouseDown={onMouseDownHandler} onDragStart={onDragStartHandler}
   onMouseEnter={mouseEnterHandler} onMouseOut={mouseOutHandler}
    className={cx('game-piece', {
      'game-piece-player1': type===GAME_PIECES_TYPES.PLAYER1,
      'game-piece-player2': type===GAME_PIECES_TYPES.PLAYER2,
      'draggable-piece': isDraggable
    })}>{isKing && 'K'}</div>
  )
}
