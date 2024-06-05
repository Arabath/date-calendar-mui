import './App.css'

import Demo from './components/Demo'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient()

function App() {
  return (
    < >
      <QueryClientProvider client={queryClient}>
        <Demo />
      </QueryClientProvider>
    </>
  )
}

export default App
