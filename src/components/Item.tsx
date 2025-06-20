import React, { useEffect, useRef } from 'react';
import cx from 'classnames';
import * as Icons from 'lucide-react';
import type { UniqueIdentifier, DraggableSyntheticListeners } from '@dnd-kit/core';
import type { Transform } from '@dnd-kit/utilities';

import { InternalAppEvent } from '@/types';

export interface ItemProps {
  ref?: (node: HTMLElement | null) => void;
  id?: UniqueIdentifier;
  dragOverlay?: boolean;
  disabled?: boolean;
  dragging?: boolean;
  height?: number;
  index?: number;
  fadeIn?: boolean;
  isActive?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  sorting?: boolean;
  transition?: string | null;
  value: React.ReactNode;
  icon: keyof typeof Icons;
}

export const Item = React.memo(
  function ItemInMemo({
    id,
    dragOverlay,
    isActive,
    index,
    listeners,
    transition,
    transform,
    value,
    icon,
    ...props
  }: ItemProps) {
    const ref = useRef<HTMLLIElement>(null);

    useEffect(() => {
      if (!dragOverlay) {
        return;
      }

      document.body.style.cursor = 'grabbing';

      return () => {
        document.body.style.cursor = '';
      };
    }, [dragOverlay]);

    const handleContextMenu: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      e.preventDefault();

      if (!ref.current) {
        return;
      }

      const x = ref.current.getBoundingClientRect().left;
      const y = ref.current.getBoundingClientRect().top + ref.current.getBoundingClientRect().height + 10;

      const event = new CustomEvent(InternalAppEvent.OpenContextMenu, {
        detail: { id, x, y },
      });

      document.dispatchEvent(event);
    };

    const IconComponent = Icons[icon] as React.ComponentType<{ size: number; className: string }>;

    return (
      <li
        className='flex touch-manipulation'
        style={
          {
            transform: 'translate3d(var(--translate-x, 0), var(--translate-y, 0), 0) scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1))',
            transformOrigin: '0 0',
            transition: transition,
            '--translate-x': transform
              ? `${Math.round(transform.x)}px`
              : undefined,
            '--translate-y': transform
              ? `${Math.round(transform.y)}px`
              : undefined,
            '--scale-x': transform?.scaleX
              ? `${transform.scaleX}`
              : undefined,
            '--scale-y': transform?.scaleY
              ? `${transform.scaleY}`
              : undefined,
            '--index': index,
          } as React.CSSProperties
        }
        ref={ref}
      >
        <div
          className={cx(
            'group flex items-center gap-1.5 px-2.25 py-1.25 shadow-none',
            'touch-manipulation cursor-pointer rounded-lg',
            'bg-button-bg hover:bg-button-bg-hovered',
            'font-medium text-sm whitespace-nowrap',
            'transition-[background-color] duration-300 transform-origin-center',
            {
              ['bg-white text-button-text-active border-1 border-gray shadow-xs']: isActive,
              ['color-button text-button-text']: !isActive,
            },
            'focus:border-blue focus:ring-2 focus:ring-blue/25 outline-0',
          )}
          {...listeners}
          {...props}
          tabIndex={0}
          role="button"
        >
          {IconComponent && (
            <IconComponent
              size={20}
              className={cx({ ['text-orange group-hover:text-button-text transition-[color] duration-300']: isActive })}
            />
          )}

          <span>{value}</span>
          
          {isActive && (
            <button
              className="cursor-pointer p-0.5 outline-0"
              onContextMenu={handleContextMenu}
              tabIndex={-1}
            >
              <Icons.MoreVertical size={16} />
            </button>
          )}
        </div>
      </li>
    );
  }
);
