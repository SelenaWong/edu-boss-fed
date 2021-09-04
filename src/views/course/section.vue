<template>
  <div class="course-section">
    <el-card>
      <div slot="header">
        课程名称
      </div>
      <el-tree :data="sections"
               :props="defaultProps"
               draggable
               :allow-drop="handleAllowDrop"
               @node-drop="handleSort"
               >
        <div class="inner" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span v-if="data.sectionName" class="actions">
            <el-button @click="handleShowEditLesson(data,node.parent.data)">编辑</el-button>
            <el-button
              type="primary"
              @click.stop="handleShowAddLesson(data)"
            >添加课时</el-button>
            <el-select
              class="select-status"
              v-model="data.status"
              placeholder="请选择"
              @change="handleSectionStatusChange(data)">
              <el-option label="已隐藏" :value="0"/>
              <el-option label="待更新" :value="1"/>
              <el-option label="已更新" :value="2"/>
            </el-select>
            <el-button>状态</el-button>
          </span>
          <span v-else class="actions">
            <el-button @click="handleShowEditLesson(data,node.parent.data)">编辑</el-button>
            <el-button
              @click="$router.push({
              name:'course-video',
              params: {
               courseId
              },
              query: {
                sectionId: node.parent.id,
                lessonId: data.id
              }
              })"
            type="success">上传视频</el-button>
              <el-select
                class="select-status"
                v-model="data.status"
                placeholder="请选择"
                @change="handleSectionStatusChange(data)">
              <el-option label="已隐藏" :value="0"/>
              <el-option label="待更新" :value="1"/>
              <el-option label="已更新" :value="2"/>
            </el-select>
            <el-button>状态</el-button>
          </span>
        </div>
      </el-tree>
    </el-card>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getSectionAndLesson, saveOrUpdateSection } from '@/services/course-section'
import { saveOrUpdateLesson } from '@/services/course-lesson'
export default Vue.extend({
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        label (data: any, node: any) {
          return data.sectionName || data.theme
        }
      }
    }
  },
  created () {
    this.loadSections()
  },
  methods: {
    async loadSections () {
      const { data } = await getSectionAndLesson(this.courseId)
      this.sections = data.data
    },
    handleAllowDrop (draggingNode:any, dropNode:any, type:any) {
      // draggingNode 拖动的节点
      // dropNode 要放置的目标节点
      // type: 'prev'、'inner' 和 'next', 分别表示放置在目标节点前、插入至目标节点和
      // 只能平级拖动，不能嵌套到另一个节点中
      return draggingNode.data.sectionId === dropNode.data.sectionId && type !== 'inner' // 不能将节点插入到另一个节点的内部
    },
    async handleSort (dragNode: any, dropNode: any, type: any, event: any) {
      // console.log(dropNode.parent.childNodes)
      try {
        await Promise.all(dropNode.parent.childNodes.map((item: any, index: number) => {
          if (dragNode.data.lessonDTOS) {
            // 阶段
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index + 1
            })
          } else {
            // 课时
            return saveOrUpdateLesson({
              id: item.data.id,
              orderNum: index + 1
            })
          }
        }))
        this.$message.success('排序成功')
      } catch (e) {
        console.log(e)
        this.$message.error('排序失败')
      }
    },

    handleShowEditLesson (data:any, nodeData: any) {
      console.log(data, nodeData)
    },
    handleShowAddLesson (data: any) {
      console.log(data)
    },
    handleSectionStatusChange (data: any) {
      console.log(data)
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep .el-tree-node__content {
  height: auto;
}
.inner {
  flex: 1;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
}
</style>
