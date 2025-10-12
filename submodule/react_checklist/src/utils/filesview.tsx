import Image from 'next/image';
import { BootstrapDialogTitle } from '../common/bootstrap-dialog-title';
import { ToggleView } from '../common/misc';

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Box, ButtonBase, Dialog, DialogContent, Stack, Typography } from '@mui/material';

import { MiniThumbnails } from './gallery';

export type M4File = {
  id: string
  filename?: string | null
  name?: string | null
  tags?: []
  uts?: string
}

function isImageOrVideo(filename) {
  if (!filename) return
  var regex =
    /\.(mp4|mov|avi|wmv|flv|mkv|png|gif|tiff|webm|jpg|jpeg|png|gif|bmp)$/i
  var ex = filename.split('.').pop()
  return regex.test(`.${ex}`)
}

function isAudio(filename) {
  if (!filename) return
  var audioTypeRegex = /^audio\/(mp3|wav|ogg|aac|flac|wma|fav)$/
  var extension = filename.split('.').pop()
  return audioTypeRegex.test('audio/' + extension)
}

function SquareAudioPlayer({ src, name }: { src: string; name: string }) {
  const ex = name.split('.').pop()
  return (
    <div className="audio-player">
      <audio controls>
        <source src={src} type={`audio/${ex}`} />
        Your browser does not support the audio element.
      </audio>
      <div className="controls">
        <button onClick={() => document.querySelector('audio').play()}>
          Play
        </button>
        <button onClick={() => document.querySelector('audio').pause()}>
          Pause
        </button>
      </div>
    </div>
  )
}

export function MediaFilesView({ files }: { files: M4File[] }) {
    if (!files?.length) return
  
    return (
      <Stack gap={2} direction={'row'}>
  
  
          {
            files?.map(f => {
              if (!f?.id) return
              const name = (f.filename || f.name)?.toString();
              if (name?.endsWith('pdf')) {
  
                return <ButtonBase sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 1, textAlign: 'center', flexDirection: 'column', display: 'flex', backgroundColor: '#f9f9f9', width: 100, height: 100
                }} download={'pdf'} target="_blank" href={`/api/f/${f.id}`} >
                  <PictureAsPdfIcon color='error' fontSize={'large'} />
                  <Typography py={1} fontSize={10} variant='subtitle2'>{name}</Typography>
                </ButtonBase>
  
              }
              else if (isImageOrVideo(name)) {
              
                return (<ToggleView>
                  {(open, toggleOpen) => (
                    <>
                      <ButtonBase onClick={toggleOpen}>
                        <MiniThumbnails size={80} images={[{ id: f.id, name: f.name, uts: f.uts, type: 0, seq: 0 }]} setMainImage={() => { }} index={0} />
                      </ButtonBase>
                      <Dialog
                        open={open}
                        onClose={toggleOpen}
                        fullWidth
                        maxWidth="md"
                      >
                        <BootstrapDialogTitle onClose={toggleOpen}>{f.name || 'Image'}</BootstrapDialogTitle>
                        <DialogContent >
                          <img
                            alt={f.name || f.filename}
                            key={f.id}
                            width={600}
                            height={600}
                            src={`/api/f/${f.id}`}
                            data-active={'active'}
                          />
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                </ToggleView>)
  
  
              }
              else if (isAudio(name)) {
                return <SquareAudioPlayer name={name} src={`/api/f/${f?.['id']}`} />
              }
  
              return <ButtonBase sx={{ padding: 1, paddingX: 2, borderRadius: '4px', backgroundColor:'lightgrey' }} href={`/api/f/${f.id}`}>
                <FileDownloadOutlinedIcon sx={{color:'blue'}} />
              </ButtonBase>
  
            })
          }
  
        
      </Stack>
    )
  }