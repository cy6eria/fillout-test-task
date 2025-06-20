import { useRef } from 'react';
import cx from 'classnames';
import { Plus } from 'lucide-react';

interface SpacerProps {
    onAdd?(): void;
}

export function Spacer({ onAdd }: SpacerProps) {
    const disabled = !Boolean(onAdd);
    const ref = useRef<HTMLButtonElement>(null);

    return (
        <li className={cx(
            'relative flex items-center justify-center w-min px-[5px]',
            {
                ['group transition-all duration-300 hover:px-[20px] delay-100 focus-within:px-[20px]']: !disabled,
            }
        )}>
            <div className="h-[1px] w-full border-1 border-dashed absolute top-[50%] left-0" />

            {onAdd && (
                <button
                    ref={ref}
                    onClick={() => {
                        ref.current?.blur();
                        onAdd();
                    }}
                    className={cx(
                        'cursor-pointer bg-white p-0.75 rounded-full border-1 scale-0 w-0',
                        'group-hover:scale-100 group-hover:w-[16px] focus:scale-100 focus:w-[16px]',
                        'transition-all duration-300 delay-100',
                        'focus:outline-0 focus-visible:outline-0',
                    )}
                >
                    <Plus size={8} />
                </button>
            )}
        </li>
    );
}
