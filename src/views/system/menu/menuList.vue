<template>
  <el-main>
    <!-- 新增按钮 -->
    <el-button
      type="success"
      size="small"
      @click="openAddWindow()"
      icon="el-icon-plus"
      >新增</el-button
    >
    <!-- 数据表格 -->
    <el-table
      :data="menuList"
      :height="tableHeight"
      style="width: 100%; margin-top: 20px"
      row-key="id"
      border
      default-expand-all
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="label" label="菜单名称"></el-table-column>
      <el-table-column prop="type" label="菜单类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 1">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 0" type="success">菜单</el-tag>
          <el-tag v-else type="warning">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="菜单图标" align="center">
        <template slot-scope="scope">
          <i
            :class="scope.row.icon"
            v-if="scope.row.icon.includes('el-icon')"
          ></i>
          <i :class="scope.row.icon" v-else></i>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="路由名称"></el-table-column>
      <el-table-column prop="path" label="理由地址"></el-table-column>
      <el-table-column prop="url" label="组件路径"></el-table-column>
      <el-table-column label="操作"></el-table-column>
    </el-table>
    <!-- 新增或修改窗口 -->
    <system-dialog
      :title="menuDialog.title"
      :visible="menuDialog.visible"
      :width="menuDialog.width"
      :height="menuDialog.height"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          :model="menu"
          ref="menuForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item prop="type" label="菜单类型">
                <el-radio-group v-model="menu.type">
                  <el-radio :label="0">目录</el-radio>
                  <el-radio :label="1">菜单</el-radio>
                  <el-radio :label="2">按钮</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item prop="parentName" size="small" label="所属菜单">
            <el-input
              @click.native="selectParentMenu"
              v-model="menu.parentName"
              :readonly="true"
            ></el-input>
          </el-form-item>
          <el-form-item prop="label" size="small" label="菜单名称">
            <el-input v-model="menu.label"></el-input>
          </el-form-item>

          <el-form-item
            prop="name"
            v-if="menu.type == 1"
            size="small"
            label="路由名称"
          >
            <el-input v-model="menu.name"></el-input>
          </el-form-item>
          <el-form-item
            prop="path"
            v-if="menu.type != 2"
            size="small"
            label="路由地址"
          >
            <el-input v-model="menu.path"></el-input>
          </el-form-item>
          <el-form-item
            prop="url"
            v-if="menu.type == 1"
            size="small"
            label="组件路径"
          >
            <el-input v-model="menu.url"></el-input>
          </el-form-item>
          <el-form-item prop="code" size="small" label="权限字段">
            <el-input v-model="menu.code"></el-input>
          </el-form-item>
          <el-form-item size="small" label="菜单图标">
            <my-icon @selecticon="setIcon" ref="child"></my-icon>
          </el-form-item>
          <el-form-item size="small" label="菜单序号">
            <el-input v-model="menu.orderNum"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </system-dialog>
    <!--选择上级菜单弹框-->
    <system-dialog
      :title="parentDialog.title"
      :visible="parentDialog.visible"
      :width="parentDialog.width"
      :height="parentDialog.height"
      @onClose="onParentClose"
      @onConfirm="onParentConfirm"
    >
      <div slot="content">
        <el-tree
          style="font-size: 14px"
          ref="parentTree"
          :data="parentMenuList"
          node-key="id"
          :props="defaultProps"
          empty-text="暂无数据"
          :show-checkbox="false"
          default-expand-all
          :highlight-current="true"
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        >
          <div class="customer-tree-node" slot-scope="{ node, data }">
            <!--判断当前节点的子节点长度是否为0-->
            <span v-if="data.children.length === 0">
              <i
                class="el-icon-document"
                style="color: #8c8c8c; font-size: 18px"
              ></i>
            </span>
            <span v-else @click.stop="changeIcon(data)">
              <svg-icon v-if="data.open" icon-class="add-s"></svg-icon>
              <svg-icon v-else icon-class="sub-s"></svg-icon>
            </span>
            <span style="margin-left: 3px">{{ node.label }} </span>
          </div>
        </el-tree>
      </div>
    </system-dialog>
  </el-main>
</template>
  
  <script>
// 导入menu.js脚本文件
import menuApi from "@/api/menu";
// 导入对话框组件
import SystemDialog from "@/components/system/SystemDialog.vue";
// 导入图标组件
import MyIcon from "@/components/system/MyIcon.vue";
export default {
  name: "menuList",
  data() {
    return {
      menuList: [], //数据列表
      tableHeight: 0, //表格高度
      menuDialog: {
        title: "新增菜单",
        visible: false,
        width: 630,
        height: 270,
      },
      menu: {
        name: "",
        parentName: "",
        path: "",
        type: "",
        url: "",
        icon: "",
        label: "",
        code: "",
        orderNum: "",
      },
      rules: {
        type: [
          { required: true, trigger: "change", message: "请选择菜单类型" },
        ],
        parentName: [
          { required: true, trigger: "change", message: "请选择所属菜单" },
        ],
        label: [{ required: true, trigger: "blur", message: "请选择菜单名称" }],
        name: [{ required: true, trigger: "blur", message: "请选择路由名称" }],
        path: [{ required: true, trigger: "blur", message: "请选择路由路径" }],
        url: [{ required: true, trigger: "blur", message: "请选择组件路径" }],
        code: [{ required: true, trigger: "blur", message: "请选择权限字段" }],
      },
      //上级菜单弹框属性
      parentDialog: {
        title: "请选择所属菜单",
        width: 360,
        height: 600,
        visible: false,
      },
      //树属性定义
      defaultProps: {
        children: "children",
        label: "label",
      },
      parentMenuList: [], //所属菜单列表
    };
  },
  components: {
    SystemDialog,
    MyIcon,
  },
  //初始化时调用
  created() {
    //查询菜单列表
    this.search();
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 180;
    });
  },
  methods: {
    async search() {
      //发送查询请求
      let res = await menuApi.getMenuList();
      //判断是否成功
      if (res.success) {
        this.menuList = res.data;
      }
    },
    /**
     * 打开新增窗口
     */
    openAddWindow() {
      //清空表单数据
      this.$resetForm("menuForm", this.menu);
      //设置窗口的标题
      this.menuDialog.title = "新增菜单";
      //显示窗口
      this.menuDialog.visible = true;
      this.$nextTick(() => {
        this.$refs["child"].userChooseIcon = ""; //清空菜单图标
      });
    },
    /**
     * 选择所属菜单
     */
    async selectParentMenu() {
      //显示窗口
      this.parentDialog.visible = true;
      //发送查询请求
      let res = await menuApi.getMenuList();
      if (res.success) {
        //赋值
        this.parentMenuList = res.data;
      }
    },
    /**
     * 关闭取消按钮点击事件
     */
    onClose() {
      //关闭窗口
      this.menuDialog.visible = false;
    },
    /**
     * 确认按钮点击事件
     */
    onConfirm() {
      //表单验证
      this.$refs.menuForm.validate((valid) => {
        if (valid) {
          //关闭窗口
          this.menuDialog.visible = false;
        }
      });
    },
    /**
     * 关闭取消按钮点击事件
     */
    onParentClose() {
      //关闭窗口
      this.parentDialog.visible = false;
    },
    /**
     * 确认按钮点击事件
     */
    onParentConfirm() {
      //表单验证
      this.$refs.menuForm.validate((valid) => {
        if (valid) {
          //关闭窗口
          this.parentDialog.visible = false;
        }
      });
    },
    changeIcon(data) {
      data.open = !data.open;
      this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open;
    },
    /**
     * 所属菜单节点点击事件
     */
    handleNodeClick(data) {
      //所属父级菜单ID
      this.menu.parentId = data.id;
      //所属父级菜单名称
      this.menu.parentName = data.label;
    },
    setIcon() {
      this.menu.icon = icon;
    },
  },
};
</script>
  
<style lang="scss" scoped>
</style>
  