export const tableStyles = {
    container: {
      borderRadius: '5px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
      border: '1px solid #e0e0e0',    
    },
    head: {
      backgroundColor: '#336FB0',
      textAlign: 'center',
    },
    headerCell: {
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#F2F2F2',
    },
    cell: {
      textAlign: 'center',
      color: '#333333',
    },
    actionButton: {
      width: '100px',
      textTransform: 'none',
      background: '#336FB0',
      '&:hover': {
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        backgroundColor: '#336FB0',
      },
    },
    deleteButton: {
      textTransform: 'none',
      width: '50px',
      ml: 1,
      color: '#ED262A',
    },
    acceptButton: {
      textTransform: 'none',
      width: '100px',
      mr: 1,
      background: '#22bb33',
      '&:hover': {
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        backgroundColor: '#22bb33',
      },
    },
    rejectButton: {
      textTransform: 'none',
      width: '50px',
      color: '#bb2124',
    },
    typography: {
      variant: 'subtitle1',
      fontWeight: 'bold',
      color: '#F2F2F2',
    },
  };
  