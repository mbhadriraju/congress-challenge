import { Text, View, Pressable, Animated, FlatList } from "react-native";
import { Link } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import SearchBar from "@/components/SearchBar";
import { Feather } from '@expo/vector-icons';
import { Slot, useRouter, usePathname } from 'expo-router';

const key = 'https://jsonplaceholder.typicode.com/todos?_limit=20';

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const animatedValues = useRef(new Map()).current;

  
  useEffect(() => {
    if (!data) fetchData();
  }, []);

    useEffect(() => {
    return () => {
      animatedValues.forEach((value) => {
        value.setValue(0);
      });
    };
  }, []);

  const fetchData = async () => {
    console.log('fetching data!!!');
    try {
      const response = await fetch(key);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  //@ts-ignore
  const filteredData = data ? data.filter((item) => {
    const searchTerm = searchQuery.toLowerCase();
    const idString = item.id.toString().toLowerCase();
    return idString.includes(searchTerm);
  }) : [];

  const animateButton = (toValue: number) => {
    Animated.timing(animatedValue, {
      toValue,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  type dataProps = {
    id: string;
    userId: string;
  };

  const animateListItem = (id: string, toValue: number) => {
    const animatedValue = getAnimatedValue(id);
    if (animatedValue) {
      Animated.timing(animatedValue, {
        toValue,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }
  };
  const getAnimatedValue = (id: string) => {
    if (!animatedValues.has(id)) {
      const newValue = new Animated.Value(0);
      animatedValues.set(id, newValue);
      return newValue;
    }
    return animatedValues.get(id);
  };

  const Data = ({ id, userId }: dataProps) => {
    const itemBackgroundColor = getAnimatedValue(id).interpolate({
      inputRange: [0, 1],
      outputRange: ['#181C14', '#111410'] 
    });

    return (
      <Link href={`./spec/${id}`} asChild>
        <Pressable 
          onPressIn={() => animateListItem(id, 1)}
          onPressOut={() => animateListItem(id, 0)}
        >
          <Animated.View 
            style={{ backgroundColor: itemBackgroundColor }}
            className="rounded-lg p-4 mb-4 flex-row items-center"
          >
            <View className="flex-1 mr-4">
              <Text className="text-col1 text-lg font-bold">{id}</Text>
              <Text className="text-col2 text-base flex-shrink">{userId}</Text>
            </View>
            <Feather name="chevron-right" size={24} color="white" />
          </Animated.View>
        </Pressable>
      </Link>
    );
  };

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#4E4FEB', '#3a3bb8']
  });

  return (
    <FlatList
      className="flex-1 bg-col4 px-5 pt-16"
      data={filteredData}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => <Data id={item.id} userId={item.userId} />}
      ListHeaderComponent={
        <>
          <SearchBar 
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocusChange={setIsSearchFocused}
          />
          {!isSearchFocused && (
            <View className="mt-4">
              <Text className="text-col2 py-10 text-6xl font-bold text-center">
                BenePro
              </Text>
              <Text className="text-col1 text-xl font-bold text-center px-8">
                This application allows users to identify the benefits they qualify for by answering a quick series of questions
              </Text>
              <Link href="/quest" asChild>
                <Pressable
                  className="mt-10 items-center"
                  onPressIn={() => animateButton(1)}
                  onPressOut={() => animateButton(0)}
                >
                  <Animated.View 
                    style={{backgroundColor}}
                    className="rounded-lg">
                    <Text className="text-white text-2xl font-bold px-6 py-3">
                      Start Questionnaire
                    </Text>
                  </Animated.View>
                </Pressable>
              </Link>
            </View>
          )}
          <Text className="text-col1 mt-10 mb-6 text-5xl font-bold">Benefits</Text>
        </>
      }
       ListEmptyComponent={
        <Text className="text-col1 text-center mt-4">
          No benefits found matching your search
        </Text>
      }
    />
  );
}