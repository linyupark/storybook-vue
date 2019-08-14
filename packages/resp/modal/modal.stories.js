import { storiesOf } from '@storybook/vue';
import { text, select, boolean, number, array } from '@storybook/addon-knobs';

import Modal from '@crh/vue/resp/modal/index';
import IconSvg from '@crh/vue/icon/svg';

storiesOf('反馈|Modal', module).add(
  'Base',
  () => ({
    components: {
      Modal,
      IconSvg
    },
    props: {},
    data() {
      return {};
    },
    methods: {
      openModal() {
        Modal.show({
          title: '警告',
          content: '点确定后延迟1秒关闭',
          onOk: async () => {
            return await new Promise((resolve, rejects) => {
              setTimeout(() => {
                resolve('closeNow');
              }, 1000);
            });
          }
        });
      },
      openConfirmModal() {
        Modal.show({
          type: 'confirm',
          title: '确认操作',
          content: '确定要删除这个消息吗？',
          onOk: () => {
            alert('你点了确定');
          }
        });
      },
      openCustomModal() {
        this.$refs.modal3.show();
      },
      select(v) {
        alert(v);
        this.$refs.modal3.close();
      }
    },
    template: `
      <div style="height: 200vh">
        <h4>Modal.show (alert 提醒)</h4>
        <center><button @click="openModal">警告</button></center>
        <h4>Modal.show (confirm 确认)</h4>
        <center><button @click="openConfirmModal">确认</button></center>
        <h4>自定义按钮</h4>
        <center><button @click="openCustomModal">自定义</button></center>
        <Modal title="请选择" ref="modal3">
          你喜欢哪个颜色？
          <template slot="buttons">
            <button class="ok" @click="select('红色')">红色</button>
            <button class="ok" @click="select('黄色')">黄色</button>
            <button class="ok" @click="select('绿色')">绿色</button>
          </template>
        </Modal>
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
