import React, {useEffect, useState} from 'react';

import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@todos';

interface todoType {
  id: string;
  text: string;
  completed: boolean;
}

function App(): JSX.Element {
  const [todos, setTodos] = useState<todoType[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');

  const [editModalVisible, setEditModalVisible] = useState(false);
const [editTodo, setEditTodo] = useState(null);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    saveTodos();
  }, [todos]);

  const changeStatus = (id: string) => {
    setTodos([
      ...todos.map(el => {
        if (el.id == id) {
          return {
            ...el,
            completed: !el.completed,
          };
        }
        return el;
      }),
    ]);
  };

  const updateTodo = text => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === editTodo.id ? {...todo, text: text} : todo,
      ),
    );
    setEditModalVisible(false);
    setEditTodo(null);
  };

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
    const todo: todoType = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
    };
    setTodos(prevTodos => [...prevTodos, todo]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? {...todo, completed: !todo.completed} : todo,
      ),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const renderTodoItem = ({item}) => (
    <View style={styles.todoItem}>
      <TouchableOpacity onPress={() => toggleTodo(item.id)}>
        <Text
          style={[styles.todoText, item.completed && styles.completedTodoText]}>
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeStatus(item.id)}>
        <Text
          style={
            item.completed ? styles.statusCompleted : styles.statusIncompleted
          }>
          {item.completed ? 'completed' : 'pending'}
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
          onChangeText={text => setNewTodo(text)}
          onSubmitEditing={addTodo}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonLabel}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        renderItem={renderTodoItem}
        keyExtractor={item => item.id}
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
    backgroundColor: 'teal',
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
  statusCompleted: {
    color: 'green',
  },
  statusIncompleted: {
    color: 'blue',
  },
});

export default App;
