import { HeroIcon } from "../common/icons/HeroIcon.tsx";

export function ExploreSearchBar({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (val: string) => void;
}) {
  return (
    <div className="w-full h-full border flex items-center px-4 gap-2 border-twitterBorder focus-within:border-(--color-main) rounded-2xl">
      <HeroIcon
        iconName="MagnifyingGlassIcon"
        className="w-4 h-4 text-white"
        solid
      />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search"
        className="bg-transparent text-white outline-none w-full"
      />
    </div>
  );
}
