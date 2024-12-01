import React from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { addPath } from "../redux/slices/fileSlice";
import { useDispatch } from "react-redux";

export default function FolderOrFile({ item, route }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {dir} = route.params;
  
  const generateIconName = (extension) => {
    switch (extension) {
      case ".pdf":
        return "file-pdf-o";
      case ".jpeg":
      case ".jpg":
      case ".png":
        return "file-picture-o";
      case ".docs":
        return "file-word-o";
      case ".ppt":
      case ".pptx":
        return "file-powerpoint-o";
      case ".txt":
        return "file-text-o";
      case ".zip":
        return "file-zip-o";
      case ".mp4":
        return "file-video-o";
      default:
        return "folder";
    }
  };

  const folderNavigation = (isDirectory, dirName) => {
    if (isDirectory) {
      dispatch(addPath(dirName)) +
        navigation.push("home", {
          title: dirName,
          dir:[...dir,dirName]
        });
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* {[".jpg", ".jpeg", ".png"].includes(item.extension) && item.url ? (
        <Image
          source={{ uri: item.url }} // Correctly use item.url for Image source
          style={styles.image}
          resizeMode='contain' // Prevents image stretching
        />
      ) : (
      )} */}
        <Pressable
          onPress={() => {
            folderNavigation(item.isDirectory, item.name);
          }}
        >
          <FontAwesome
            name={generateIconName(item.extension)}
            size={100}
            color='#00b2ff'
          />
        </Pressable>

      <View style={styles.container}>
        <Text
          style={styles.text}
          ellipsizeMode='tail'
          numberOfLines={1}
        >
          {item.name}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    margin: 10,
  },
  container: {
    flex: 1,
    maxWidth: 100,
    overflow: "hidden",
  },
  text: {
    flexShrink: 1,
    fontSize: 14,
    color: "#000",
    textAlign: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});
