import { Text, View, StyleSheet, TouchableOpacity, Image, Button } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState, useRef } from 'react';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from 'expo-router';

const Home = () => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const router = useNavigation();

  // 1. Rugsatlary barlaň
  if (!permission) {
    return <View >
      <Text style={{ color: 'red' }}>Rugsat ýok</Text>
    </View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', color: "white" }}>Kamerany ulanmak üçin rugsat gerek.</Text>
        <Button onPress={requestPermission} title="Rugsat Ber" />
      </View>
    );
  }
  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      setPhoto(data.uri);
    }
  };

  // Kamerany öňe/yza öwürmek
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.navigate('index')}
      style={{ position: "absolute",zIndex:2,top:40,left:20 }}>
        <FontAwesome name="arrow-circle-left" size={30} color="white" />
      </TouchableOpacity>
      {photo ? (
        // Surat düşürilen bolsa, şony görkezýäris
        <View style={styles.containerImage}>
          <Image source={{ uri: photo }} style={styles.camera} />
          <Button title="Täzeden düşür" onPress={() => setPhoto(null)} />
        </View>
      ) : (
        // Kamera ekrany
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <View style={{flexDirection:"row",width:"100%",alignItems: 'center',justifyContent:"space-between"}}>
              <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                <FontAwesome6 style={styles.replaceButton} name="repeat" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.snapButton} onPress={takePicture}>
                <View style={styles.innerSnapButton} />
              </TouchableOpacity>
            </View>

          </View>
        </CameraView>
      )}
    </View>
  )
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative'
  },
  containerImage:{
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    width: "70%",
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "flex-end",
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    
  },
  snapButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerSnapButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  replaceButton: {

  },
});