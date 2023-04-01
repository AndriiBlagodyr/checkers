import React from 'react';
import cx from 'classnames';

import './BoardCell.css';

export const BoardCell = ({
  coordinates,
  isLegal,
  isHighlighted,
  GamePiece,
  makePieceMove
}) => {
  const onDragOverHandler = (event)=>{
    event.preventDefault();
  }

  const onDropHandler = (event, coordinates) => {
    makePieceMove(coordinates)
  }

  return (
    <div
      className={cx('board-cell', {
        'board-cell-legal': isLegal,
        'board-cell-highlighted': isHighlighted
      })}
      id={`drop-id`}
      onDragOver={onDragOverHandler}
      onDrop={e =>onDropHandler(e, coordinates)}
    >
        {isLegal && <GamePiece/>}
    </div>
  );
};
