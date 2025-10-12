import { ComponentProps, ReactElement } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { Box, DialogTitle, IconButton, Stack, useTheme } from '@mui/material';

type DialogTitleProps = ComponentProps<typeof DialogTitle> & {
  fullwidth?: boolean
  onClose?: (...args: any[]) => void
  toggleWidth?: (...args: any[]) => void
  CustomClose?: ReactElement<any>
}

export function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, CustomClose, toggleWidth, fullwidth, ...other } =
    props

  const theme = useTheme()

  return (
    <DialogTitle
      sx={{
        position: 'sticky',
        top: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 1,
        backgroundColor: theme.palette.grey[100],
        zIndex: 1,
        borderBottom: `0.5px solid ${theme.palette.grey[200]}`,
        pr: 2,
        marginBottom: '10px'
      }}
      {...other}
    >
      
      {children}
      <Box flexGrow={1}></Box>
      {Boolean(toggleWidth) && (
        <IconButton
          aria-label="expand"
          onClick={toggleWidth}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          {fullwidth ? (
            <CloseFullscreenIcon sx={{ fontSize: 20 }} />
          ) : (
            <OpenInFullIcon sx={{ fontSize: 20 }} />
          )}
        </IconButton>
      )}

      {CustomClose ||
        (onClose && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ))}
    </DialogTitle>
  )
}
