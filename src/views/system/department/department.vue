<template>
  <el-main>
    <!-- 查询条件-->
    <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
      <el-form-item>
        <el-input
          v-model="searchModel.departmentName"
          placeholder="请输入部门名称"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search()"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh-right">重置</el-button>
        <el-button type="success" icon="el-icon-plus" @click="openAddwindow()"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 数据表格-->
    <!--
        data属性:表格数据
        border属性:表格边框
        stripe属性:表格斑马线
        row-key属性:行数据的key,用来优化Table的渲染
        default-expend-all属性:默认展开树形表格数据
        tree-props属性:树形表格配置属性选项
    -->
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      stripe
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <!-- 
        prop:填写数据的属性名称
        label:表格表头标题 
    -->
      <el-table-column prop="departmentName" label="部门名称" />
      <el-table-column prop="parentName" label="所属部门" />
      <el-table-column prop="phone" label="部门电话" />
      <el-table-column prop="address" label="部门地址" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            icon="el-icon-edit-outline"
            type="primary"
            @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="small"
            icon="el-icon-delete-solide"
            type="danger"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--添加和修改窗口-->
    <SystemDialog
      :title="deptDialog.title"
      :visible="deptDialog.visible"
      :width="deptDialog.width"
      :height="deptDialog.height"
      @onClose="onClose()"
      @onConfirm="onConfirm()"
    >
      <div slot="content">
        <el-form
          :model="dept"
          rel="deptForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-form-item label="所属部门" prop="parentName">
            <el-input
              v-model="dept.parentName"
              :readonly="true"
              @click.native="openSelectDeptWindow()"
            ></el-input>
          </el-form-item>
          <el-form-item label="部门名称" prop="deparentName">
            <el-input v-model="dept.deparentName"></el-input>
          </el-form-item>
          <el-form-item label="部门电话">
            <el-input v-model="dept.phone"></el-input>
          </el-form-item>
          <el-form-item label="部门地址">
            <el-input v-model="dept.address"></el-input>
          </el-form-item>
          <el-form-item label="序号">
            <el-input v-model="dept.orderNum"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </SystemDialog>
    <!--选择所属部门窗口-->
    <SystemDialog
      :title="parentDialog.title"
      :visible="parentDialog.visible"
      :width="parentDialog.width"
      :height="parentDialog.height"
      @onClose="onParentClose()"
      @onConfirm="onParenConfirm()"
    >
      <div slot="content">
        <el-form
          :model="dept"
          rel="deptForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-tree
            ref="parentTree"
            :data="treeList"
            node-key="id"
            :props="defaultProps"
            empty-text="暂无数据"
            :highlight-current="true"
            :default-expand-all="true"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          >
            <div class="customer-tree-node" slot-scope="{ node, data }">
              <!--判断当前节点的子节点长度是否为0-->
              <span v-if="data.children.length === 0">
                <i class="el-icon-document"></i>
              </span>
              <span v-else @click="changeIcon(data)">
                <svg-icon v-if="data.open" icon-class="add-s"></svg-icon>
                <svg-icon v-else icon-class="sub-s"></svg-icon>
              </span>
              <span style="margin-left: 3px">{{ node.label }} </span>
            </div>
          </el-tree>
        </el-form>
      </div>
    </SystemDialog>
  </el-main>
</template>
<script>
//导入department脚本文件
import departmentApi from "@/api/department";
//导入SystemDialog组件
import SystemDialog from "@/components/system/SystemDialog.vue";

export default {
  name: "department",
  data() {
    return {
      searchModel: {
        departmentName: "", //部门名称
      },
      tableData: [], //表格名称
      deptDialog: {
        title: "", //窗口标题
        visible: false, //是否显示
        width: 640, //窗口宽度
        height: 240, //窗口高度
      },
      dept: {
        id: "",
        parentName: "", //所属部门
        pid: "", //所属部门id
        deparentName: "", //部门名称
        phone: "", //部门电话
        address: "", //部门地址
        orderNum: "", //序号
      },
      rules: {
        parentName: [
          { required: true, message: "请选择所属部门", trigger: "change" },
        ],
        deparentName: [
          { required: true, message: "请输入部门名称", trigger: "blur" },
        ],
      },
      //选择所属部门属性
      parentDialog: {
        title: "选择所属部门", //窗口标题
        visible: false, //是否显示
        width: 400, //窗口宽度
        height: 400, //窗口高度
      },
      treeList: [], //树形数据
      //树形组件默认属性值
      defaultProps: {
        children: "children",
        label: "departmentName",
      },
    };
  },
  components: {
    SystemDialog,
  },
  //初始化时调用查询部门列表方法
  created() {
    this.search();
  },
  methods: {
    /**
     * 查询部门列表
     */
    async search() {
      //发送查询请求
      let res = await departmentApi.getDepartmentList(this.searchModel);
      console.log(res);
      //判断是否成功
      if (res.success) {
        this.tableData = res.data;
      }
    },
    /**
     * 窗口关闭事件
     */
    openAddwindow() {
      console.log(this.$refs);
      //清空表单数据
      this.$resetForm("deptForm", this.dept);
      //设置窗口属性
      this.deptDialog.title = "新增部门";
      this.deptDialog.visible = true;
    },
    /**
     * 窗口关闭事件
     */
    onClose() {
      this.deptDialog.visible = false;
    },
    /**
     * 窗口确认事件
     */
    onConfirm() {
      this.deptDialog.visible = false;
    },
    /**
     * 选择所属部门取消事件
     */
    onParentClose() {
      this.parentDialog.visible = false;
    },
    /**
     * 选择所属部门确认事件
     */
    onParenConfirm() {
      this.parentDialog.visible = false;
    },
    async openSelectDeptWindow() {
      //设置窗口属性
      this.parentDialog.visible = true;
      //查询所属部门列表
      let res = await departmentApi.getParentTreeList();

      console.log(res);
      //判断是否成功
      if (res.success) {
        this.treeList = res.data;
      }
    },
    handleNodeClick(data) {
      this.dept.id = data.id;
      this.dept.parentName = data.departmentName;
    },
    changeIcon(data) {
      data.open = !data.open;
      console.log(this.$refs.parentTree);
      this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-tree {
  .el-tree-node {
    position: relative;
    padding-left: 10px;
  }
  .el-tree-node__children {
    padding-left: 20px;
  }
  .el-tree-node :last-child:before {
    height: 40px;
  }
  .el-tree > .el-tree-node:before {
    border-left: none;
  }
  .el-tree > .el-tree-node:after {
    border-top: none;
  }
  .el-tree-node:before,
  .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .tree :first-child .el-tree-node:before {
    border-left: none;
  }
  .el-tree-node:before {
    border-left: 1px dotted #d9d9d9;
    bottom: 0px;
    height: 100%;
    top: -25px;
    width: 1px;
  }
  .el-tree-node:after {
    border-top: 1px dotted #d9d9d9;
    height: 20px;
    top: 14px;
    width: 24px;
  }
  .el-tree-node__expand-icon.is-leaf {
    width: 8px;
  }
  .el-tree-node__content > .el-tree-node__expand-icon {
    display: none;
  }
  .el-tree-node__content {
    line-height: 30px;
    height: 30px;
    padding-left: 10px !important;
  }
}
::v-deep .el-tree > div {
  &::before {
    display: none;
  }
  &::after {
    display: none;
  }
}
</style>
