import useObjectQueryStringify from './useObjectQueryStringify';

/**
 * axios 初始化
 * @param {Axios} axios 库
 */
export default (axios) => params => {
  if (!axios || !axios.create) {
    throw new Error('请引入正确的 axios 包');
  }
  return {
    /**
     * axios 实例化对象
     */
    xhr: axios.create(params),

    /**
     * 设置输出的格式
     * @param {String} method 对应什么方法 common | get | post ...
     * @param {Object} headers 头部信息
     */
    useHeaders(method = 'common', headers = {}) {
      for (let key in headers) {
        this.xhr.defaults.headers[method][key] = headers[key];
      }
    },

    /**
     * 设置请求基础地址
     * @param {String} url 地址
     */
    useBaseUrl(url = '') {
      this.xhr.defaults.baseURL = url;
    },

    /**
     * 使用 formdata 格式的入参
     * @param {String} charset 入参编码
     */
    useFormData(charset = 'UTF-8') {
      ['post', 'put', 'patch'].forEach(method => {
        useHeaders(method, {
          'Content-Type': `application/x-www-form-urlencoded; charset=${charset}`
        });
      });

      this.xhr.defaults.transformRequest = [
        function(data) {
          return useObjectQueryStringify(data);
        }
      ];
    },

    /**
     * 设置出参状态识别字段如 error_code
     * @param {String} fieldName 
     * @param {String|Number} normalValue 正常情况的值，其他则发送事件
     * @param {Function} handler 处理
     */
    useResponseStatusError = function(fieldName, normalValue, handler) {
      this.xhr.defaults.transformResponse = [
        function(data) {
          if (data[fieldName] !== normalValue) {
            handler && handler(data[fieldName], data);
          }
          return data;
        }
      ];
    },

    /**
     * 设置超时
     * @param {Number} time 
     */
    useTimeout(time) {
      this.xhr.defaults.timeout = time;
    }
  };
};