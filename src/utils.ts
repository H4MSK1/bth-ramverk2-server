var bcrypt = require('bcryptjs');

export const createHashFromString = async (value: string): Promise<any> => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(value, salt);
    return hash;
  } catch (e) {
    throw e;
  }
};

export const compareHash = async (
  hash: string,
  value: string,
): Promise<any> => {
  try {
    const result = await bcrypt.compare(value, hash);
    return result;
  } catch {
    return false;
  }
};

export const omit = (obj: any, omitKeys: string | string[]) => {
  const keys: string[] = Array.isArray(omitKeys) ? omitKeys : [omitKeys];
  let result: any;

  if (obj) {
    const entity = { ...obj };
    for (const key of keys) {
      key in entity && delete entity[key];
    }

    result = entity;
  }

  return result;
};
