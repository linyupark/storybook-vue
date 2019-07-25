/**
 * 获取变量类型
 */
export default function(mixed) {
  const match = toString.call(mixed).match(/^\[object (\w+)\]$/);
  if (!match) return 'unkonw';
  return match[1].toLowerCase();
}
