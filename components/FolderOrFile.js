import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
export default function FolderOrFile({ item }) {
  const generateIconName = (extension) => {
    switch (extension) {
      case ".pdf":
        return "file-pdf-o";
      case ".jpeg":
        return "file-picture-o";
      case ".jpg":
        return "file-picture-o";
      case ".png":
        return "file-picture-o";
      case ".docs":
        return "file-word-o";
      case ".ppt":
        return "file-powerpoint-o";
      case ".txt":
        return "file-text-o";
      case ".zip":
        return "file-zip-o";
      default:
        return "folder";
    }
  };
  return (
    <View>
      <FontAwesome
        name={generateIconName(item.extension)}
        size={100}
        color={"#00b2ff"}
      />
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
  container: {
    flex: 1, // Ensures the container takes up available space
    maxWidth: 100, // Constrain the width to fit your layout
    overflow: "hidden", // Prevent children from overflowing
    // backgroundColor:"#000",
  },
  text: {
    flexShrink: 1, // Ensures text shrinks to avoid overflow
    fontSize: 14,
    color: "#000",
  },
});
