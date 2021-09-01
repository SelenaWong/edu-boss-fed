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
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :http-request="handleUpload">
              <img v-if="course.courseListImg" :src="course.courseListImg" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="介绍封面">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :http-request="handleUploadCover">
              <img v-if="course.courseImgUrl" :src="course.courseImgUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
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
            <el-button type="primary">保存</el-button>
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
  import {uploadCourseImage} from '@/services/course'
  // import { saveOrUpdateCourse } from '@/services/course'

  export default Vue.extend({
    name: 'CourseCreate',
    data() {
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
          id: 0,
          courseName: '',
          brief: '',
          teacherDTO: {
            id: 0,
            courseId: 0,
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
            id: 0,
            courseId: 0,
            beginTime: '',
            endTime: '',
            amount: 0,
            stock: 0
          }
        }
      }
    },
    methods: {
      handleChangeSort(event: any) {
        console.log(event)
      },

      beforeAvatarUpload(file: any) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      async handleUpload(options: any) {
        console.log(options)
        const fd = new FormData()
        fd.append('file',options.file)
        const { data } = await uploadCourseImage(fd, function(){

        })
        this.course.courseListImg = data.data.name
        console.log(data)
      },
      async handleUploadCover(options: any) {
        console.log(options)
        const fd = new FormData()
        fd.append('file',options.file)
        // const { data } = await uploadCourseImage(fd, function(){
        //
        // })
        // this.course.courseImgUrl = data.data.name
        // console.log(data)
      }
    }
  })
</script>

<style lang="scss" scoped>
  .el-step {
    cursor: pointer;
  }

  ::v-deep .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  ::v-deep .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
