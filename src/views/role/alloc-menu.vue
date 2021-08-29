<template>
  <div class="alloc-menu">
    <el-card>
      <div slot="header">
        <span>分配权限</span>
        <el-tree :data="menus"
                 ref="menu-tree"
                 node-key="id"
                 show-checkbox
                 default-expand-all
                 :default-checked-keys="checkedKeys"
                 :props="defaultProps"
                 @node-click="handleNodeClick"></el-tree>
        <div>
          <el-button @click="resetChecked">清空</el-button>
          <el-button type="primary"
          @click="onSave">保存</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu'
import { Tree } from 'element-ui'
export default Vue.extend({
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  created () {
    this.loadMenu()
    this.loadRoleMenus()
  },
  methods: {
    handleNodeClick (data: any) {
      console.log(data)
    },
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      this.checkedKeys = []
      this.getCheckedKeys(data.data)
    },
    getCheckedKeys (menus: any) {
      menus.forEach((menu: any) => {
        if (menu.selected) {
          // this.checkedKeys.push(menu.id as never) // 这样写可能页面没有立即更新
          this.checkedKeys = [...this.checkedKeys, menu.id] as any
        }
        if (menu.subMenuList) {
          this.getCheckedKeys(menu.subMenuList)
        }
      })
    },
    async loadMenu () {
      const { data } = await getMenuNodeList()
      this.menus = data.data
    },
    async onSave () {
      // 拿到选中节点的数据id列表
      // 请求提交保存
      const menuIdList = (this.$refs['menu-tree'] as Tree).getCheckedKeys()
      await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList
      })
      this.$message('保存成功！')
      this.$router.back()
    },
    resetChecked () {
      (this.$refs['menu-tree'] as Tree).setCheckedKeys([])
    }
  }
})
</script>
<style lang="scss" scoped></style>
