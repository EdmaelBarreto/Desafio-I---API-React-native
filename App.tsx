import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";

type Film = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const API_BASE = "https://ghibliapi.vercel.app";

export default function App() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");

  async function load() {
    try {
      const res = await fetch(`${API_BASE}/films`);
      const data: Film[] = await res.json();
      setFilms(data);
    } catch (e) {
      console.log("Erro ao carregar dados", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = query
    ? films.filter((f) =>
        f.title.toLowerCase().includes(query.toLowerCase())
      )
    : films;

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Buscar por título..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        onRefresh={load}
        refreshing={refreshing}
        ListEmptyComponent={<Text style={styles.muted}>Nenhum resultado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.image }}
              style={styles.poster}
              resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text numberOfLines={3} style={styles.cardBody}>
                {item.description}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7F9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  muted: { color: "#666" },

  input: {
    margin: 16,
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 10,
    borderColor: "#DDD",
    borderWidth: 1,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 10,
    borderColor: "#EEE",
    borderWidth: 1,
  },

  poster: {
    width: 70,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },

  cardTitle: { fontWeight: "700", marginBottom: 4, fontSize: 16 },
  cardBody: { color: "#444" },
});
