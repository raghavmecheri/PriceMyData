import React from 'react';
import FileDrop from 'react-file-drop';

class DropzoneWithoutClick extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fileSet: false
        }
    }
    handleDrop = (files, event) => {
        if(files.length == 1) {
            this.setState(
                {
                    file:files[0],
                    fileSet: true
                }
            )
        } else {
            alert("Please upload only a single file")
        }
      console.log(files);
    }
  
    render() {
        let {file, fileSet} = this.state;
        let fileData = (
            <FileDrop onDrop={this.handleDrop}>
                Please drag your .zip file here
            </FileDrop>
        );
        if(fileSet) {
            fileData = (
                <FileDrop onDrop={this.handleDrop}>
                    {file.name}
                </FileDrop>
            );
        }
      return (
        <div className="uploadContainer">
            {fileData}
        </div>
      );
    }
  }
  
  export default DropzoneWithoutClick;