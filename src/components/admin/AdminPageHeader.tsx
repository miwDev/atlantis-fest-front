interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  onNew?: () => void;
  newLabel?: string;
}

export const AdminPageHeader = ({
  title,
  subtitle,
  onNew,
  newLabel = "Nuevo",
}: AdminPageHeaderProps) => {
  return (
    <header className="flex items-start justify-between border-b border-atlantis-secondary/20 pb-6 mb-8">
      <div>
        <span className="font-plex text-[10px] text-atlantis-secondary uppercase tracking-[0.3em] font-black">
          Gestión // Panel_Admin
        </span>
        <h1 className="font-syne text-h3 font-bold text-atlantis-bg-main mt-1 uppercase tracking-tighter">
          {title}
        </h1>
        {subtitle && (
          <p className="font-plex text-xs text-atlantis-secondary mt-1 uppercase tracking-widest">
            {subtitle}
          </p>
        )}
      </div>

      {onNew && (
        <button
          onClick={onNew}
          className="font-plex text-xs font-black uppercase tracking-[0.2em] bg-atlantis-bg-main text-atlantis-white px-6 py-3 hover:bg-atlantis-primary transition-colors duration-300"
        >
          + {newLabel}
        </button>
      )}
    </header>
  );
};
