// 引入封装好的 http 方法
import http from './http';

/*接口 API 函数*/

/*用户操作*/

// 1. 登录接口函数*
export const signIn = (dataForm) => http.post('/user/signIn', dataForm);
// 2. 注册接口函数* 注册后动画不显示？
export const signup = (dataForm) => http.post('/user/signUp', dataForm);
// 3. 修改密码接口函数*
export const changePassword = ({currentPassword, newPassword}) => http.post('/user/change-password', { currentPassword, newPassword });
// 4. 获取个人信息数据接口函数*
export const getUserInfo = (username) => http.get(`/user/user-info/${username}`);

// 5. 提交代码*
export const runCode = (codeData) => http.post('/submission/run-code', codeData);

// 6. 用户申请解锁 400
export const applyUnlockUser = (username) => http.post(`/user/apply-unlock/${username}`);
// 7. 找回/重置密码*
export const resetPassword = (requestData) => http.post(`/user/reset-password`,requestData);

/*题库 题目管理 用例管理 功能 API*/

// 1. 获取题库题目列表*
export const getQuestionBankData = () => http.get('/problem/problem-bank');

// 2. 获取单个题目信息*
export const getQuestionInfo = (problemId) => http.get(`/problem/${problemId}`);
// 3. 增加题目*
export const addQuestion = (newQuestion) => http.post('/problem/add', newQuestion);
// 4. 编辑题目信息*
export const editQuestion = (problemId, questionData) => http.put(`/problem/edit/${problemId}`, questionData);
// 5. 删除题目*
export const deleteQuestion = (problemId) => http.delete(`/problem/delete/${problemId}`);

// 6. 获取单个题目的评测用例信息*
export const getQuestionCaseInfo = (problemId) => http.get(`/testcase/get/${problemId}`);
// 7. 增加评测用例*
export const addQuestionCase = (problemId, newCase) => http.post(`/testcase/add/${problemId}`, newCase);
// 8. 删除评测用例*
export const deleteQuestionCase = (caseId) => http.delete(`/testcase/delete/${caseId}`);
// 9. 编辑评测用例*
export const editTestCases = (caseId, testCaseData) => http.put(`/testcase/edit/${caseId}`,testCaseData);

// 10. 收藏题目
export const star = (problemId) => http.post(`/problem/favorite-problem/${problemId}`);
// 11. 取消收藏题目
export const cancelStar = (problemId) => http.delete(`/problem/favorite-problem/${problemId}`);
// 12. 检测是否收藏
export const getIsStar = (problemId) => http.get(`/problem/checkFavorite/${problemId}`);
// 13.排序&搜索 前端实现

/*用户管理功能 API*/

//普通管理权限
// 1. 获取用户列表*
export const getUserList = () => http.get('/user/users');
// 2. 解锁用户1*
export const unlockUserApi = (username) => http.post(`/user/unlock/${username}`);

//系统管理权限
// 2. 解锁用户2*
export const unlockAllUserApi = (username) => http.post(`/sysAdmin/unlock/${username}`);
// 3. 系统管理员登录*
export const SysLogin = (dataForm) => http.post('/sysAdmin/login',dataForm);
// 4. 删除用户* （不能删除管理员）
export const deleteUser = (username) => http.delete(`/user/delete/${username}`);
// 5. 新增管理员用户*
export const addAdminUser = (newAdmin) => http.post('/sysAdmin/add-admin', newAdmin);


/*记录管理*/

//todo 用户自己 只返回题号？不行吧
//1.获取用户收藏题目*
export const fetchFavoriteProblems = () => http.get(`/problem/getFavorite`);
//2.获取用户已通过题目*
export const fetchPassedProblems = (username) => http.get(`/problem/passed-problems/${username}`);

//管理员

//1.获取用户记录*
export const fetchUserRecord=(username) => http.get(`/submission/user-records/${username}`);
//2.获取题目记录*
export const fetchProblemRecord = (problemId) => http.get(`/submission/problem-records/${problemId}`);

//系统管理员

//1.获取日志*
export const fetchSystemLogs = () => http.get(`/sysAdmin/logs`);

/*//2.系统查询在线者详情 /statistics/online-users    不要了
export const fetchOnline = () => http.get(`/statistics/online-users`);*/

//3.系统内的提交数量数据*
export const fetchSubmissionStats = () => http.get(`/statistics/submission-stats`);

//4.查询系统数据*
export const fetchSystemOverview = () => http.get(`/statistics/overview`);
