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

export const omit = (entity: any, omitKeys: string | string[]) => {
  const keys = Array.isArray(omitKeys) ? omitKeys : [omitKeys];

  if (entity) {
    for (const key in keys) {
      key in entity && delete entity[key];
    }
  }

  return entity;
};
