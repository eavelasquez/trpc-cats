import './App.css';
import { createReactQueryHooks } from '@trpc/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';

import Create from './cats/Create';
import Detail from './cats/Detail';
import List from './cats/List';
import type { TRPCRouter } from '../../server/src/router';

export const trpc = createReactQueryHooks<TRPCRouter>();

const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({ url: 'http://localhost:8080/cat' })
  );

  const [detailId, setDetailId] = useState(-1);

  const setDetail = (id: number) => {
    setDetailId(id);
  };

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <Create />
          <List setDetail={setDetail} />
          {detailId > 0 ? <Detail id={detailId} /> : null}
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;
