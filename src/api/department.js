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
  /**
   * 新增部门
   * @returns
   */
  async addDept(params) {
    return await http.post("/api/department/add", params);
  },
  /**
   * 编辑部门
   * @returns
   */
  async updateDept(params) {
    return await http.put("/api/department/update", params);
  },
  /**
   * 判断该部门下是否存在子部门
   * @returns
   */
  async checkDept(params) {
    return await http.getRestApi("/api/department/check", params);
  },
  /**
   * 删除部门
   * @returns
   */
  async deleteDept(params) {
    return await http.delete("/api/department/delete", params);
  },
};
