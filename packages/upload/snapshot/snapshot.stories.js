import { storiesOf } from '@storybook/vue';
import { select, object, array, text, boolean, number } from '@storybook/addon-knobs';

import UploadSnapshot from './index';

storiesOf('元素|Upload', module).add(
  'Snapshot',
  () => ({
    components: {
      UploadSnapshot
    },
    props: {
      /** 已经上传过的图片 base64或地址 */
      images: {
        type: Array,
        default: array('images: 已经上传过的图片 base64或地址', ['data:image/png;base64,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'])
      },
      /** 文件选择筛选 */
      accept: {
        type: String,
        default: text('accept: 文件选择筛选', "image/jpeg, image/jpg, image/png, image/bmp, image/gif")
      },
      /** 可多选 */
      multiple: {
        type: Boolean,
        default: boolean('multiple: 可多选', false)
      },
      /** 预览样式微调 */
      previewInlineStyles: {
        type: Object,
        default: object('previewInlineStyles: 预览样式微调', {})
      },
      /** 最多上传几张 */
      maxNum: {
        type: Number,
        default: number('maxNum: 最多上传几张', 3)
      },
      /** 触发选择时候处理函数（默认打开h5文件选择) */
      selectHandler: {
        type: Function
      },
      /** 最大上传文件大小（KB） */
      maxUploadSize: {
        type: Number,
        default: number('maxUploadSize: 最大上传文件大小（kb）', 1024 * 4)
      },
      /** 将原图等比修改尺寸到屏幕宽度比率（默认：2倍屏幕宽） */
      resizeToScreenRatio: {
        type: Number,
        default: number('resizeToScreenRatio: 将原图等比修改尺寸到屏幕宽度比率（默认：2倍屏幕宽）', 2)
      }
    },
    methods: {
      onError(err) {
        alert(err.message);
      }
    },
    data() {
      return {
      }
    },
    mounted() {
    },
    template: `
      <div>
        <h4>上传截图</h4>
        <UploadSnapshot
          :images="images"
          :accept="accept"
          :multiple="multiple"
          :maxNum="maxNum"
          :maxUploadSize="maxUploadSize"
          :resizeToScreenRatio="resizeToScreenRatio"
          @error="onError"
        >
          <span slot="uploadText">上传截图</span>
        </UploadSnapshot>
      </div>
    `
  }),
  {
    info: true,
    knobs: {
      escapeHTML: false
    }
  }
);
