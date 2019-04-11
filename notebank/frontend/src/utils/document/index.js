
export const scaleToFitWithin = (targetSize, sourceSize) => {
  const size = {};
  if (sourceSize.width > sourceSize.height) {
    size.width = targetSize.width;
    size.height = Math.trunc(targetSize.width * sourceSize.height / sourceSize.width);
  } else {
    size.height = targetSize.height;
    size.width = Math.trunc(targetSize.height * sourceSize.width / sourceSize.height);
  }
  return size;
};