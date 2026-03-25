import { Text, View, StyleSheet, TouchableOpacity, StatusBar, TextInput, FlatList, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
// icons
import Feather from '@expo/vector-icons/Feather';
import Foundation from '@expo/vector-icons/Foundation';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useState } from 'react';

import { Directory, Paths, type File } from 'expo-file-system';
import { useNavigation } from 'expo-router';

const { width } = Dimensions.get('window');

const Home = () => {
  const [assets, setAssets] = useState<File[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<File[]>([]);
  const router = useNavigation()

  useEffect(() => {
    try {
      getImages(new Directory(Paths.cache));
    } catch (error) {
      console.error(error);
    }
  }, [])

  function getImages(directory: Directory) {
    const contents = directory.list();
    for (const item of contents) {
      if (item instanceof Directory) {
        getImages(item);
      } else if (item.type === 'image/jpeg') {
        setAssets(state => [...state, item]);
        setFilteredFiles(state => [...state, item]);
      }
    }
  }

  const openCamera = () => {
    router.navigate('camera');
  }
  const openGallery = () => {

  }
  const FilterImage = (text: string) => {
    if (text) {
      const filtered = assets.filter(image => image.name.includes(text));
      console.log(filtered.length)
      setFilteredFiles(filtered);
    }
  }
  const RenderImage = ({ file }: { file: File }) => {
    return (
      <ImageBackground style={styles.imageItem} source={{ uri: file.uri }}>
        <View style={styles.imageItemTexts}>
          <Text style={styles.imageName} numberOfLines={1}>{file.name}</Text>
          <Text style={styles.imageSize}>{file.size % (1e6)}</Text>
        </View>
      </ImageBackground>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"light-content"} />
      <LinearGradient
        colors={['#CDE6EB', 'white']}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={styles.linearGradient}
      >
        <Feather name="search" size={24} color="black" />
        <TextInput onChangeText={FilterImage} placeholder='Search photo' style={styles.searchInput} />
        <View style={styles.searchIcons}>
          <TouchableOpacity onPress={openCamera} style={styles.openItem}>
            <Entypo name="camera" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={openGallery} style={styles.openItem}>
            <Foundation name="photo" size={24} color="black" />
          </TouchableOpacity>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
        </View>
      </LinearGradient>
      <FlatList
        scrollToOverflowEnabled={false}
        keyExtractor={(item, index) => String(index) + '-' + item.name}
        data={filteredFiles}
        renderItem={({ item }) => <RenderImage file={item} />}
        numColumns={2}
        columnWrapperStyle={{ gap:5 }}
        contentContainerStyle={{gap:5 }}
      />
    </SafeAreaView>
  )
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  linearGradient: {
    height: 60,
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingBlock: 10,
    paddingInline: 15,
    borderRadius: 40
  },
  searchInput: {
    fontSize: 20,
    height: 60,
    alignItems: 'center',
    width: 180,
    color: "black"
  },
  searchIcons: {
    flexDirection: "row",
    gap: 16,
    paddingStart: 10,
  },
  openItem: {

  },
  imageItem: {
    width: width / 2 ,
    height: width / 2,
    justifyContent: "flex-end",
  },
  imageItemTexts: {
    gap: 10,
    paddingLeft: 10,
    paddingBottom: 10
  },
  imageName: {
    color: 'white',
  },
  imageSize: {
    color: "#696969",
    fontWeight: 700,
    fontSize: 18,
  },
});