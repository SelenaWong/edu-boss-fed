<template>
  <div class="course-create">
    <el-card>
      <div slot="header">
        <el-steps :active="activeStep" simple>
          <el-step v-for="(step, index) in steps"
                   :key="index"
                   :title="step.title"
                   :icon="step.icon"
                   @click.native="activeStep = index"/>
        </el-steps>
      </div>
      <el-form label-width="80px">
        <div v-show="activeStep===0">
          <el-form-item label="课程名称">
            <el-input v-model="course.courseName"></el-input>
          </el-form-item>
          <el-form-item label="课程简介">
            <el-input v-model="course.brief"></el-input>
          </el-form-item>
          <el-form-item label="课程概述">
            <el-input
              style="margin-bottom: 10px"
              v-model="course.previewFirstField"
              type="textarea"
              placeholder="概述1"></el-input>
            <el-input
              style="margin-bottom: 10px"
              v-model="course.previewSecondField"
              type="textarea"
              placeholder="概述2"></el-input>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input v-model="course.teacherDTO.teacherName"></el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input v-model="course.teacherDTO.description"></el-input>
          </el-form-item>
          <el-form-item label="课程排序">
            <el-input-number v-model="course.sortNum"
                             @change="handleChangeSort"></el-input-number>
          </el-form-item>
        </div>
        <div v-show="activeStep===1">
          <el-form-item label="课程封面">
<!--            upload 上传文件组件，支持自动上传，只需要把上传需要参数配置下就可以了-->
<!--            1.组件需要根据绑定的数据进行图片预览-->
<!--            2.组件需要把上传成功的图片地址同步到绑定的数据中-->
<!--            v-model的本质是父子组件通信-->
<!--            1. 它会给子组件传递一个名字叫value的数据（Props）-->
<!--            2. 默认监听input事件，修改绑定的数据(自定义事件)-->
            <course-image
              v-model="course.courseListImg"/>
          </el-form-item>
          <el-form-item label="解锁封面">
            <course-image
              :limit="10"
              v-model="course.courseImgUrl"/>
          </el-form-item>
        </div>
        <div v-show="activeStep===2">
          <el-form-item label="售卖价格">
            <el-input v-model="course.discounts">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input v-model="course.price">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input v-model="course.sales">
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input v-model="course.discountsTag">
            </el-input>
          </el-form-item>
        </div>
        <div v-show="activeStep===3">
          <el-form-item label="限时秒杀开关">
            <el-switch
              v-model="isSeckill"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <template v-if="isSeckill">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="course.activityCourseDTO.beginTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="course.activityCourseDTO.endTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input v-model="course.activityCourseDTO.amount">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="秒杀库存">
              <el-input v-model="course.activityCourseDTO.stock">
                <template slot="append">件</template>
              </el-input>
            </el-form-item>
          </template>
        </div>
        <div v-show="activeStep===4">
          <el-form-item label="课程详情">
            <el-input
              type="textarea"
              v-model="course.courseDescriptionMarkDown"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSave">保存</el-button>
          </el-form-item>
        </div>
        <el-form-item v-if="activeStep > 1 && activeStep< 4">
          <el-button @click="activeStep--">上一步</el-button>
        </el-form-item>
        <el-form-item v-if="activeStep > 0 && activeStep< 4">
          <el-button @click="activeStep++">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import CourseImage from './components/CourseImage.vue'
import { saveOrUpdateCourse } from '@/services/course'

export default Vue.extend({
  name: 'CourseCreate',
  components: {
    CourseImage
  },
  data () {
    return {
      activeStep: 0,
      steps: [
        {
          title: '基本信息',
          icon: 'el-icon-edit'
        },
        {
          title: '课程封面',
          icon: 'el-icon-upload'
        },
        {
          title: '销售信息',
          icon: 'el-icon-picture'
        },
        {
          title: '秒杀活动',
          icon: 'el-icon-picture'
        },
        {
          title: '课程详情',
          icon: 'el-icon-picture'
        }
      ],
      form: {
        sort: 1
      },
      imageUrl: '',
      isSeckill: false,
      course: {
        // id: 0,
        courseName: '',
        brief: '',
        teacherDTO: {
          // id: 0,
          // courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        courseDescriptionMarkDown: '',
        price: 0,
        discounts: 0,
        priceTag: '',
        previewFirstField: '',
        previewSecondField: '',
        discountsTag: '',
        courseListImg: '',
        courseImgUrl: '',
        sortNum: 0,
        status: 0,
        sales: 0,
        activityCourse: true,
        activityCourseDTO: {
          // id: 0,
          // courseId: 0,
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        }
      }
    }
  },
  methods: {
    handleChangeSort (event: any) {
      console.log(event)
    },
    async handleSave () {
      const { data } = await saveOrUpdateCourse(this.course)
      console.log(data)
    }
  }
})
</script>

<style lang="scss" scoped>
  .el-step {
    cursor: pointer;
  }
</style>
