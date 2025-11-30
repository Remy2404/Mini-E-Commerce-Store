// Loads SVG icon assets and provides accessors

const ICONS = {};

export const loadIcons = async () => {
  const base = './assets';
  const files = {
    filledHeart: `${base}/heart-filled.svg`,
    outlineHeart: `${base}/heart-outline.svg`,
    logo: `${base}/logo.svg`,
    favicon: `${base}/favicon.svg`
  };

  await Promise.all(Object.keys(files).map(async (key) => {
    try {
      const resp = await fetch(files[key]);
      if (!resp.ok) throw new Error(`Failed to load ${files[key]}`);
      const text = await resp.text();
      ICONS[key] = text;
    } catch (err) {
      console.error('Error loading icon', files[key], err);
      ICONS[key] = '';
    }
  }));
};

export const getIcon = (name) => ICONS[name] || '';

export default { loadIcons, getIcon };
