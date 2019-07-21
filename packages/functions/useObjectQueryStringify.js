/**
 * 对象转换成 url 查询
 * @param {Object} params 
 * @param {String} prefix 
 */
export default function(params = {}, prefix) {
  const query = Object.keys(params).map(k => {
    let key = k;
    const value = params[key];

    if (!value && (value === null || value === undefined || isNaN(value))) {
      value = '';
    }

    switch (params.constructor) {
      case Array:
        key = `${prefix}[]`;
        break;
      case Object:
        key = prefix ? `${prefix}[${key}]` : key;
        break;
    }

    if (typeof value === 'object') {
      return this.toQueryString(value, key); // for nested objects
    }

    return `${key}=${encodeURIComponent(value)}`;
  });

  return query.join('&');
}
