import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { GlobalContextProvider } from "./context/GlobalContext"

import router from "./router";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContextProvider>
        <RouterProvider router={router} />
      </GlobalContextProvider>
    </QueryClientProvider>
  )
}

export default App;