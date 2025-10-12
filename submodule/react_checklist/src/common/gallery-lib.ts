import { GalleryFile } from '../utils/gallery';

import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import InterestsIcon from '@mui/icons-material/Interests';
import TwitterIcon from '@mui/icons-material/Twitter';
import YoutubeIcon from '@mui/icons-material/YouTube';

import { TikTokIcon_2 } from './icons';

export const VIDEO_FILES = [
    'mp4',
    'mov',
    'wmv',
    'avi',
    'avchd',
    'flv',
    'f4v',
    'swf',
    'mkv',
    'webm',
    'html5',
  ]

export type GalleryController = {
    addImage?(fileid: string, filename?: string): Promise<any>
    addEmbed?(embedCode: string, descriptor: string): Promise<any>
    deleteImage?(fileid: string): Promise<any>
    setAvatar?(fileid: string): Promise<any>
    setBanner?(fileid: string): Promise<any>
    setBackground?(fileid: string): Promise<any>
    setEdit?(oldfileid: string, newfileid: string): Promise<any>
    importGallery?: Record<string, GalleryFile[]>
  }

export function getEmbedSourceIcon(embedSource: string) {
    if (embedSource == 'facebook') return FacebookIcon
    if (embedSource == 'instagram') return InstagramIcon
    if (embedSource == 'youtube') return YoutubeIcon
    if (embedSource == 'tiktok') return TikTokIcon_2
    if (embedSource == 'twitter') return TwitterIcon
    return InterestsIcon
  }


export type ThumbnailsProps = {
    images?: GalleryFile[] | null
    setMainImage: (ix: number) => void
    index: number
    controller?: GalleryController
    size?: number
  }