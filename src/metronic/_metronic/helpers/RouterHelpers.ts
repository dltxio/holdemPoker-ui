export function getCurrentUrl(pathname: string) {
  return pathname.split(/[?#]/)[0];
}

export function checkIsActive(pathname: string, url: string) {
  let current = getCurrentUrl(pathname);
  current = current.replace('/', '');
  
  if (!current || !url) {
    return false;
  }

  if (current === url) {
    return true;
  }

  if (current.indexOf(url) > -1) {
    return true;
  }

  return false;
}

export function checkIsIncluded(pathname: string, arrUrls: string[]) {
  let current = getCurrentUrl(pathname);
  current = current.replace('/', '');

  if (!current) {
    return false;
  }

  if (arrUrls && arrUrls.length && arrUrls.indexOf(current) > -1) {
    return true;
  }

  return false;
}