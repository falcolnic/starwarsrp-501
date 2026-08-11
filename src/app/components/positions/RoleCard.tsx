import { Role } from "../../../data/position";

export function RoleCard({ role }: { role: Role }) {
    return (
        <div className="bg-[#0c1424]/40 border border-[var(--border)]/30 rounded p-5 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
            {role.code && (
            <span className="font-mono text-xs font-bold tracking-[0.08em] text-[var(--primary)] px-2 py-0.5 border border-[var(--primary)]/40 bg-[var(--primary)]/10">
                {role.code}
            </span>
            )}
            <h3 className="font-display text-base font-bold tracking-wider text-white uppercase">{role.title}</h3>
        </div>

        {role.intro && <p className="text-sm text-slate-400 font-mono leading-relaxed">{role.intro}</p>}

        {role.description && (
            <p className="text-sm text-slate-300 font-mono leading-relaxed">{role.description}</p>
        )}

        {role.groups?.map((group, gi) => (
            <div key={gi} className="space-y-2">
            {group.label && (
                <div className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--primary)]">
                {group.label}
                </div>
            )}
            <ul className="list-none space-y-2 pl-0 text-sm text-slate-300 font-mono">
                {group.items.map((item, ii) => (
                <li key={ii} className="flex items-start gap-2.5">
                    <span className="text-[var(--primary)] mt-1 shrink-0">•</span>
                    <span>{item}</span>
                </li>
                ))}
            </ul>
            </div>
        ))}
        </div>
    );
}