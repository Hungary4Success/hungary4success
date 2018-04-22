const cs1 = (code) => {
  if (code.includes('Jy52zb0fL976')) {
    return false;
  }

  return true;
};

const wd1 = (code) => {
  if (code.includes('styles.css')) {
    return true;
  }

  return false;
};

const cs2 = (code) => {
  if (code.includes('md5(') || code.includes('md5 (')) {
    return true;
  }

  return false;
};

const wd2 = (code) => {
  if (code.includes('x == 10')) {
    return true;
  }

  return false;
};

const wd3 = (code) => {
  const htmlBit = code.match(/[\n\r].*<body>\s*([^\n\r]*)/);
  if (htmlBit[1].includes('Flickr acquired by professional photo hosting service SmugMug')) {
    return true;
  }

  return false;
};

export default [() => {}, cs1, wd1, cs2, wd2, wd3];
