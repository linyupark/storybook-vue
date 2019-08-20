### 适用于 Vue 的综合库（未编译）

**changelog**

* @0.0.27-dev 修复部分组件1像素问题
* @0.0.26-dev 修复一些弹出层mask会影响其他布局的问题
* @0.0.24-dev 新增 resp/actionsheet/list,base,regions 上滑抽屉、地区选择
* @0.0.23-dev 新增 input/LimitText 限制字数文本框
* @0.0.22-dev 新增 upload/snapshot 截图上传组件
* @0.0.21-dev 演示地址改为 http://linyupark.github.io/projects/storybook-crh-vue/
* @0.0.20-dev list/nav 列表滚动定位导航
* @0.0.19-dev 带弹出的遮罩zIndex可设置并避免滑动穿透
* @0.0.18-dev input/tag 标签管理（仿微信）
* @0.0.16-dev input/base/search || index 基础输入框 || 搜索框
* @0.0.11-dev filter/tags 支持多个分组
* @0.0.10-dev list/refresh, list/loadByScroll 增加下拉刷新跟上拉加载
* @0.0.9-dev filter/dropdown 增加选择框跟遮罩层的样式微调
* @0.0.8-dev 新增 resp/modal 提示跟确认弹框
* @0.0.7-dev 新增 list/slide 可滑动操作的列表单元
* @0.0.6-dev 新增 filter/tags 可作为 filterDropdown 中的标签选择筛选
* @0.0.4-debug 新增 List , ListItem, FilterDropdown 组件

**包含**

- `functions` 各类工具函数
- `sass` 常用全局样式
- 其他 UI 组件，在线演示地址：http://linyupark.github.io/projects/storybook-crh-vue/

**使用注意点**

因为是未编译版，因此编译工具需要将 `node_modules/@crh/vue` 目录设置为可引入编译的目录

```js
/** 这里举例脚本 */
module: {
  rules: [
    {
      test: /\.(js|ts|jsx)?$/,
      include: [path.resolve(__dirname, 'node_modules/@crh/vue'), ...],
      exclude: [/node_modules/],
      use: [
        {
          loader: 'babel-loader'
        }
      ]
    },
  ]
}
```

一些组件使用到了样式函数，因此需要引入 `sass/var.scss`

```js
/** 加入 scss 支持 */
config.module.rules.push({
  test: /\.scss$/,
  include: path.resolve(__dirname, '../packages'),
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        importLoaders: 2
      }
    },
    {
      loader: 'postcss-loader'
    },
    {
      loader: 'sass-loader',
      options: {
        data: `
          @import "~@crh/vue/sass/var.scss";
        `
      }
    }
  ]
});
```
