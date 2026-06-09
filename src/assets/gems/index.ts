import tier1 from './tier1_aluminium.svg';
import tier2 from './tier2_iron.svg';
import tier3 from './tier3_gold.svg';
import tier4 from './tier4_platinum.svg';
import tier5 from './tier5_diamond.svg';
import tier6 from './tier6_ruby.svg';
import tier7 from './tier7_emerald.svg';
import tier8 from './tier8_sapphire.svg';
import locked from './tier_locked.svg';

export const GEM_IMAGES: Record<number | 'locked', string> = {
  1: tier1,
  2: tier2,
  3: tier3,
  4: tier4,
  5: tier5,
  6: tier6,
  7: tier7,
  8: tier8,
  locked,
};

export { tier1, tier2, tier3, tier4, tier5, tier6, tier7, tier8, locked };
