import useObjectQueryStringify from './useObjectQueryStringify';
import axios from 'axios';

/** 设置 axios */
export default () => {

  try {
    let AxiosInstance = axios.create();

    /**
     * 返回实例
     */
    const useInstance = function() {
      return AxiosInstance;
    };

    /**
     * 设置输出的格式
     * @param {String} method 对应什么方法 common | get | post ...
     * @param {Object} headers 头部信息
     */
    const useHeaders = function(method = 'common', headers = {}) {
      for (let key in headers) {
        AxiosInstance.defaults.headers[method][key] = headers[key];
      }
      return this;
    };

    /**
     * 设置请求基础地址
     * @param {String} url 地址
     */
    const useBaseUrl = function(url = '') {
      AxiosInstance.defaults.baseURL = url;
      return this;
    };

    /**
     * 使用 formdata 格式的入参
     * @param {String} charset 入参编码
     */
    const useFormData = function(charset = 'UTF-8') {
      ['post', 'put', 'patch'].forEach(method => {
        useHeaders(method, {
          'Content-Type': `application/x-www-form-urlencoded; charset=${charset}`
        });
      });

      AxiosInstance.defaults.transformRequest = [
        function(data) {
          return useObjectQueryStringify(data);
        }
      ];
      return this;
    };

    /**
     * 设置出参状态识别字段如 error_code
     * @param {String} fieldName 
     * @param {String|Number} normalValue 正常情况的值，其他则发送事件
     * @param {Function} handler 处理
     */
    const useResponseStatusError = function(fieldName, normalValue, handler) {
      AxiosInstance.defaults.transformResponse = [
        function(data) {
          if (data[fieldName] !== normalValue) {
            handler && handler(data[fieldName], data);
          }
          return data;
        }
      ];
    }

    /**
     * 设置超时
     * @param {Number} time 
     */
    const useTimeout = function(time) {
      AxiosInstance.defaults.timeout = time;
    }

    return {
      useHeaders,
      useBaseUrl,
      useFormData,
      useTimeout,
      useResponseStatusError,
      useInstance,
    };
  } catch (e) {
    throw e;
  }
};
