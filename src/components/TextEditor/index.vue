<template>
  <div ref="editor" class="text-editor">
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import E from 'wangeditor'
import { uploadCourseImage } from '@/services/course'
export default Vue.extend({
  name: 'TextEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  mounted () {
    // 组件已经渲染好，可以初始化操作DOM
    this.initEditor()
  },
  methods: {
    initEditor () {
      const editor = new E(this.$refs.editor as any)
      editor.config.onchange = (newValue: string) => {
        this.$emit('input', newValue)
      }
      editor.config.customUploadImg = async (resultFiles:File[], insertImgFn:any) => {
        // 1.把用户选择的resultFiles上传到服务器端
        const fd = new FormData()
        fd.append('file', resultFiles[0])
        const { data } = await uploadCourseImage(fd)
        // 根据图片地址生产img标签插入到富文本编辑器内容中
        insertImgFn(data.data.name)
      }
      editor.create()
      // 注意：设置初始化必须在create之后
      editor.txt.html(this.value)
      // 自定义本地图片上传
    }
  }
})
</script>
<style lang="scss" scoped>

</style>
