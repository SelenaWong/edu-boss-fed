<template>
  <div class="course-section">课程内容</div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name:'CourseSection',
  props: {
     courseId: {
       type: [String, Number],
       required: true
     }
  }
})
</script>
<style lang="scss" scoped></style>
