import { useState, useEffect } from 'react'
import { Input, Button, List, Checkbox, Card, Typography, Space, Popconfirm } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { Todo } from '../entities/Todo'

const { Title } = Typography

function TodoApp() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    setLoading(true)
    try {
      const response = await Todo.list()
      if (response.success) {
        setTodos(response.data)
      }
    } catch (error) {
      console.error('Error loading todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async () => {
    if (!newTodo.trim()) return
    
    try {
      const response = await Todo.create({
        title: newTodo.trim(),
        completed: false
      })
      
      if (response.success) {
        setTodos([...todos, response.data])
        setNewTodo('')
      }
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const toggleTodo = async (todo) => {
    try {
      const response = await Todo.update(todo._id, {
        ...todo,
        completed: !todo.completed
      })
      
      if (response.success) {
        setTodos(todos.map(t => 
          t._id === todo._id ? { ...t, completed: !t.completed } : t
        ))
      }
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const deleteTodo = async (todoId) => {
    try {
      // Note: The schema doesn't specify a delete method, so we'll filter locally
      // In a real app, you'd implement Todo.delete(todoId)
      setTodos(todos.filter(t => t._id !== todoId))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg">
        <div className="mb-6">
          <Title level={2} className="text-center mb-2">
            My Todo List
          </Title>
          <div className="text-center text-gray-500 mb-4">
            {completedCount} of {totalCount} tasks completed
          </div>
          
          <Space.Compact className="w-full">
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new todo..."
              className="flex-1"
              size="large"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={addTodo}
              size="large"
              disabled={!newTodo.trim()}
            >
              Add
            </Button>
          </Space.Compact>
        </div>

        <List
          loading={loading}
          dataSource={todos}
          locale={{ emptyText: 'No todos yet. Add one above!' }}
          renderItem={(todo) => (
            <List.Item
              className={`transition-all duration-200 ${
                todo.completed ? 'opacity-60' : ''
              }`}
              actions={[
                <Popconfirm
                  title="Delete this todo?"
                  description="Are you sure you want to delete this todo?"
                  onConfirm={() => deleteTodo(todo._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                  />
                </Popconfirm>
              ]}
            >
              <div className="flex items-center gap-3 flex-1">
                <Checkbox
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo)}
                />
                <span
                  className={`flex-1 ${
                    todo.completed
                      ? 'line-through text-gray-400'
                      : 'text-gray-800'
                  }`}
                >
                  {todo.title}
                </span>
              </div>
            </List.Item>
          )}
        />

        {totalCount > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total: {totalCount}</span>
              <span>Completed: {completedCount}</span>
              <span>Remaining: {totalCount - completedCount}</span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%'
                }}
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default TodoApp