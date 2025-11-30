import React from 'react'
import { common } from '../../utils/common';

export default function ShowThumb({src, alt, width, height, style}) {
    src = src || common.defaultImageUrl;
    alt = alt || 'Thumbnail';
    width = width || 100;
    height = height || 100;
    style = style || { objectFit: 'cover', borderRadius: '8px' };
  return (
   <>
    <img src={src} alt={alt} width={width} height={height} style={style} />
   </>
  )
}
