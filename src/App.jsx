import { useState, useEffect } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import FormModal from './components/FormModal'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tgtmyfnuotpbqwwtkeer.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRndG15Zm51b3RwYnF3d3RrZWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE3MTg0MDcsImV4cCI6MjAwNzI5NDQwN30.t75LmWdWJw3W8igvrVR5T_r7M3y0MEtUPuyvTPeXxeo'
const supabase = createClient(supabaseUrl, supabaseKey)



const defaultTodo = {
  text: '',
  points: '',
}

function App() {
  const [todos, setTodos] = useState([])
  const [todoEdit, setTodoEdit] = useState(defaultTodo)
  const [showModal, setShowModal] = useState(false)

  const fetchTodos = async () => {
    
  let { data, error } = await supabase
    .from('todos')
    .select('*')
    console.log(data);
    setTodos([...data])
  }

  useEffect(() => {
   fetchTodos() 
  },[])

  const handleToggleCompleted = (id) => {
    const newTodos = todos.map((todo) => {
      if(todo.id === id){
        return {...todo, completed: !todo.completed}
      }
      return todo
    })
    setTodos(newTodos)
  }

  const onSubmitForm = async (newTodo) => {
    if(newTodo.id){
      //update
    const { data, error } = await supabase
      .from('todos')
      .update(newTodo)
      .eq('id', newTodo.id) //kita nak update row yg id dia matching newTodo.id
      .select()
      console.log(data);

      // local data (browser)
      // const newTodos = todos.map((todo) => {
      //   if(todo.id === newTodo.id){
      //     return data[0]
      //   }
      //   return todo
      // })
      // setTodos(newTodos)

      fetchTodos()
    }else{
      //create
      // const newTodos = [...todos, {...newTodo, id: todos.length + 1}]
      // setTodos(newTodos)
        debugger
      const { data, error } = await supabase
        .from('todos')
        //array of object which contain column & value yang kita nak
        .insert([newTodo])
        .select()
        
        console.log(data);
    }
  }

  const toggleEdit = (todo) => {
    setTodoEdit(todo)
    setShowModal(true)
  }

  const onCloseModal = () => {
    setTodoEdit(null)
    setShowModal(false)
  }

  return (
      <div className="row mt-5 justify-content-center">
        <div className="col-6 align-self-center">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title">Todo List</h1>
            </div>
            <div className="card-body">
              <ul className="list-group">
                {todos.map((todo) => (
                  <li key={todo.id} className="list-group-item">
                    <div className="row">
                      <div className="col-2">
                        <input type="checkbox" defaultChecked={todo.completed} onChange={() => handleToggleCompleted(todo.id)}/>
                      </div>
                      <div className="col-10">
                        <div>
                          {todo.text}
                          <span className="mx-2 badge bg-primary">{todo.points}</span>
                          <span className="badge bg-secondary">{todo?.user?.name}</span>
                          <span className='mx-2 text-primary' onClick={()=> {toggleEdit(todo)}}>edit</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
                <div className='btn btn-primary mt-2' onClick={()=> toggleEdit(defaultTodo)}>Add Todo</div>
              </ul>
            </div>
        </div>
      </div>
      <FormModal showModal={showModal} todo={todoEdit} onCloseModal={onCloseModal} onSubmitForm={onSubmitForm}/>
    </div>
  )
}

export default App
