import {useEffect} from "react";
import {Button} from "@material-ui/core";
// import UploadFileIcon from '@material-ui/icons/UploadFile';
import CloudUploadOutlined from '@material-ui/icons/CloudUploadOutlined';
import * as React from "react";

const UploadFile = (props) => {

    const {
        setData 
    } = props
    
    useEffect(() => {
        document
            .getElementById('upload_csv')
            .addEventListener('change', onFileSelect)
    }, [])

    const onFileSelect = () => {
        const uploadedFile = document.querySelector('input[type="file"]').files[0]
        const fileReader = new FileReader()
        fileReader.readAsText(uploadedFile)
        fileReader.onload = e => setData(e.target.result)
    }
    
    return <>
        <Button variant="outlined" startIcon={<CloudUploadOutlined />} component="label">Upload csv
            <input
                id="upload_csv"
                type="file"
                hidden
            />
        </Button>
    </>
}

export default UploadFile