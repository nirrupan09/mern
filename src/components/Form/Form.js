import React, {useEffect, useState} from  'react';
import {TextField, Button , Typography, Paper} from '@material-ui/core';
import FileBase from  'react-file-base64';
import useStyles from './styles'
import {useDispatch, useSelector} from 'react-redux';
import {createPost, updatePost} from '../../actions/posts'


const Form = ({currentId, setCurrentId}) => {
    const [postData, setPostData] = useState({
         tittle:'', message:'', tags:'', selectedFile:''
    });
    const post = useSelector((state) => currentId ? state.posts.find((p) => p._id === currentId) : null);
    const classes = useStyles()
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));

    useEffect(() => {
       if(post) setPostData(post);
    }, [post])


    const handleSubmit = (e) => {
        e.preventDefault();

        if(currentId === 0) {
            dispatch(createPost({...postData,name:user?.result?.name}));
            clear();
        } else {
            dispatch(updatePost(currentId,{...postData,name:user?.result?.name}));
            clear();
        }
    };

    if(!user ?.result?.name){
        return(
            <Paper className={classes.paper}>
                <Typography variant="h6" align="center">
                Please Sign In to create your own memories and like other's memories.
                </Typography>

            </Paper>
        )
    }

    const clear = () => {
        setCurrentId(null);
        setPostData({  tittle:'', message:'', tags:'', selectedFile:'' });       
    };

    return (
       <Paper className={classes.paper}>
           <form autoComplete="off" noValidate className={`${classes.root} ${classes.form} `} onSubmit={handleSubmit}> 
            <Typography variant="h6" >{ currentId?  'Editing': 'creating'} memories</Typography>
           
            <TextField  name="tittle" variant="outlined" label="Tittle" fullWidth value={postData.tittle}  onChange={(e) => setPostData({...postData, tittle: e.target.value})}/>
            <TextField  name="message" variant="outlined" label="message" fullWidth value={postData.message}  onChange={(e) => setPostData({...postData, message: e.target.value}) }/>
            <TextField  name="tags" variant="outlined" label="tags" fullWidth value={postData.tags}  onChange={(e) => setPostData({...postData, tags: e.target.value.split(', ')})}/>
            <div className={classes.fileInput}>
                <FileBase 
                type="file"
                multiple={false}
                onDone={({base64}) => setPostData({...postData, selectedFile:base64})}
             />
            </div>
            <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth> submit </Button>
            <Button variant="contained" color="secondary" size="small" type="submit" onClick={clear} fullWidth> clear </Button>
            
           
           </form>
       </Paper>
    )
}

export default Form ;