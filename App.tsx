/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;



function App(): JSX.Element {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

   useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    saveTodos();
  }, [todos]);

  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTodos !== null) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.log('Error loading todos', error);
    }
  };

  const saveTodos = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.log('Error saving todos', error);
    }
  };

  const addTodo = () => {
    if (newTodo.trim() === '') {
      return; // Don't add empty todos
    }
    const todo = { id: Date.now().toString(), text: newTodo, completed: false };
    setTodos((prevTodos) => [...prevTodos, todo]);
    setNewTodo('');
  };

  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const renderTodoItem = ({ item }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity onPress={() => toggleTodo(item.id)}>
        <Text style={[styles.todoText, item.completed && styles.completedTodoText]}>
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTodo(item.id)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Todo App</Text>
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Enter a new todo"
        value={newTodo}
        onChangeText={(text) => setNewTodo(text)}
        onSubmitEditing={addTodo}
      />
      <TouchableOpacity style={styles.addButton} onPress={addTodo}>
        <Text style={styles.addButtonLabel}>Add</Text>
      </TouchableOpacity>
    </View>
    <FlatList
      data={todos}
      renderItem={renderTodoItem}
      keyExtractor={(item) => item.id}
      style={styles.todoList}
    />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  todoList: {
    marginTop: 10,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  todoText: {
    fontSize: 16,
  },
  completedTodoText: {
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default App;
