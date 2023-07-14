import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Modal, Image } from 'react-native';
import {Camera} from 'expo-camera';
import {FontAwesome} from "@expo/vector-icons";

export default function App() {

  const camRef = useRef(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [hasPermission, setHasPermission] = useState(null)
  const [capturedPhoto, setCapturedPhoto] = useState(null)
  const [open, setOpen] = useState(false)

  useEffect (() =>{
      (async () => {
        const {status} = await Camera.requestCameraPermissionsAsync()
        setHasPermission(status === 'granted')
      }) ();
  }, [])

  if(hasPermission == null) {
    return <View/>
  }

  if (hasPermission == false) {
    return <Text>Acesso negado</Text>
  }

  async function takePicture(){
    if (camRef){
    const data = await camRef.current.takePictureAsync();
    setCapturedPhoto(data.uri)
    setOpen(true)
  }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={camRef}
        >
          <View style={styles.contentButtons}>
          <TouchableOpacity style={styles.buttonFlip}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back  
              ? Camera.Constants.Type.front 
              : Camera.Constants.Type.back 
            )
          }}
          >
            <FontAwesome name='exchange' size={40} color='black'></FontAwesome>
          </TouchableOpacity>
          <TouchableOpacity 
          style={styles.buttonCamera}
          onPress={takePicture}
          >
            <FontAwesome name='camera' size={23} color='#fff'></FontAwesome>
          </TouchableOpacity>
          </View>
      </Camera>
      {capturedPhoto &&
      <Modal
      animationType='slide'
      transparent={true}
      visible={open}
      >
        <TouchableOpacity style={styles.closeButton}
        onPress={() => {setOpen(false)}}
        >
          <FontAwesome name="close" size={60} left={12} color='#fff'>

          </FontAwesome>
        </TouchableOpacity>
        <View style={styles.contentModal}>
          <Image style={styles.imgPhoto} source={{ uri : capturedPhoto}}>

          </Image>
        </View>
      </Modal> }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },  
  camera: {
    width: "100%",
    height: "100%"
  },
  contentButtons: {
    flex: 1,
    backgroundColor: "transparente",
    flexDirection: "row"
  },
  buttonFlip: {
    position: "absolute",
    bottom: 50,
    left: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    width: 100,
    borderRadius: 50 
  },
  buttonCamera: {
    position: "absolute",
    bottom: 45 ,
    right: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    margin: 20,
    width: 100,
    height: 50,
    borderRadius: 50 
  }, 
  contentModal: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'flex-end',
    margin: 20
  },
  closeButton: {
    position: "absolute",
    top: 10,
    left: 2,
    margin: 10
  },
  imgPhoto: {
    width: '100%',
    height: '65%',
  }
});
