import { v4 as uuidv4 } from 'uuid';
import { SortablePages, ContextMenu } from '@/components';

export default function Home() {
  return (
    <div className="p-8 font-[family-name:var(--font-geist-sans)]">
      <SortablePages
        items={[
          { id: uuidv4(), title: 'Info', icon: 'Info' },
          { id: uuidv4(), title: 'Details', icon: 'FileText' },
          { id: uuidv4(), title: 'Other', icon: 'FileText' },
          { id: uuidv4(), title: 'Ending', icon: 'CheckCircle' },
        ]}
      />

      <ContextMenu />
    </div>
  );
}
