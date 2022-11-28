<template>
  <div class="chooseIcons">
    <el-popover placement="bottom" width="450" trigger="click">
      <span
        slot="reference"
        style="
          display: inline-block;
          width: 200px;
          height: 33px;
          line-height: 33px;
        "
      >
        <i :class="userChooseIcon"></i>
        {{ userChooseIcon }}
      </span>
      <div class="iconList">
        <i
          v-for="item in iconList"
          :key="item"
          :class="item"
          @click="setIcon(item)"
          style="font-size: 20px"
        ></i>
      </div>
    </el-popover>
  </div>
</template>
<script>
//导入icon
import { elementIcons } from "@/utils/icons";
export default {
  name: "MyIcon",
  data() {
    return {
      iconList: [], //图标列表
      userChooseIcon: "",
    };
  },
  methods: {
    /**
     * 查询icon列表
     */
    getIconList() {
      this.iconList = elementIcons;
    },
    setIcon(icon) {
      //将i的样式设为选中的样式el-icon-xxx

      console.log(icon);
      this.userChooseIcon = icon;
      //将选中的图标传递给父组件
      this.$emit("selection", this.icon); //参数1是自定义接收的名称 参数2:要传递的数据
    },
  },
  created() {
    //调用查询图标列表方法
    this.getIconList();
  },
};
</script>
<style lang="scss" scoped>
.iconList {
  width: 400px;
  height: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  i {
    display: inline-block;
    width: 60px;
    height: 45px;
    color: #000000;
    font-size: 20px;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    line-height: 45px;
    margin: 5px;
    &:hover {
      color: orange;
      border-color: orange;
    }
  }
}
.chooseIcons {
  width: 175px;
  background-color: #ffffff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 33px;
  line-height: 25px;
  outline: none;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>