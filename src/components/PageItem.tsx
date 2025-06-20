import React from 'react';
import Icons from 'lucide-react';

import { UniqueIdentifier } from '@dnd-kit/core';
import {
  useSortable,
  AnimateLayoutChanges,
  NewIndexGetter,
} from '@dnd-kit/sortable';

import { Item } from './Item';

interface PageItemProps {
  animateLayoutChanges?: AnimateLayoutChanges;
  disabled?: boolean;
  getNewIndex?: NewIndexGetter;
  id: UniqueIdentifier;
  index: number;
  value: string;
  icon: keyof typeof Icons;
  isActive: boolean;
}

export function PageItem({
  disabled,
  animateLayoutChanges,
  getNewIndex,
  id,
  index,
  icon,
  value,
  isActive,
}: PageItemProps) {
  const {
    attributes,
    isDragging,
    isSorting,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges,
    disabled,
    getNewIndex,
  });

  return (
    <Item
      ref={setNodeRef}
      value={value}
      icon={icon}
      isActive={isActive}
      disabled={disabled}
      dragging={isDragging}
      sorting={isSorting}
      index={index}
      transform={transform}
      transition={transition}
      listeners={listeners}
      data-index={index}
      data-id={id}
      id={id}
      dragOverlay={isDragging}
      {...attributes}
    />
  );
}