import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useFileExplorer } from "./useFileExplorer";

const FileExplorer = () => {
  const { currentPath, items, navigateTo, goUp, pathHistory } =
    useFileExplorer();

  const renderItem = ({ item }: { item: { name: string; path: string } }) => (
    <TouchableOpacity onPress={() => navigateTo(item.path)} style={styles.item}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pathText}>Current Path: {currentPath}</Text>
      {pathHistory.length > 1 && (
        <TouchableOpacity onPress={goUp} style={styles.upButton}>
          <Text>Go Up</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={items}
        keyExtractor={(item) => item.path}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  pathText: {
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  upButton: {
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
});

export default FileExplorer;
