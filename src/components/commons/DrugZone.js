import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  drugHeader: {
    padding: '0 0 15px 0',
    lineHeight: 'unset'
  },
  drugIcon: {
    width: '30px',
    height: '30px'
  },
  drugItem: {
    paddingTop: 0,
    paddingLeft: 0
  },
  drugZone: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  },
  drugFileList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  drugFileListTitle: {
    margin: '5px 0',
    display: 'block',
    textAlign: 'right'
  },
  drugFileListItem: {
    display: 'flex',
    alignItems: 'center'
  },
  drugFileListItemIcon: {
    marginLeft: '15px',
    cursor: 'pointer'
  }
}));

const DrugZone = ({ files, setFiles }) => {
  const classes = useStyles();

  const onDrop = useCallback(
    acceptedFiles => {
      setFiles([...files, ...acceptedFiles]);
    },
    [files, setFiles]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop
  });

  const remove = file => () => {
    const newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles);
  };

  return (
    <>
      <div {...getRootProps({ className: classes.drugZone })}>
        <input {...getInputProps()} />
        <p>Trascina qui i files o clicca per selezionarli</p>
      </div>

      {files.length ? (
        <>
          <b className={classes.drugFileListTitle}>{`${
            files.length
          } file(s) selezionato(i)`}</b>
          <ul className={classes.drugFileList}>
            {files.map(file => (
              <li key={file.path} className={classes.drugFileListItem}>
                {file.path}{' '}
                <i
                  className={clsx(
                    classes.drugFileListItemIcon,
                    'material-icons'
                  )}
                  onClick={remove(file)}
                >
                  cancel
                </i>
              </li>
            ))}
          </ul>
        </>
      ) : (
        false
      )}
    </>
  );
};

DrugZone.propTypes = {
  files: PropTypes.array.isRequired,
  setFiles: PropTypes.func.isRequired
};

export default DrugZone;
