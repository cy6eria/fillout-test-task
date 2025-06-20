'use client';

import React, { useState, useRef, useEffect, useMemo, Fragment } from 'react';
import cx from 'classnames';
import { Flag, Clipboard, Copy, Trash2, PencilLine } from 'lucide-react';
import type { UniqueIdentifier } from '@dnd-kit/core';

import { InternalAppEvent } from '@/types';

export function ContextMenu () {
  const [currentItem, setCurrentItem] = useState<UniqueIdentifier|null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const actions = useMemo(() => [
    [
      { title: 'Set as first page', callback: () => {}, icon: <Flag size={16} className="text-blue" /> },
      { title: 'Rename', callback: () => {}, icon: <PencilLine size={16} className="text-gray-400" /> },
      { title: 'Copy', callback: () => {}, icon: <Clipboard size={16} className="text-gray-400" /> },
      { title: 'Duplicate', callback: () => {}, icon: <Copy size={16} className="text-gray-400" /> },
    ],
    [{ title: 'Delete', callback: () => {}, icon: <Trash2 size={16} className="text-red-500" /> }],
  ], []);
 
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setCurrentItem(null);
      }
    };

     const handleOpen = (e: Event) => {
        const customEvent = e as CustomEvent<{ id: UniqueIdentifier, x: number, y: number }>;
        setCurrentItem(customEvent.detail.id);   
        setPosition({ x: customEvent.detail.x, y: customEvent.detail.y });
    };

    const handleClose = () => {
      setCurrentItem(null);
    };

    document.addEventListener('click', handleClick);
    document.addEventListener(InternalAppEvent.OpenContextMenu, handleOpen);
    document.addEventListener(InternalAppEvent.CloseContextMenu, handleClose);
    window.addEventListener('resize', handleClose);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener(InternalAppEvent.OpenContextMenu, handleOpen);
      document.removeEventListener(InternalAppEvent.CloseContextMenu, handleClose);
      window.removeEventListener('resize', handleClose);
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className={cx(
        'absolute opacity-0 transition-opacity duration-300 rounded-xl bg-white border-1 border-gray z-1000 overflow-clip',
        { ['opacity-100']: Boolean(currentItem) },
      )}
      style={{
        top: position.y,
        left: position.x,
      }}
      role="menu"
    >
      <header className="px-[11px] py-[7px] border-b-1 border-gray text-base bg-[#FAFBFC]">
        Settings
      </header>
      <ul className='px-[10px] py=[5px'>
        {actions.map((group, idx) => (
          <Fragment key={idx}>
            {idx > 0 && <div className="w-full border-t-1 border-gray" />}
            {group.map((action) => (
              <li
                key={action.title}
                className='py-1.75'
              >
                <button
                  onClick={action.callback}
                  className='flex gap-1.5 items-center cursor-pointer'
                  tab-index={-1}
                >
                  {action.icon}
                  <span className='text-sm'>{action.title}</span>
                </button>
              </li>
            ))}
          </Fragment>
        ))}
      </ul>
    </div>
  );
}
