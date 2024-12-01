import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Button,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FolderOrFile from "../components/FolderOrFile";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as DocumentPicker from "expo-document-picker";
import Modal from "react-native-modal";
import { uploadingFoldersAndFiles } from "../redux/slices/fileSlice";
import { useIsFocused } from "@react-navigation/native";

export default function Home({ route }) {
  const { dir, title } = route.params;

  const dispatch = useDispatch();
  const [pullRefresh, setPullRefresh] = useState(false);
  const {
    foldersAndFiles,
    isGettingFoldersAndFiles,
    uploadProgress,
    isUploadFoldersAndFiles,
    isGettingFoldersAndFilesFailed,
    errorMessage,
  } = useSelector((state) => state.fileSlice);
  const isFocused = useIsFocused();
  const path = dir.join("/");

  useEffect(() => {
    if (isFocused) dispatch({ type: "GET_FOLDER_AND_FILES", data: { dir } });
  }, [dispatch, dir,isFocused]);
  
  const handleActionPress = async () => {
    try {
      const doc = await DocumentPicker.getDocumentAsync({
        multiple: true,
        type: "*/*",
      });

      if ((doc.assets?.length || 0) <= 30 && !doc.canceled) {
        dispatch({ type: "UPLOAD_FOLDER_AND_FILES", data: {dir,doc} });
        console.log(doc);
      } else if (!doc.canceled)
        Alert.alert("Limited Files", "Only 30 files are upload at once");
    } catch (error) {
      console.log(error);
    }
  };

  const handlePullRefresh = () => {
    setPullRefresh(true);
    dispatch({ type: "GET_FOLDER_AND_FILES", data: { dir } });
    setPullRefresh(false);
  };

  const renderItem = ({ item }) => (
    <FolderOrFile
      item={item}
      route={route}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.path}>{path}</Text>
      {isGettingFoldersAndFiles ? (
        <ActivityIndicator size={"large"} />
      ) : isGettingFoldersAndFilesFailed ? (
        <View>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <Button
            title='Reload'
            onPress={handlePullRefresh}
          />
        </View>
      ) : (
        <>
          <FlatList
            data={foldersAndFiles}
            renderItem={renderItem}
            keyExtractor={(item) => item.uniqueId}
            numColumns={3}
            key={`flatlist-columns-${3}`} // Force re-render on column changes
            columnWrapperStyle={styles.columnWrapper} // Add space between columns
            ItemSeparatorComponent={() => <View style={styles.rowSeparator} />} // Add space between rows
            refreshing={pullRefresh}
            onRefresh={handlePullRefresh}
          />
          <View style={styles.floatingContainer}>
            <TouchableOpacity
              key={"Upload Files"}
              style={styles.floatingButton}
              onPress={() => handleActionPress()}
            >
              <FontAwesome
                name={"plus"}
                size={30}
                color='white'
              />
              {/* <Text style={styles.buttonText}>Upload Files</Text> */}
            </TouchableOpacity>
          </View>
        </>
      )}
      <View>
        <Modal
          isVisible={isUploadFoldersAndFiles}
          onBackdropPress={() => {
            dispatch(uploadingFoldersAndFiles(false));
          }}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Uploading: {uploadProgress}%</Text>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  errorMessage: {
    textAlign: "center",
    color: "#f41a1a",
  },
  columnWrapper: {
    justifyContent: "space-between", // Space between columns
    // backgroundColor:"#000",
    marginBottom: 20, // Row gap
  },
  rowSeparator: {
    height: 20, // Row gap
  },
  floatingContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    alignItems: "flex-end",
  },
  floatingButton: {
    backgroundColor: "#ffbc1f",
    borderRadius: 50,
    padding: 15,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
    fontSize: 18,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
  },
  path: {
    color: "gray",
  },
});
