import Categories from './components/categories';
import TodoForm from './components/todo-form';
import { Toaster } from './components/ui/sonner';
import { TodosProvider } from './context/todos-context';

function App() {
  
  return (
    <TodosProvider>
      <div className='container mx-auto space-y-4'>
        <h1 className='text-2xl font-bold'>Todo with Quadrant</h1>
        <TodoForm />
        <Categories />
      </div>
      <Toaster position='top-right' richColors />
    </TodosProvider>
  )
}

export default App
