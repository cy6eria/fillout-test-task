'use client';

import React, { useEffect, useRef, useState, Fragment } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  Announcements,
  closestCenter,
  CollisionDetection,
  DragOverlay,
  DndContext,
  DropAnimation,
  KeyboardSensor,
  KeyboardCoordinateGetter,
  Modifiers,
  MouseSensor,
  MeasuringConfiguration,
  PointerActivationConstraint,
  ScreenReaderInstructions,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  SortingStrategy,
  rectSortingStrategy,
  AnimateLayoutChanges,
  NewIndexGetter,
} from '@dnd-kit/sortable';

import { InternalAppEvent, MenuItem } from '@/types';

import { AddButton } from './AddButton';
import { Item } from './Item';
import { PageItem } from './PageItem';
import { Spacer } from './Spacer';

export interface Props {
  activationConstraint?: PointerActivationConstraint;
  animateLayoutChanges?: AnimateLayoutChanges;
  adjustScale?: boolean;
  collisionDetection?: CollisionDetection;
  coordinateGetter?: KeyboardCoordinateGetter;
  dropAnimation?: DropAnimation | null;
  getNewIndex?: NewIndexGetter;
  handle?: boolean;
  itemCount?: number;
  items: MenuItem[];
  measuring?: MeasuringConfiguration;
  modifiers?: Modifiers;
  strategy?: SortingStrategy;
  style?: React.CSSProperties;
  useDragOverlay?: boolean;
  getItemStyles?(args: {
    id: UniqueIdentifier;
    index: number;
    isSorting: boolean;
    isDragOverlay: boolean;
    overIndex: number;
    isDragging: boolean;
  }): React.CSSProperties;
}

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

const screenReaderInstructions: ScreenReaderInstructions = {
  draggable: `
    To pick up a sortable item, press the space bar.
    While sorting, use the arrow keys to move the item.
    Press space again to drop the item in its new position, or press escape to cancel.
  `,
};

export function SortablePages({
  activationConstraint,
  animateLayoutChanges,
  adjustScale = false,
  collisionDetection = closestCenter,
  coordinateGetter = sortableKeyboardCoordinates,
  dropAnimation = dropAnimationConfig,
  getNewIndex,
  items: initialItems,
  measuring,
  modifiers,
  strategy = rectSortingStrategy,
}: Props) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [activeId, setActiveId] = useState<UniqueIdentifier>(initialItems[0].id);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint,
    }),
    useSensor(TouchSensor, {
      activationConstraint,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  );
  const isFirstAnnouncement = useRef(true);
  const getIndex = (id: UniqueIdentifier) => items.findIndex((item) => item.id === id);
  const getPosition = (id: UniqueIdentifier) => getIndex(id) + 1;
  const activeIndex = activeId != null ? getIndex(activeId) : -1;
  const announcements: Announcements = {
    onDragStart({active: {id}}) {
      return `Picked up sortable item ${String(
        id
      )}. Sortable item ${id} is in position ${getPosition(id)} of ${
        items.length
      }`;
    },
    onDragOver({active, over}) {
      // In this specific use-case, the picked up item's `id` is always the same as the first `over` id.
      // The first `onDragOver` event therefore doesn't need to be announced, because it is called
      // immediately after the `onDragStart` announcement and is redundant.
      if (isFirstAnnouncement.current === true) {
        isFirstAnnouncement.current = false;
        return;
      }

      if (over) {
        return `Sortable item ${
          active.id
        } was moved into position ${getPosition(over.id)} of ${items.length}`;
      }

      return;
    },
    onDragEnd({active, over}) {
      if (over) {
        return `Sortable item ${
          active.id
        } was dropped at position ${getPosition(over.id)} of ${items.length}`;
      }

      return;
    },
    onDragCancel({active: {id}}) {
      return `Sorting was cancelled. Sortable item ${id} was dropped and returned to position ${getPosition(
        id
      )} of ${items.length}.`;
    },
  };

  useEffect(() => {
    if (activeId == null) {
      isFirstAnnouncement.current = true;
    }
  }, [activeId]);

  return (
    <DndContext
      accessibility={{
        announcements,
        screenReaderInstructions,
      }}
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={({ active }) => {
        const event = new CustomEvent(InternalAppEvent.CloseContextMenu);

        document.dispatchEvent(event);

        if (!active) {
          return;
        }

        setActiveId(active.id);
      }}
      onDragEnd={({ over }) => {
        if (over) {
          const overIndex = getIndex(over.id);
          if (activeIndex !== overIndex) {
            setItems((items) => arrayMove(items, activeIndex, overIndex));
          }
        }
      }}
      measuring={measuring}
      modifiers={modifiers}
    >
      <div className="flex w-full justify-center">
        <SortableContext items={items} strategy={strategy}>
          <ul className="grid grid-flow-col">
            {items.map((item, index) => (
              <Fragment key={item.id}>
                {index > 0 && (
                  <Spacer
                    onAdd={() => {
                      setItems((items) => items.reduce<MenuItem[]>((arr, i) => {
                        if (i.id === item.id) {
                          arr.push({
                            id: uuidv4(),
                            title: 'New item',
                            icon: 'FileText',
                          });
                        }
                        arr.push(i);
                        return arr;
                      }, []));
                    }}
                  />
                )}
                <PageItem
                  id={item.id}
                  value={item.title}
                  index={index}
                  isActive={activeId === item.id}
                  disabled={false}
                  animateLayoutChanges={animateLayoutChanges}
                  getNewIndex={getNewIndex}
                  icon={item.icon}
                />
              </Fragment>
            ))}

            <Spacer />
            <AddButton
                icon="Plus"
                onClick={() => {
                  setItems([...items, {
                    id: uuidv4(),
                    title: 'New item',
                    icon: 'FileText',
                  }]);
                }}
            >
              Create page
            </AddButton>
          </ul>
        </SortableContext>
      </div>

      <DragOverlay
        adjustScale={adjustScale}
        dropAnimation={dropAnimation}
      >
        {activeId != null ? (
          <Item
            value={items[activeIndex]?.title}
            dragOverlay
            icon={items[activeIndex]?.icon}
            isActive
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
