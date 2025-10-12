import Image from 'next/image';
import { createElement as h, useEffect, useRef } from 'react';
import { getEmbedSourceIcon, ThumbnailsProps, VIDEO_FILES } from '../common/gallery-lib';
import { Gallery } from '../common/types';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, ButtonBase } from '@mui/material';

import styles from './slide-show.module.css';

export type GalleryFile = Gallery['files'][number]



export function MiniThumbnails({
    images,
    setMainImage,
    index,
    size,
  }: ThumbnailsProps) {
    const cref = useRef(null)
    size ??= 50;
  
    useEffect(() => {
      const cont = cref.current
      if (!cont) return
      const scrollWidth = cont.scrollWidth - cont.clientWidth
      const scrollDx = scrollWidth / ((images?.length - 1))
      // console.log(cont)
      cont.scrollLeft = scrollDx * index
    }, [index])
  
  
  
    function renderThumbnail(img: GalleryFile, ix: number) {
      const imageURL = '/api/f/' + img.id + '?size=avatar-sm'
      const isVideo = VIDEO_FILES.findIndex((vv) =>
        img.name.toLocaleLowerCase().endsWith(vv),
      )
      const isEmbed = Boolean(img.data?.embeds)
      const embedSource = isEmbed ? img.name.split('-')[0] : ''
      const embedIcon =
        embedSource == 'youtube' ? (
          <img
            key={img.id}
            height="50"
            width="50"
            src={`https://img.youtube.com/vi/${img.data?.embeds?.match(
              /\/([\w-]+)\?/,
            )?.[1]}/0.jpg`}
            onClick={() => setMainImage(ix)}
            data-active={index === ix ? 'active' : ''}
          />
        ) : (
          h(getEmbedSourceIcon(embedSource), null)
        )
  
      return isVideo !== -1 ? (
        <img
          alt="Thumbnail"
          // placeholder="blur"
          key={img.id}
          height={size}
          width={size}
          src={'/images/video.png'}
          onClick={() => setMainImage(ix)}
          data-active={index === ix ? 'active' : ''}
        />
      ) : isEmbed ? (
        <ButtonBase
          key={img.id}
          sx={{
            width: `${size}px`,
            height: `${size}px`,
          }}
          onClick={() => setMainImage(ix)}
          data-active={index === ix ? 'active' : ''}
        >
          {embedIcon}
        </ButtonBase>
      ) : (
        <img
          alt={img.name}
          key={img.id}
          height={size}
          width={size}
          src={'/api/f/' + img.id + '?size=avatar-sm'}
          onClick={() => setMainImage(ix)}
          data-active={index === ix ? 'active' : ''}
        />
      )
    }
  
    return (
      <div ref={cref} className={styles.thumbnails_scroll}>
        <div className={styles.thumbnails}>{images.map(renderThumbnail)}</div>
      </div>
    )
  }