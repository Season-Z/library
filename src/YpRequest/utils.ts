import $cookie from 'js-cookie';
import store from 'store2';
export function getUrl() {
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser) {
    return location.href;
  }
  return '';
}
export function jumpUrl(url: string) {
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser) {
    location.href = url;
  }
}
function S4() {
  // tslint:disable-next-line:no-bitwise
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
// Generate a pseudo-GUID by concatenating random hexadecimal.
export function guid() {
  return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4() + S4() + S4()}`;
}
export function setLocalData(key: string, value: any) {
  const urlVal = getUrl();
  let env = '';
  const localEnv = store.get('env') || '';
  if (localEnv) {
    env = localEnv;
  } else {
    env = $cookie.get('env') || 'prod';
  }
  let domain = '.ypshengxian.com';

  if (env && env !== 'prod') {
    domain = '.ypsx-internal.com';
  }
  if (urlVal.includes('localhost')) {
    //本地环境的在cookie和localstorage都存一份
    $cookie.set(key, value);
    store.set(key, value);
  } else {
    $cookie.set(key, value, {
      domain,
      path: '/',
      expires: 30,
    });
  }
}
export function getLocalData(key: string) {
  const value = store.get(key) || '';
  if (getUrl().includes('localhost')) {
    if (value) {
      return value;
    } else {
      return $cookie.get(key);
    }
  } else {
    return $cookie.get(key);
  }
}
