import { createTheme, darken, lighten, responsiveFontSizes } from '@mui/material';
import { orange } from '@mui/material/colors';

const secondary = `#0066b2`
const success = `#43a047`;
const lightSecondary = lighten(secondary, 0.75)
const lightSuccess = lighten(success, 0.5)

export const maneyTheme = responsiveFontSizes(
    createTheme({
      palette: {
        mode: 'light',
        background: {
          default: '#ffffff',
        },
  
        primary: {
          main: orange[800],
          light: lighten(orange[800], 0.75),
          dark: darken(orange[800], 0.75),
          contrastText: '#ffffff',
        },
        secondary: {
          main: secondary,
          light: lightSecondary,
          dark: darken(secondary, 0.25),
        },
        success: {
          main: success,
          light: lightSuccess,
          dark: darken(success, 0.25),
        },
        warning: {
          light: 'rgba(255, 213, 79, 0.5)', // Light warning color
          main: '#FFCA28', // Main warning color
          dark: '#FFA000', // Dark warning color
        },
      },
      typography: {
        fontFamily: 'Urbanist, Arial, sans-serif',
        h1: { fontSize: ' 2.125rem', fontWeight: 700, lineHeight: 1.1 },
        h2: { fontSize: '1.875rem', fontWeight: 700, lineHeight: 1.2 },
        h3: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.2 },
        h4: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
        h5: { fontSize: '1.125rem', fontWeight: 500, lineHeight: 1.5 },
        h6: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.5 },
        subtitle1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 },
        subtitle2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.6 },
        body1: { fontSize: '1rem', fontWeight: 550, lineHeight: 1.6 },
        body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.6 },
        button: { fontSize: '0.875rem', fontWeight: 500 },
        caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.5 },
        overline: {
          fontSize: '0.75rem',
          fontWeight: 400,
          letterSpacing: '1px',
          textTransform: 'uppercase',
        },
      },
      components: {
       MuiChip: {
        styleOverrides: {
          label: {
            fontSize: 14
          },
          icon:{
            fontSize: 20
          }
        }
       },
        
        MuiListItemIcon: {
          styleOverrides: {
            root: {
              minWidth: '40px',
            },
          },
        },
        MuiInputBase: {
          styleOverrides: {
            root: {
              backgroundColor: 'white',
            },
          },
        },
        MuiToggleButton: {
          styleOverrides: {
            root: {
              maxHeight: "32px",
              alignSelf:'center',
              '&.Mui-selected': {
                fontWeight: 'bold',
                backgroundColor: lightSecondary,
              },
              '&.Mui-selected:hover': {
                fontWeight: 'bold',
                backgroundColor: lightSecondary,
              },
              '&:hover': {
                backgroundColor: 'transparent',
              },
            },
          },
        },
        MuiMenuItem: {
          styleOverrides: {
            root: {
              paddingTop: '8px',
              paddingBottom: '8px',
            },
          },
        },
        MuiListItemButton: {
          styleOverrides: {
            root: {
              '&:hover': { backgroundColor: 'rgba(255,171,63,0.5)' },
              '&.Mui-selected': { backgroundColor: 'rgba(255,171,63,0.75)' },
              '&.Mui-selected:hover': {
                backgroundColor: 'rgba(255,171,63,0.75)',
              },
            },
          },
        },
        MuiAvatar: {
          styleOverrides: {
            rounded: {
              borderRadius: '8%',
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            head: {
              fontWeight: 700,
            },
          },
        },
        MuiPaper: {
        variants: [
          { props: { elevation: 0 }, style: { '--Paper-overlay': 'none'} },
        ]
      },
        MuiTooltip: {
          defaultProps: {
            style: { fontSize: 18 },
            enterTouchDelay: 0,
          },
        },
  
        MuiAlert: {
          styleOverrides: {
            root: {
              color: 'black',
            },
            message: {},
          },
        },
  
        MuiSwitch: {
          styleOverrides: {
            root: {
              padding: 8,
            },
            track: {
              borderRadius: 22 / 2,
              '&::before, &::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 16,
                height: 16,
              },
              '&::before': {
                left: 12,
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="white" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`, // Checkmark icon
              },
              '&::after': {
                right: 12,
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="white" d="M19,13H5V11H19V13Z" /></svg>')`, // Minus icon
              },
            },
            thumb: {
              boxShadow: 'none',
              width: 16,
              height: 16,
              margin: 2,
            },
          },
        },
      },
    }),
  )