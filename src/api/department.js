import http from "@/utils/request";

export default {
  /**
   * 查询部门列表
   * @param  param
   * @returns
   */
  async getDepartmentList(param) {
    return await http.get("/api/department/list", param);
  },
  /**
   * 获取所属部门列表
   * @returns
   */
  async getParentTreeList() {
    return await http.get("/api/department/parent/list");
  },
};
