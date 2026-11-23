// The scales to know, in three tiers, and the facts shown when one is revealed: formula, steps, parent, colour.
import * as T from '../theory.js';
import { ordinal, esc } from './core.js';

export const TIERS = {
  core: ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian', 'major-pentatonic', 'minor-pentatonic', 'blues', 'major-blues', 'harmonic-minor', 'melodic-minor'],
  jazz: ['dorian-b2', 'lydian-augmented', 'lydian-dominant', 'mixolydian-b6', 'locrian-nat2', 'altered', 'phrygian-dominant', 'diminished-hw', 'diminished-wh', 'whole-tone', 'bebop-dominant', 'bebop-major', 'bebop-dorian', 'bebop-melodic-minor', 'dominant-pentatonic', 'minor6-pentatonic'],
  colour: ['locrian-nat6', 'ionian-sharp5', 'dorian-sharp4', 'lydian-sharp2', 'altered-dim', 'harmonic-major', 'dorian-b5', 'phrygian-b4', 'lydian-b3', 'mixolydian-b2', 'lydian-augmented-sharp2', 'locrian-bb7', 'double-harmonic', 'gypsy-minor', 'in-sen', 'hirajoshi', 'augmented'],
};
export const TIER_NAMES = { core: 'Core', jazz: 'Jazz', colour: 'Colour' };
// the modes the drill videos teach: the Mode Tester's default set
export const MODE_DEFAULT = ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian', 'melodic-minor', 'lydian-dominant', 'altered', 'locrian-nat2', 'harmonic-minor', 'phrygian-dominant'];
// brightest to darkest, for the ladder
export const BRIGHTNESS = ['lydian', 'ionian', 'mixolydian', 'dorian', 'aeolian', 'phrygian', 'locrian'];
const NICK = { 'bebop-major': 'bebop major (Barry Harris 6th-diminished)' };
export const scaleName = (id) => NICK[id] || T.getScale(id).name;
export const FAMILY = { major: 'the major scale', 'melodic-minor': 'melodic minor', 'harmonic-minor': 'harmonic minor', 'harmonic-major': 'harmonic major' };

export const semisOf = (iv) => T.intervalSemis(iv) % 12;
export const pcsOf = (id) => [...new Set(T.getScale(id).ivs.map(semisOf))].sort((a, b) => a - b);
// the formula as spelled (altered reads 1 ♭9 ♯9 3 ♯11 ♭13 ♭7, as jazz players think of it; plain ivs shown too)
export const formula = (id) => (T.getScale(id).labels || T.getScale(id).ivs).map(T.prettyIv).join(' ');
export function steps(id) {
  const p = pcsOf(id);
  const name = { 1: 'H', 2: 'W', 3: 'W+H', 4: '2W' };
  return p.map((x, i) => name[((p[i + 1] ?? 12) - x)] || '?').join(' ');
}
export function parent(id) {
  const s = T.getScale(id);
  if (!s.family || s.modeIndex == null) return '';
  if (s.modeIndex === 0) return `the parent scale of its family (${FAMILY[s.family]})`;
  return `the ${ordinal(s.modeIndex + 1)} mode of ${FAMILY[s.family]}`;
}
// what makes it this scale: against major (if it has a 3) or natural minor (if ♭3)
export function colour(id) {
  const ivs = T.getScale(id).ivs;
  const p = pcsOf(id);
  if (['ionian', 'aeolian', 'major', 'natural-minor'].includes(id)) return id === 'ionian' ? 'The reference: every other scale is heard against this one.' : 'The reference minor: ♭3, ♭6, ♭7.';
  const major = p.includes(4) && !p.includes(3);
  const ref = major ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10];
  const refName = major ? 'major' : 'natural minor';
  const refIvs0 = major ? ['1', '2', '3', '4', '5', '6', '7'] : ['1', '2', 'b3', '4', '5', 'b6', 'b7'];
  // a natural degree where the reference has a flat one reads ♮7, ♮6
  const added = ivs.filter((iv) => !ref.includes(semisOf(iv))).map((iv) => (/^\d$/.test(iv) && refIvs0.includes('b' + iv) ? '♮' : '') + T.prettyIv(iv));
  const missingSemis = ref.filter((s) => !p.includes(s));
  const refIvs = major ? ['1', '2', '3', '4', '5', '6', '7'] : ['1', '2', 'b3', '4', '5', 'b6', 'b7'];
  const missing = missingSemis.map((s) => T.prettyIv(refIvs[ref.indexOf(s)]));
  const parts = [];
  if (added.length) parts.push(`${added.join(', ')} against ${refName}`);
  if (ivs.length < 7 && missing.length) parts.push(`leaves out ${missing.join(' and ')}`);
  if (!parts.length) return `Same notes as ${refName}.`;
  return parts.join('; ') + '.';
}
export function infoHTML(id, { title = true, extra = '' } = {}) {
  const s = T.getScale(id);
  const par = parent(id);
  return `<div class="info">${title ? `<div class="k">${esc(scaleName(id))}</div>` : ''}
    <div class="f">${esc(formula(id))}</div>
    ${s.labels ? `<p>Spelled from the scale: ${esc(s.ivs.map(T.prettyIv).join(' '))}</p>` : ''}
    <div class="k">Steps</div><p>${esc(steps(id))}</p>
    ${par ? `<div class="k">Family</div><p>${esc(par[0].toUpperCase() + par.slice(1))}</p>` : ''}
    <div class="k">Colour</div><p>${esc(colour(id))}</p>${extra}</div>`;
}
