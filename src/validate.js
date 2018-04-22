const cs1 = (code) => {
  if (code.includes('<!--') && code.includes('password')) {
    return false;
  }

  return true;
};

const cs2 = (code) => {
  if (code.includes('md5(') || code.includes('md5 (')) {
    return true;
  }

  return false;
};


export default [cs1, cs2];
