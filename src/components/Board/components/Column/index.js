import {forwardRef} from 'react';
import {Draggable} from 'react-beautiful-dnd';
import Card from './components/Card';
import withDroppable from '../../../withDroppable';
import CardAdder from './components/CardAdder';
import {pickPropOut} from '@services/utils';

const ColumnEmptyPlaceholder = forwardRef((props, ref) => (
  <div ref={ref} style={{ minHeight: 'inherit', height: 'inherit' }} {...props} />
))

const DroppableColumn = withDroppable(ColumnEmptyPlaceholder)

const getStyle = (style) => {
    const mergedStyle = {
        height: '100%',
        minHeight: '28px',
        display: 'inline-block',
        verticalAlign: 'top',
        ...style,
    };

    if (style?.transform) {
        const re = /^.*\(([^,]+),.*$/;
        const axisLockX = `translate(${style.transform.replace(re, '$1')}, 0px)`;
        return {
            ...mergedStyle,
            transform: axisLockX,
        };
    }
    return mergedStyle;
}

function Column({
  children,
  index: columnIndex,
  renderCard,
  renderColumnHeader,
  disableColumnDrag,
  disableCardDrag,
  onCardNew,
  allowAddCard,
  isDragDisabled,
  isDropDisabled,
  className
}) {
  return (
    <Draggable draggableId={`column-draggable-${children.id}`} index={columnIndex} isDragDisabled={disableColumnDrag || isDragDisabled}>
      {(columnProvided, draggableSnapshot) => {
        const draggablePropsWithoutStyle = pickPropOut(columnProvided.draggableProps, 'style')

        return (
          <div
            ref={columnProvided.innerRef}
            {...draggablePropsWithoutStyle}
            style={getStyle(
                columnProvided.draggableProps.style,
                draggableSnapshot
            )}
            className={`react-kanban-column ${className}`}
            data-testid={`column-${children.id}`}
          >
            <div {...columnProvided.dragHandleProps}>{renderColumnHeader(children)}</div>
            {allowAddCard && <CardAdder column={children} onConfirm={onCardNew} />}
            <DroppableColumn droppableId={String(children.id)} isDropDisabled={isDropDisabled}>
              {children.cards.length ? (
                children.cards.map((card, index) => (
                  <Card
                    key={card.id}
                    index={index}
                    renderCard={(dragging) => renderCard(children, card, dragging)}
                    disableCardDrag={disableCardDrag}
                  >
                    {card}
                  </Card>
                ))
              ) : (
                <div className='react-kanban-card-skeleton' />
              )}
            </DroppableColumn>
          </div>
        )
      }}
    </Draggable>
  )
}

function FixedColumn({
                       children,
                       renderCard,
                       renderColumnHeader,
                       disableColumnDrag,
                       disableCardDrag,
                       onCardNew,
                       allowAddCard,
                       isDragDisabled,
                       isDropDisabled,
                       className,
                     }) {
  return (
      <div
          style={{
            height       : '100%',
            minHeight    : '28px',
            display      : 'inline-block',
            verticalAlign: 'top',
          }}
          className={`react-kanban-column ${className}`}
          data-testid={`column-${children.id}`}
      >
        <div>{renderColumnHeader(children)}</div>
        {allowAddCard && <CardAdder column={children} onConfirm={onCardNew}/>}
        <DroppableColumn droppableId={String(children.id)}>
          {children.cards.length ? (
              children.cards.map((card, index) => (
                  <Card
                      key={card.id}
                      index={index}
                      renderCard={(dragging) => renderCard(children, card, dragging)}
                      disableCardDrag={disableCardDrag}
                  >
                    {card}
                  </Card>
              ))
          ) : (
              <div className='react-kanban-card-skeleton'/>
          )}
        </DroppableColumn>
      </div>
  );
}

export {Column as default, FixedColumn};


