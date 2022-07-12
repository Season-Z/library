/**
 * 表单保存状态
 */
export const FormStatusMap = new Map([
  [true, ['success', '表单内容已保存成功']],
  [false, ['error', '表单内容保存失败']],
  [undefined, ['warning', '表单内容还没有保存']],
]);
