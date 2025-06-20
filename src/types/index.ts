import { UniqueIdentifier } from '@dnd-kit/core';
import Icons from 'lucide-react';

export interface MenuItem {
  id: UniqueIdentifier;
  title: string;
  icon: keyof typeof Icons;
}

export enum InternalAppEvent {
  OpenContextMenu = 'app:openContextMenu',
  CloseContextMenu = 'app:closeContextMenu',
}
