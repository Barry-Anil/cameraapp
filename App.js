import { StyleSheet, Text, View, Image } from 'react-native';
import {Camera, CameraType} from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useRef, useState } from 'react';
import Button from './src/components/Button';

export default function App() {

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  // const [type, setType] = useState(CameraType.back);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef  = useRef(null);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === 'granted');
    })();
  },[])

  const takePicture = async () => {
    if(cameraRef){
      try{
        const data = await cameraRef.current.takePictureAsync();
      setImage(data.uri);
      }
      catch(e){
        console.log(e)
      }
    }
  }

  const saveImage = async () => {
    if(image){
      try {
        await MediaLibrary.createAssetAsync(image);
        alert('Picture Saved!')
        setImage(null)
      } catch (error) {
        console.log(error)
      }
    }
  }

  if(hasCameraPermission === false){
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!image ? 
      <Camera
        style={styles.camera}
        type={type}
        flashMode={flash}
        ref={cameraRef}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 30,
          }}>
            <Button icon={'retweet'} onPress={() => {
              setType(type === CameraType.back ? CameraType.front : CameraType.back)
            }} />
            <Button icon={'flash'} onPress={() => {
              setFlash(flash === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off)
            }}
            color={flash === Camera.Constants.FlashMode.on ? 'gray' : '#f1f1f1'}
            />
          </View>
        </Camera>
        : <Image source={{uri: image}} style={styles.camera}/>
  }
        <View>
          {image ? 
          <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 50,
            }}>
            <Button title={'Re-Take'} icon="retweet" onPress={() => setImage(null)} />
            <Button title={'Save'} icon="check" onPress={saveImage} />
          </View> 
          :   
          <Button title={'Take a Picture'} icon='camera' onPress={takePicture}/>
        }
          
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  camera: {
    flex: 1,
    borderRadius: 20,

  }
});
