<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true"
                 :model="form"
                 ref="form"
                 class="demo-form-inline">
          <el-form-item
            prop="name"
            label="资源名称">
            <el-input v-model="form.name"
                      placeholder="资源名称"></el-input>
          </el-form-item>
          <el-form-item
            prop="url"
            label="资源路径">
            <el-input v-model="form.url"
                      placeholder="资源路径"></el-input>
          </el-form-item>
          <el-form-item
            prop="categoryId"
            label="资源分类">
            <el-select v-model="form.categoryId"
                       clearable
                       placeholder="资源分类">
              <el-option
                v-for="category in resourceCategories"
                :key="category.id"
                :label="category.name"
                :value="category.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       :disabled="isLoading"
                       @click="onSubmit">查询</el-button>
            <el-button type="primary"
                       :disabled="isLoading"
                       @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="resources"
        style="width: 100%"
        v-loading="isLoading">
        <el-table-column
          type="index"
          label="编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="资源名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="url"
          label="资源路径"
          width="180">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          width="180">
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="添加时间"
          width="180">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="180">
          <el-button @click="handleEdit(scope.$index, scope.row)"
                     size="mini"
          >编辑
          </el-button>
          <el-button @click="handleDelete(scope.$index, scope.row)"
                     type="danger"
                     size="mini">删除
          </el-button>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="form.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :disabled="isLoading"
        :total="totalCount">
      </el-pagination>
    </el-card>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getResourcePage } from '@/services/resource.ts'
import { getResourceCategories } from '@/services/resource-category.ts'
import { Form } from "element-ui"

export default Vue.extend({
  name: 'ResourceList',
  data () {
    return {
      resourceCategories: [],
      resources: [],
      form: {
        name: '',
        url: '',
        categoryId: null,
        current: 1,
        size: 10
      },
      totalCount: 0,
      isLoading: true //加载状态
    }
  },
  created () {
    this.loadResources()
    this.loadResourceCategories()
  },
  methods: {
    onSubmit () {
      this.form.current = 1
      this.loadResources()
    },
    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.current = 1
      this.loadResources()
    },
    async loadResources () {
      this.isLoading = true
      const { data } = await getResourcePage(this.form)
      this.resources = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false
    },
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      this.resourceCategories = data.data
    },
    handleEdit (index: number, item: any) {
      this.$router.push({
        name: 'resource-edit',
        params: { id: item.id }
      })
    },
    handleDelete (index: number, item: any) {
      this.$confirm('确定删除吗？', '删除提示', {})
        .then(async () => { // 取消执行这里
          // 请求删除操作
        }).catch(err => {
          console.log(err)
          this.$message.info('已取消删除')
        })
    },
    handleSizeChange (val: number) {
      this.form.size = val
      this.form.current = 1
      this.loadResources()
    },
    handleCurrentChange (val: number) {
      this.form.current = val
      this.loadResources()
    }
  }
})
</script>
<style lang="scss" scoped></style>
