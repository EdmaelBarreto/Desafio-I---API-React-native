import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";

type Pokemon = {
  name: string;
  url: string;
};

export default function App() {
  const [data, setData] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPokemons = async () => {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
      const json = await response.json();
      setData(json.results);
    } catch (err) {
      setError("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  const getPokemonImage = (url: string) => {
    const id = url.split("/")[url.split("/").length - 2];
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Pokédex</Text>

      {loading && <ActivityIndicator size="large" />}

      {error && <Text style={styles.error}>{error}</Text>}

      {!loading && !error && (
        <FlatList
          data={data}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: getPokemonImage(item.url) }}
                style={styles.image}
              />
              <Text style={styles.name}>{item.name}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  error: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 20,
  },
  name: {
    fontSize: 20,
    textTransform: "capitalize",
  },
});
