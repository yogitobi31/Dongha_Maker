import { useMemo, useState } from 'react';

type CharacterId = 'dongha' | 'heeseon';

type ArtworkProps = {
  characterId: CharacterId;
  mood?: 'neutral' | 'happy' | 'focused' | 'tired' | 'stressed' | 'worried';
  variant?: 'standing' | 'portrait';
  className?: string;
  label?: string;
};

const CHARACTER_NAMES: Record<CharacterId, string> = {
  dongha: '동하',
  heeseon: '희선'
};

const defaultMoodByCharacter: Record<CharacterId, string> = {
  dongha: 'neutral',
  heeseon: 'neutral'
};

export function CharacterArtwork({ characterId, mood, variant = 'standing', className, label }: ArtworkProps) {
  const [imageError, setImageError] = useState(false);
  const safeMood = mood ?? (defaultMoodByCharacter[characterId] as ArtworkProps['mood']);
  const src = useMemo(() => `/assets/characters/${characterId}/${variant}-${safeMood}.png`, [characterId, variant, safeMood]);
  const characterName = CHARACTER_NAMES[characterId];

  return (
    <div className={`character-artwork ${className ?? ''}`.trim()}>
      {!imageError ? (
        <img src={src} alt={`${characterName} ${label ?? '일러스트'}`} onError={() => setImageError(true)} loading="lazy" />
      ) : (
        <div className={`character-artwork__fallback character-artwork__fallback--${characterId}`}>
          <div className="character-artwork__shine" />
          <div className="character-artwork__ornament" />
          <p className="character-artwork__name">{characterName}</p>
          <p className="character-artwork__label">{label ?? '현재 모습'}</p>
        </div>
      )}
    </div>
  );
}
