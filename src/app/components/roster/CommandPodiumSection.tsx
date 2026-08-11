import type { Soldier } from "../../../services/soldierService";
import { CommandPodium } from "./CommandPodium";

interface CommandPodiumSectionProps {
    soldiers: Soldier[];
    onSelectFighter?: (cid: string) => void;
}

export function CommandPodiumSection({ soldiers, onSelectFighter }: CommandPodiumSectionProps) {
    const topFour = soldiers
        .filter((s) => s.commandRole && s.commandOrder)
        .sort((a, b) => (a.commandOrder ?? 99) - (b.commandOrder ?? 99))
        .slice(0, 4);

    if (topFour.length === 0) return null;

    const commanderMap = new Map(topFour.map((c) => [c.commandOrder, c]));

    const slot1 = commanderMap.get(2);
    const slot2 = commanderMap.get(1);
    const slot3 = commanderMap.get(3);
    const slot4 = commanderMap.get(4);

    return (
        <div className="mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-end max-w-6xl mx-auto px-4 min-h-[250px]">
            {slot1 && (
            <CommandPodium
                soldier={slot1}
                isFlagship={false}
                stoneImage="/2stone.png"
                offsetClass="mb-12"
                onSelect={onSelectFighter}
            />
            )}

            {slot2 && (
            <CommandPodium
                soldier={slot2}
                isFlagship={true}
                stoneImage="/1stone.png"
                offsetClass="mb-24"
                onSelect={onSelectFighter}
            />
            )}

            {slot3 && (
            <CommandPodium
                soldier={slot3}
                isFlagship={false}
                stoneImage="/3stone.png"
                offsetClass="mb-6"
                onSelect={onSelectFighter}
            />
            )}

            {slot4 && (
            <CommandPodium
                soldier={slot4}
                isFlagship={false}
                stoneImage="/4stone.png"
                offsetClass="mb-0"
                onSelect={onSelectFighter}
            />
            )}
        </div>
        </div>
    );
}